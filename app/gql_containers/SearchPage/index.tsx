import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';

import { Query } from "react-apollo";
import gql from "graphql-tag";
import  SearchView  from "./view";
import { AggFilterMap, SearchParams, defaultPageSize,
        encodeSearchParams, getSearchParamsFromURL,
        flattenAggs, expandAggs} from './Types'
import { withClientState, ClientState } from '../../components/Apollo/LocalStateDecorator'

const search_query = (fields) => {
  let data;
  if (fields && fields.length > 0) {
    const field_list = fields.map(name => `${name}: field(name: "${name}")`).join('\n')
    data = `data { ${field_list} }`
  }
  return gql`
    query ($q: String, $page:Int, $pageSize:Int, $sort:[String!], $aggFilters:[AggFilter!]) {
       crowdAggs: aggBuckets(params: {q: $q, agg: "front_matter_keys"}) {
         aggs {
            buckets {
                key
                docCount
            }
        }
      }
      search (params: {q: $q, page: $page, pageSize: $pageSize, sorts: $sort, aggFilters:$aggFilters }) {
        recordsTotal
        aggs {
          name
          buckets {
            key
            docCount
          }
        }
        ${data}
      }
    }`
}

interface SearchState {
  cols: string[]
  aggFilters: AggFilterMap
  crowdAggFilters: AggFilterMap
  page: number
  pageSize: number
  sorts: any
  oldGridData: any
}

interface OldCrustyAuthHeader {
  sessionChecked : boolean
  user : { search_result_columns : any }
}

interface SearchProps {
  loading : boolean
  apolloClient: any
  clientState: ClientState
  updateClientState: (x:ClientState) => void
  AuthHeader: OldCrustyAuthHeader
  history : any
}

// Replace redux with a simple component to store the page state
export class Search extends React.Component<SearchProps,SearchState> {
  constructor(props) {
    super(props)
    this.state = {
      cols: ['nct_id', 'average_rating', 'title', 'overall_status', 'start_date', 'completion_date'],
      // map aggName -> Set of selected args
      aggFilters: {},
      crowdAggFilters: {},
      page: 0,
      pageSize: defaultPageSize,
      sorts: [],
      oldGridData: null,
    }
  }

  query() { return this.props.clientState.searchQuery; }

  componentWillMount() {
    // load url state
    const decoded = getSearchParamsFromURL()
    if (decoded) {
      console.log(decoded)

      const aggFilters = expandAggs(decoded.aggFilters)
      const crowdAggFilters = expandAggs(decoded.crowdAggFilters)

      this.mergeState({ 
        page: decoded.page || this.state.page,
        pageSize: decoded.pageSize || this.state.pageSize,
        aggFilters,
        crowdAggFilters,
        sort: decoded.sort
      });
      // If there is a query use it
      if (decoded.q) {
        this.props.updateClientState({ searchQuery: decoded.q })
      }
    }
  }

  columns() {
    if (_.get(this.props, 'AuthHeader.user.search_result_columns')) {
      return Object.keys(this.props.AuthHeader.user.search_result_columns)
    }
    else {
      return this.state.cols
    }
  }

  addAggFilter = (agg, item, isCrowd) => {
      console.log(`add '${item}' to ${agg}`);
      const aggFilters = isCrowd ? this.state.crowdAggFilters : this.state.aggFilters
      const filter = new Set(aggFilters[agg])
      filter.add(item)
      const filterProp = isCrowd ? "crowdAggFilters" : "aggFilters"
      this.mergeState({ [filterProp]: { ... aggFilters, [agg]: filter }})
  }
  removeAggFilter = (agg, item, isCrowd) => {
      console.log(`remove '${item}' from ${agg}`);
      const aggFilters = isCrowd ? this.state.crowdAggFilters : this.state.aggFilters
      const filter = new Set(aggFilters[agg])
      if (filter.delete(item)) {
        const filterProp = isCrowd ? "crowdAggFilters" : "aggFilters"
        this.mergeState({ [filterProp]: { ... aggFilters, [agg]: filter }})
      }
  }
  handleGridUpdate = (gridData) => {
      if (this.state.oldGridData != gridData) {
        const {sorted,page,pageSize} = gridData
        // const sorts = sorted.map(x => x.id);
        const sorts = null;
        this.mergeState({ oldGridData:gridData, page, pageSize, sorts })
      }
  }

  // queryOverride overrides the query string on props
  // This might happen during initial load because we are decoding
  // the query string from the url but haven't yet set it on the store
  mergeState = (args) => {
      let newState = { ... this.state, ... args } as SearchState
      this.setState(newState)
      // this.updateUrl(newState, queryOverride);
  }

  updateUrl = (state: SearchState) => {
      const params = this.getQueryParams(state);
      const encoded = encodeSearchParams(params)
      const query = params.q
      const newLocation = encoded === "" ? 
                          `/search/${query}` :
                          `/search/${query}?p=${encoded}`;
      const u = new URL(window.location.href)
      const curLocation = u.pathname + u.search
      if (curLocation != newLocation) {
        this.props.history.push(newLocation)
      }
  }

  getQueryParams = (state:SearchState) => { 
    const filters = flattenAggs(state.aggFilters)
    const crowdFilters = flattenAggs(state.crowdAggFilters)
    // const sorts = _.get(this, "state.sorts", null)
    return { 
        q: this.props.clientState.searchQuery,
        page: state.page,
        pageSize: state.pageSize,
        aggFilters: filters,
        crowdAggFilters: crowdFilters,
        sort: []
    } as SearchParams;
  }

  // Agg management
  //

  render_search = (result) => {
    const {loading,error,data} = result || {loading:null,error:true,data:null};
    if (error) {
      console.log(error)
      if (error.networkError) {
          return <div>Invalid response. {error.networkError.toString()}</div>
      }
      return <div>{error.graphQLErrors.map(e => <div>{e.message}</div>)}</div>
    }
    const crowdAggs = _.get(data, "crowdAggs.aggs[0].buckets", [])
    return <SearchView 
      loading={loading} 
      history={this.props.history}
      gridProps={{
        columns: this.columns(),
        rows: data.search && data.search.data,
        handleGridUpdate: this.handleGridUpdate,
        page: this.state.page,
        pageSize: this.state.pageSize,
        recordsTotal: data.search && data.search.recordsTotal
      }}
      aggProps={{
        aggs: data.search && data.search.aggs,
        crowdAggs: crowdAggs,
        searchParams: this.getQueryParams(this.state),
        aggFilters: this.state.aggFilters,
        crowdAggFilters: this.state.crowdAggFilters,
        addFilter: this.addAggFilter,
        removeFilter: this.removeAggFilter,
      }}

      />
  }

  render() {
    if (this.props.AuthHeader.sessionChecked && !this.props.loading) {
      const query = search_query(this.columns())
      const params = this.getQueryParams(this.state)
      this.updateUrl(this.state)
      console.log("Submitting query...")
      console.log(JSON.stringify(params))
      return <Query query={query} variables={params}>
        { this.render_search } 
        </Query>
    }
    else {
      return <SearchView 
        loading={true}
        gridProps={{
          columns:this.columns(),
          rows: [],
          handleGridUpdate:this.handleGridUpdate
        }} />
    }
  }
}

//
// Eventually all of this connect/selector stuff gets replaced with
// the apollo client state
const mapStateToProps = createStructuredSelector({
  AuthHeader: makeSelectAuthHeader(),
});
const withConnect = connect(mapStateToProps);

export default compose(
  withConnect
  (withClientState(Search)))