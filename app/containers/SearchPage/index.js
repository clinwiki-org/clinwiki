/**
 *
 * SearchPage
 *
 */

import _ from 'lodash';
import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-bootstrap';
import ReactStars from 'react-stars';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingPane from 'components/LoadingPane';
import SearchFieldName from 'components/SearchFieldName';
import Aggs from 'components/Aggs';
import makeSelectAuthHeader from '../AuthHeader/selectors';
import makeSelectSearchPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

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

export class SearchPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.onFetchData = this.onFetchData.bind(this);
    this.onAggViewed = this.onAggViewed.bind(this);
    this.onAggSelected = this.onAggSelected.bind(this);
    this.onAggRemoved = this.onAggRemoved.bind(this);
    this.tdProps = this.tdProps.bind(this);
  }

  onAggViewed(k) {
    this.props.actions.aggViewed(k);
  }

  onAggSelected(k, v) {
    this.props.actions.aggSelected(k, v);
  }

  onAggRemoved(k, v) {
    this.props.actions.aggRemoved(k, v);
  }

  onFetchData(state) {
    this.props.actions.dataFetched(state, this.props.match);
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
      };
      if (col.match('rating')) {
        spec.Cell = (row) => (
          <ReactStars
            count={5}
            edit={false}
            value={row.value}
          />);
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

  render() {
    if (!this.props.AuthHeader.sessionChecked) {
      return <LoadingPane />;
    }
    return (
      <SearchWrapper>
        <Helmet>
          <title>SearchPage</title>
          <meta name="description" content="Description of SearchPage" />
        </Helmet>
        <Row>
          <Col md={2} id="search-sidebar">
            <Aggs
              aggFilters={this.props.SearchPage.aggFilters}
              aggs={this.props.SearchPage.aggs}
              onAggViewed={this.props.actions.aggViewed}
              onAggRemoved={this.props.actions.aggRemoved}
              onAggSelected={this.props.actions.aggSelected}
            />
          </Col>
          <Col md={10} id="search-main">
            <Grid>
              <Row>
                <Col md={12}>
                  <ReactTable
                    className="-striped -highlight"
                    columns={this.getColumns()}
                    manual
                    onFetchData={this.onFetchData}
                    data={this.props.SearchPage.data}
                    pages={this.props.SearchPage.pages}
                    loading={this.props.SearchPage.loading}
                    defaultPageSize={this.props.SearchPage.params.pageSize}
                    getTdProps={this.tdProps}
                    defaultSorted={this.getDefaultSorted()}
                    defaultSortDesc
                  />
                </Col>
              </Row>
            </Grid>
          </Col>
        </Row>
      </SearchWrapper>
    );
  }
}

SearchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  SearchPage: PropTypes.shape({
    data: PropTypes.array,
    recordsTotal: PropTypes.number,
    pages: PropTypes.number,
    aggs: PropTypes.object,
    searchQuery: PropTypes.string,
    loading: PropTypes.bool,
    aggFilters: PropTypes.object,
    params: PropTypes.shape({
      pageSize: PropTypes.number,
    }),
  }),
  AuthHeader: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  SearchPage: makeSelectSearchPage(),
  AuthHeader: makeSelectAuthHeader(),
});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'SearchPage', reducer });
const withSaga = injectSaga({ key: 'SearchPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SearchPage);
