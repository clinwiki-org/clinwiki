/**
 *
 * AuthHeader
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import styled from 'styled-components';

import { Navbar } from 'react-bootstrap';

import AuthButton from 'components/AuthButton';
import SearchInput from 'components/SearchInput';


import makeSelectAuthHeader from './selectors';
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
            <Link id="logo" to="/">
             ClinWiki
            </Link>
          </Navbar.Brand>
        </Navbar.Header>
        <AuthButton
          user={this.props.authheader.user}
          history={this.props.history}
        />
        <SearchInputWrapper className="pull-right">
          <SearchInput />
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
};

const mapStateToProps = createStructuredSelector({
  authheader: makeSelectAuthHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(
  withConnect,
  withRouter,
)(AuthHeader);
