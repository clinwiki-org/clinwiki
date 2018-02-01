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
import SearchInput from 'components/SearchInput';
import ClinwikiHeader from 'components/ClinwikiHeader';
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
  }

  onFetchData(state) {
    this.props.actions.dataFetched(state, this.props.match);
  }

  render() {
    return (
      <SearchWrapper>
        <Helmet>
          <title>SearchPage</title>
          <meta name="description" content="Description of SearchPage" />
        </Helmet>
        <div id="search-sidebar">
          <SearchInput
            query={this.props.SearchPage.query}
            searchChanged={this.props.actions.searchChanged}
            history={this.props.history}
          />
          <Aggs
            aggFilters={this.props.SearchPage.aggFilters}
            aggs={this.props.SearchPage.aggs}
            actions={this.props.actions}
          />
        </div>
        <div id="search-main">
          <Grid>
            <ClinwikiHeader />
            <Row>
              <Col md={12}>
                <ReactTable
                  columns={getColumns()}
                  manual
                  onFetchData={this.onFetchData}
                  data={this.props.SearchPage.data}
                  pages={this.props.SearchPage.pages}
                  loading={this.props.SearchPage.loading}
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
    query: PropTypes.string,
    loading: PropTypes.bool,
    aggFilters: PropTypes.object,
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
