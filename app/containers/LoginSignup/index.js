/*
 *
 * LoginSignup
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ReactSignupLoginComponent from 'react-signup-login-component';
import FontAwesome from 'react-fontawesome';
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import AlertContainer from 'react-alert';
import { makeSelectAuthState } from '../App/selectors';
import makeSelectLoginSignup from './selectors';
import { loginAction, signupAction, logoutAction } from './actions';


export class LoginSignup extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleRecoverPassword = this.handleRecoverPassword.bind(this);
    if (props.route.path === '/logout') {
      props.logout().then(() => props.router.push('/'));
    }
  }

  componentWillReceiveProps(props) {
    if (props.LoginSignup.errors) {
      this.msg.show(
        <ListGroup>
          {Object.keys(props.LoginSignup.errors).map((key) => (
            <ListGroupItem key={key} bsStyle="danger">
              <b>{key}</b> {props.LoginSignup.errors[key]}
            </ListGroupItem>
          ))}
        </ListGroup>, {
          time: 10000,
          type: 'error',
          icon: <FontAwesome name="warning" />,
        });
    }
    if (props.route.path === '/logout') {
      props.logout().then(() => this.props.router.push('/login-signup'));
    }
  }

  handleLogin(params) {
    this.props.login({
      user: {
        email: params.username,
        password: params.password,
        remember_me: 1,
      },
    }).then(() => this.props.router.push('/'));
  }

  handleSignup(params) {
    this.props.signup({
      user: {
        email: params.username,
        password: params.password,
        password_confirmation: params.passwordConfirmation,
      },
    }).then(() => this.props.router.push('/'));
  }

  handleRecoverPassword(params) {
    // todo
    return params;
  }

  render() {
    return (
      <Row>
        <Col md={8} mdOffset={3}>
          <Helmet
            title="Clinwiki | Login or Sign Up"
            meta={[
              { name: 'description', content: 'Description of LoginSignup' },
            ]}
          />
          <AlertContainer
            ref={(a) => { this.msg = a; }}
            offset={14}
            position="top right"
            theme="light"
            transition="scale"
          />
          <ReactSignupLoginComponent
            title="Clinwiki"
            handleLogin={this.handleLogin}
            handleSignup={this.handleSignup}
            handleRecoverPassword={this.handleRecoverPassword}
          />
        </Col>
      </Row>
    );
  }
}

LoginSignup.propTypes = {
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  route: PropTypes.object,
  router: PropTypes.object,
  logout: PropTypes.func.isRequired,
  LoginSignup: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  LoginSignup: makeSelectLoginSignup(),
  Auth: makeSelectAuthState(),
});

function mapDispatchToProps(dispatch) {
  return {
    signup: signupAction(dispatch),
    login: loginAction(dispatch),
    logout: logoutAction(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignup);
