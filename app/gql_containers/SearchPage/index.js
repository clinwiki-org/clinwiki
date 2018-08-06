
import React from 'react';
import _ from 'lodash';
import LoadingPane from 'components/LoadingPane';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';

import ReactTable from 'react-table';
import ReactStars from 'react-stars';
import 'react-table/react-table.css';

import SearchFieldName from 'components/SearchFieldName';
import Aggs from '../../components/Aggs';

import { Query } from "react-apollo";
import gql from "graphql-tag";


const SearchWrapper = styled.div`
  .rt-tr {
    cursor: pointer;
  }
  #search-sidebar{
    padding-right: 0;
  }
  #search-main {
    padding-left: 0;
    padding-top: 6px;
  }
`;


// const QUERY_AGG_BUCKETS=gql`
//   query ($agg : String!) {
//     aggBuckets(params: {agg: $agg}) {
//       aggs {
//         name
//         docCountErrorUpperBound
//         sumDocOtherCount
//         buckets {
//           key
//           docCount
//         }
//       }
//     }
//   }`

const SEARCH_QUERY=gql`
query ($params:SearchInput!) {
  search (params:$params) {
    recordsTotal
    aggs {
      name
      docCountErrorUpperBound
      sumDocOtherCount
      buckets {
        key
        doc_count: docCount
      }
    }
    data {
      nct_id: field(name: "nct_id")
      average_rating: field(name: "average_rating")
      title: field(name: "title")
      overall_status: field(name: "overall_status")
      #start_date: field(name: "start_date")
      #completion_date: field(name: "completion_date")
    }
  }
}`


export class GqlSearchPage extends React.PureComponent {
  constructor(props) {
      super(props)
  }

  getColumnsList() {
    let cols = ['nct_id', 'average_rating', 'title', 'overall_status', 'start_date', 'completion_date'];
    if (_.get(this.props, 'AuthHeader.user.search_result_columns')) {
      cols = Object.keys(this.props.AuthHeader.user.search_result_columns);
    }
    return cols;
  }

  getColumns() {
    return this.getColumnsList().map((col) => {
      const spec = {
        Header: <SearchFieldName field={col} />,
        accessor: col,
        style: {
          overflowWrap: 'break-word',
          overflow: 'visible',
          whiteSpace: 'normal',
        },
      };
      if (col.match('rating')) {
        spec.Cell = (row) => (
          <ReactStars
            count={5}
            edit={false}
            value={row.value}
          />);
        spec.style.textAlign = 'center';
      }
      return spec;
    });
  }
  
  getDefaultSorted() {
    if (_.includes(this.getColumnsList(), 'average_rating')) {
      return [{ id: 'average_rating', desc: true }];
    }
    return [];
  }

  tdProps(__, rowInfo) {
    return {
      onClick: (e, handleOriginal) => {
        this.props.history.push(`/study/${rowInfo.row.nct_id}`);
        return handleOriginal();
      },
    };
  }

  render_aggs(data,client) {
    const empty = {}
    const ignore = ()=>{}

    // Next step:
    // Do less mappnig here and instead change Aggs component
    // to use gql field names. Drop support for old search page
    // * Use QUERY_AGG_BUCKETS to get full bucket list on first view
    //   - let apollo InMemoryCache handle not sending the same query again

    const reducer = (acc,agg) => {
      acc[agg.name] = {
        buckets: agg.buckets,
        doc_count_error_upper_bound : agg.docCountErrorUpperBound,
        sum_other_doc_count: agg.sumDocOtherCount,
        loading: false,
        loaded: false
      };
      return acc;
    }
    const aggs = data.search.aggs.reduce(reducer, {})

    return <Aggs
            aggFilters={empty}
            aggs={aggs}
            onAggViewed={ignore}
            onAggRemoved={ignore}
            onAggSelected={ignore}
            crowdAggs={empty}
            />
  }
  render_search_result(loading, data) {
    const empty = {}
    const ignore = ()=>{}
    const rows = 
      _.get(data, "search.data") || []
    const pageSize = 25 // from @client state
    const totalPages = loading ? 0 : Math.ceil(data.search.recordsTotal / pageSize);

    return <Grid>
            <Row>
              <Col md={12}>
                <ReactTable
                  className="-striped -highlight"
                  columns={this.getColumns()}
                  manual
                  onFetchData={ignore}
                  data={rows}
                  pages={totalPages}
                  loading={loading}
                  defaultPageSize={pageSize}
                  getTdProps={this.tdProps}
                  defaultSorted={this.getDefaultSorted()}
                  defaultSortDesc
                />
              </Col>
            </Row>
          </Grid>
  }

  render_query = ({loading,error,data,client}) => {
    if (error) {
      console.log(error)
      return <div>{error.graphQLErrors.map(e => <div>{e.message}</div>)}</div>
    }
    return <Row>
        <Col md={2} id="search-sidebar">
          { loading ? <LoadingPane /> : this.render_aggs(data,client) }
        </Col>
        <Col md={10} id="search-main">
          { this.render_search_result(loading, data) }
        </Col>
      </Row>
  }

  render() {
    if (!this.props.AuthHeader.sessionChecked) {
        return <LoadingPane />
    }

    // query params will eventually come from apollo-link local state
    // will probably need to be a second query
    const query_param = {
      params: {
        q: "", 
        pageSize: 25, 
        sorts: ["average_rating desc"], 
        aggFilters: [
          {field: "phase", values: ["Early Phase 1", "Phase 1"]}, 
          // {field: "browse_condition_mesh_terms", values: ["Brain Neoplasms", "Breast Neoplasms"]}, 
          // {field: "overall_status", values: ["Recruiting"]}
        ]
      }
    }

    return <SearchWrapper>
    <Helmet>
      <title>Search</title>
      <meta name="description" content="Description of SearchPage" />
    </Helmet>
    <Query query={SEARCH_QUERY} variables={query_param}>
      {this.render_query}
    </Query>
    </SearchWrapper>
  }
}

// TODO: Write the auth header to the Apollo store and query it
// That will make it easier when we eventually move auth to graphql
const mapStateToProps = createStructuredSelector({
  AuthHeader: makeSelectAuthHeader(),
});
const withConnect = connect(mapStateToProps);

export default compose(
  withConnect
  (GqlSearchPage))