
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
    this.state = {
      cols: ['nct_id', 'average_rating', 'title', 'overall_status', 'start_date', 'completion_date'],
      // map aggName -> Set of selected args
      aggFilters: {},
      query: "",
      page: 0,
      pageSize: 25,
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

  mergeState = (args) => {
      let newState = { ... this.state, ... args }
      this.setState(newState)
  }

  // Agg management
  //

  render_search = ({loading,error,data}) => {
    console.log(`render-loading=${loading}`)
    if (error) {
      console.log(error)
      return <div>{error.graphQLErrors.map(e => <div>{e.message}</div>)}</div>
    }
    return <SearchView 
      loading={loading} 
      cols={this.columns()} 
      rows={data.search && data.search.data} 
      gridProps={{pageSize: this.state.pageSize, page: this.state.page}}
      aggs={data.search && data.search.aggs} 
      crowdAggs={[]}
      aggFilters={this.state.aggFilters}
      addFilter={this.addAggFilter}
      removeFilter={this.removeAggFilter}
      />
  }

  render() {
    if (this.props.AuthHeader.sessionChecked) {
      const query = search_query(this.columns())
      const filters = 
        Object.keys(this.state.aggFilters)
        .filter(k => this.state.aggFilters[k].size > 0)
        .map(k => ({field: k, values: [...this.state.aggFilters[k].values()]}))
      const params = {
          q: this.state.query,
          page: this.state.page,
          pageSize: this.state.pageSize,
          aggFilters: filters.length == 0 ? undefined : filters
      }
      console.log(params)
      return <Query query={query} variables={{params: params}}>
        { this.render_search }
        </Query>
    }
    else {
      return <SearchView 
        loading={true}
        cols={this.columns()} />
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