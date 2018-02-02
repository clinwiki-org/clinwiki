/**
 *
 * AuthHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Navbar } from 'react-bootstrap';

import AuthButton from 'components/AuthButton';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAuthHeader from './selectors';
import reducer from './reducer';
import saga from './saga';

export class AuthHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            ClinWiki
          </Navbar.Brand>
        </Navbar.Header>
        <AuthButton user={this.props.authheader.user} />
      </Navbar>
    );
  }
}

AuthHeader.propTypes = {
  authheader: PropTypes.shape({
    user: PropTypes.object,
  }),
};

const mapStateToProps = createStructuredSelector({
  authheader: makeSelectAuthHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'authHeader', reducer });
const withSaga = injectSaga({ key: 'authHeader', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AuthHeader);
