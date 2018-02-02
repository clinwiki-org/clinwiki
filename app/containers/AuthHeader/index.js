/**
 *
 * AuthHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import styled from 'styled-components';

import { Navbar } from 'react-bootstrap';

import AuthButton from 'components/AuthButton';
import SearchInput from 'components/SearchInput';

import * as searchActions from 'containers/SearchPage/actions';

import injectSaga from 'utils/injectSaga';
import makeSelectAuthHeader from './selectors';
import saga from './saga';
import * as actions from './actions';

const SearchInputWrapper = styled.div`
  margin-top: 7px;
  margin-right: 15px;
`;

export class AuthHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">
              ClinWiki
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <AuthButton
          user={this.props.authheader.user}
          history={this.props.history}
        />
        <SearchInputWrapper className="pull-right">
          <SearchInput
            history={this.props.history}
            searchChanged={this.props.searchActions.searchChanged}
          />
        </SearchInputWrapper>
      </Navbar>
    );
  }
}

AuthHeader.propTypes = {
  history: ReactRouterPropTypes.history,
  authheader: PropTypes.shape({
    user: PropTypes.object,
  }),
  searchActions: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  authheader: makeSelectAuthHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    searchActions: bindActionCreators(searchActions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


const withSaga = injectSaga({ key: 'authHeader', saga });

export default compose(
  withSaga,
  withConnect,
  withRouter,
)(AuthHeader);
