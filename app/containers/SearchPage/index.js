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
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import styled from 'styled-components';
import { Nav, NavItem, Grid, Row, Col } from 'react-bootstrap';
import ReactStars from 'react-stars';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import ClinwikiHeader from 'components/ClinwikiHeader';
import makeSelectSearchPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
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
    header: 'nct id',
    accessor: 'nct_id',
  }, {
    header: 'rating',
    accessor: 'Overall Rating',
    Cell: (row) => (
      <ReactStars
        count={5}
        edit={false}
        value={row.value}
      />),
  }, {
    header: 'title',
    accessor: 'title',
  },
]);

export class SearchPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.actions.searchMounted(this.props.match.params.searchQuery);
  }

  render() {
    return (
      <SearchWrapper>
        <Helmet>
          <title>SearchPage</title>
          <meta name="description" content="Description of SearchPage" />
        </Helmet>
        <Nav id="search-sidebar">
          <NavItem>
            in here
          </NavItem>
          <NavItem>
            <FormattedMessage {...messages.header} />
          </NavItem>
        </Nav>
        <div id="search-main">
          <Grid>
            <ClinwikiHeader />
            <Row>
              <Col md={12}>
                <ReactTable
                  columns={getColumns()}
                  manual
                  data={this.props.SearchPage.data}
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
  SearchPage: PropTypes.shape({
    data: PropTypes.array,
    recordsTotal: PropTypes.number,
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
