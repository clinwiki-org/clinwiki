import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import Helmet from 'react-helmet';
import ReactSignupLoginComponent from 'react-signup-login-component';
import { Row, Col, ListGroup, ListGroupItem, Alert, Form, FormGroup, Button } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import * as qs from 'query-string';
import FieldGroup from 'components/FieldGroup';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLoginSignupPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

export class LoginSignupPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleRecoverPassword = this.handleRecoverPassword.bind(this);
    this.onChangePassword1 = this.onChangePassword1.bind(this);
    this.onChangePassword2 = this.onChangePassword2.bind(this);
    this.onPasswordResetSubmit = this.onPasswordResetSubmit.bind(this);
    if (props.match.path === '/logout') {
      props.actions.logout();
    }
    this.state = {
      password1: null,
      password2: null,
    };
  }

  onChangePassword1(e) {
    this.state.password1 = e.target.value;
  }

  onChangePassword2(e) {
    this.state.password2 = e.target.value;
  }

  onPasswordResetSubmit(e) {
    e.persist();
    e.preventDefault();
    this.props.actions.resetPassword({
      user: {
        reset_password_token: qs.parse(this.props.location.search).reset_password_token,
        password: this.state.password1,
        password_confirmation: this.state.password2,
      },
    });
  }

  handleLogin(params) {
    this.props.actions.login({
      user: {
        email: params.username,
        password: params.password,
        remember_me: 1,
      },
    });
  }

  handleSignup(params) {
    this.props.actions.signup({
      user: {
        email: params.username,
        password: params.password,
        password_confirmation: params.passwordConfirmation,
      },
    });
  }

  handleRecoverPassword(params) {
    this.props.actions.recover({
      email: params.username,
    });
  }

  render() {
    let alert;
    if (this.props.LoginSignupPage.errors) {
      alert = (
        <Alert bsStyle="danger">
          <ListGroup>
            {Object.keys(this.props.LoginSignupPage.errors).map((key) => (
              <ListGroupItem key={key} bsStyle="danger">
                <b>{key}</b> {this.props.LoginSignupPage.errors[key]}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Alert>
      );
    } else if (this.props.LoginSignupPage.resetSent) {
      alert = (
        <Alert bsStyle="success" className="text-center">
          A password reset email has been sent to the email provided.
        </Alert>
      );
    }
    const showLoginSignup = () => (
      <Row>
        <Col md={12}>
          <ReactSignupLoginComponent
            title="Clinwiki"
            handleLogin={this.handleLogin}
            handleSignup={this.handleSignup}
            handleRecoverPassword={this.handleRecoverPassword}
            styles={{
              mainWrapper: { margin: '0 auto' },
            }}
          />
        </Col>
      </Row>
    );
    const showPasswordReset = () => (
      <Row>
        <Col md={5} mdOffset={4}>
          <Form onSubmit={this.onPasswordResetSubmit}>
            <FormGroup>
              <FieldGroup
                id="password-1"
                type="password"
                label="Enter your password"
                onChange={this.onChangePassword1}
              />
              <FieldGroup
                id="password-2"
                type="password"
                label="Confirm your password"
                onChange={this.onChangePassword2}
              />
            </FormGroup>
            <Button type="submit" className="pull-right">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    );
    return (
      <div>
        <Helmet
          title="Clinwiki | Login or Sign Up"
          meta={[
            { name: 'description', content: 'Description of LoginSignup' },
          ]}
        />
        {alert}
        <Switch>
          <Route path="/reset-password" render={showPasswordReset} />
          <Route render={showLoginSignup} />
        </Switch>
      </div>
    );
  }
}

LoginSignupPage.propTypes = {
  actions: PropTypes.object,
  match: ReactRouterPropTypes.match,
  LoginSignupPage: PropTypes.object,
  location: ReactRouterPropTypes.location,
};

const mapStateToProps = createStructuredSelector({
  LoginSignupPage: makeSelectLoginSignupPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'loginSignupPage', reducer });
const withSaga = injectSaga({ key: 'loginSignupPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LoginSignupPage);
