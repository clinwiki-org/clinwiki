import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import Modal from 'react-modal';
import ReactSignupLoginComponent from 'react-signup-login-component';
import FontAwesome from 'react-fontawesome';
import AlertContainer from 'react-alert';
import { makeSelectAuthState } from '../App/selectors';
import makeSelectLoginSignup from './selectors';
import {
  loginAction, signupAction, logoutAction, clearModalAction,
} from './actions';


export class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleRecoverPassword = this.handleRecoverPassword.bind(this);
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
  }

  handleLogin(params) {
    this.props.login({
      user: {
        email: params.username,
        password: params.password,
        remember_me: 1,
      },
    }).then(() => /* TODO: hide modal */ true);
  }

  handleSignup(params) {
    this.props.signup({
      user: {
        email: params.username,
        password: params.password,
        password_confirmation: params.passwordConfirmation,
      },
    }).then(() => /* TODO: hide modal */ true);
  }

  handleRecoverPassword(params) {
    // todo
    return params;
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel={this.props.contentLabel}
        onRequestClose={this.props.clearLoginModal}
        style={{
          overlay: {
            margin: '0 auto',
          },
          content: {
            margin: '0 auto',
          },
        }}
        shouldCloseOnOverlayClick
      >
        <AlertContainer
          ref={(a) => { this.msg = a; }}
          offset={14}
          position="top right"
          theme="light"
          transition="scale"
        />
        <ReactSignupLoginComponent
          title={this.props.title}
          handleLogin={this.handleLogin}
          handleSignup={this.handleSignup}
          handleRecoverPassword={this.handleRecoverPassword}
          styles={{
            mainWrapper: { margin: '0 auto' },
          }}
        />
      </Modal>
    );
  }
}

LoginModal.propTypes = {
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  clearLoginModal: PropTypes.func.isRequired,
  LoginSignup: PropTypes.object,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  contentLabel: PropTypes.string,
};

LoginModal.defaultProps = {
  isOpen: false,
  title: 'Please sign up or log in first',
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
    clearLoginModal: clearModalAction(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
