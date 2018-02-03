/**
 *
 * SearchPage
 *
 */

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
import Aggs from 'components/Aggs';
import makeSelectSearchPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

const SearchWrapper = styled.div`
  display: flex;
  align-items: stretch;

  #search-sidebar {
    min-width: 200px;
    max-width: 200px;
  }
`;

// todo this should be configurable
const getColumns = () => ([
  {
    Header: 'nct id',
    accessor: 'nct_id',
  }, {
    Header: 'rating',
    accessor: 'Overall Rating',
    Cell: (row) => (
      <ReactStars
        count={5}
        edit={false}
        value={row.value}
      />),
  }, {
    Header: 'title',
    accessor: 'title',
  },
]);

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

  tdProps(_, rowInfo) {
    return {
      onClick: (e, handleOriginal) => {
        this.props.history.push(`/study/${rowInfo.row.nct_id}`);
        return handleOriginal();
      },
    };
  }

  render() {
    return (
      <SearchWrapper>
        <Helmet>
          <title>SearchPage</title>
          <meta name="description" content="Description of SearchPage" />
        </Helmet>
        <div id="search-sidebar">
          <Aggs
            aggFilters={this.props.SearchPage.aggFilters}
            aggs={this.props.SearchPage.aggs}
            onAggViewed={this.props.actions.aggViewed}
            onAggRemoved={this.props.actions.aggRemoved}
            onAggSelected={this.props.actions.aggSelected}
          />
        </div>
        <div id="search-main">
          <Grid>
            <Row>
              <Col md={12}>
                <ReactTable
                  columns={getColumns()}
                  manual
                  onFetchData={this.onFetchData}
                  data={this.props.SearchPage.data}
                  pages={this.props.SearchPage.pages}
                  loading={this.props.SearchPage.loading}
                  pageSize={this.props.SearchPage.params.pageSize}
                  getTdProps={this.tdProps}
                />
              </Col>
            </Row>
          </Grid>
        </div>
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
};

const mapStateToProps = createStructuredSelector({
  SearchPage: makeSelectSearchPage(),
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
