
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';

import { Query } from "react-apollo";
import gql from "graphql-tag";
import  SearchView  from "./view";



const search_query = (fields) => {
  let data;
  if (fields && fields.length > 0) {
    const field_list = fields.map(name => `${name}: field(name: "${name}")`).join('\n')
    data = `data { ${field_list} }`
  }
  return gql`
    query ($params:SearchInput!) {
      search (params:$params) {
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

// Replace redux with a simple component to store the page state
export class SearchState extends React.Component {
  constructor(props) {
    super(props)
    const query = _.get(props, "match.params.searchQuery", "")
    this.state = {
      cols: ['nct_id', 'average_rating', 'title', 'overall_status', 'start_date', 'completion_date'],
      // map aggName -> Set of selected args
      aggFilters: {},
      query: query,
      page: 0,
      pageSize: 20,
      sorts: []
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

  addAggFilter = (agg, item) => {
      console.log(`add '${item}' to ${agg}`);
      const aggFilters = (this.state.aggFilters)
      const filter = new Set(aggFilters[agg])
      filter.add(item)
      this.mergeState({ aggFilters: { ... aggFilters, [agg]: filter }})
  }
  removeAggFilter = (agg, item) => {
      console.log(`remove '${item}' from ${agg}`);
      const aggFilters = this.state.aggFilters
      const filter = new Set(aggFilters[agg])
      if (filter.delete(item)) {
          this.mergeState({ aggFilters: {... aggFilters, [agg]: filter }})
      }
  }
  handleGridUpdate = (gridData) => {
      if (this.state.oldGridData != gridData) {
        const {sorted,page,pageSize} = gridData
        const sorts = sorted.map(x => x.id);
        this.setState({ ... this.state, oldGridData:gridData, page, pageSize, sorts })
      }
  }

  mergeState = (args) => {
      let newState = { ... this.state, ... args }
      this.setState(newState)
  }

  // Agg management
  //

  render_search = ({loading,error,data}) => {
    if (error) {
      console.log(error)
      if (error.networkError) {
          return <div>Invalid response. {error.networkError.toString()}</div>
      }
      return <div>{error.graphQLErrors.map(e => <div>{e.message}</div>)}</div>
    }
    const gridProps = {
        page: this.state.page,
        pageSize: this.state.pageSize,
        recordsTotal: data.search && data.search.recordsTotal
    }
    return <SearchView 
      loading={loading} 
      columns={this.columns()} 
      rows={data.search && data.search.data} 
      gridProps={gridProps}
      handleGridUpdate={this.handleGridUpdate}
      aggs={data.search && data.search.aggs} 
      crowdAggs={[]}
      aggFilters={this.state.aggFilters}
      addFilter={this.addAggFilter}
      removeFilter={this.removeAggFilter}
      history={this.props.history}
      />
  }

  render() {
    if (this.props.AuthHeader.sessionChecked) {
      const query = search_query(this.columns())
      const filters = 
        Object.keys(this.state.aggFilters)
        .filter(k => this.state.aggFilters[k].size > 0)
        .map(k => ({field: k, values: [...this.state.aggFilters[k].values()]}))
      const sorts = _.get(this, "state.sorts", null)
      const params = {
          q: this.state.query,
          page: this.state.page,
          pageSize: this.state.pageSize,
          sorts,
          aggFilters: filters.length == 0 ? undefined : filters
      }
      return <Query query={query} variables={{params: params}}>
        { this.render_search }
        </Query>
    }
    else {
      return <SearchView 
        loading={true}
        columns={this.columns()} 
        handleGridUpdate={this.handleGridUpdate}
        />
    }
  }
}

const mapStateToProps = createStructuredSelector({
  AuthHeader: makeSelectAuthHeader(),
});
const withConnect = connect(mapStateToProps);

export default compose(
  withConnect
  (SearchState))