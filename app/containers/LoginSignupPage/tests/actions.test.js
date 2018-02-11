import {
  itReturnsActionWithParams,
  itReturnsActionWithErrors,
  itReturnsAction,
} from 'utils/testHelpers/sharedBehaviors';
import * as actions from '../actions';
import * as constants from '../constants';

const params = { foo: 'bar' };

describe('LoginSignupPage actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: constants.DEFAULT_ACTION,
      };
      expect(actions.defaultAction()).toEqual(expected);
    });
  });
  describe('login', () => {
    itReturnsActionWithParams(actions.login, constants.LOGIN_ACTION, params);
  });
  describe('logout', () => {
    itReturnsActionWithParams(actions.logout, constants.LOGOUT_ACTION, params);
  });
  describe('signup', () => {
    itReturnsActionWithParams(actions.signup, constants.SIGNUP_ACTION, params);
  });
  describe('recover', () => {
    itReturnsActionWithParams(actions.recover, constants.RESET_ACTION, params);
  });
  describe('resetErrors', () => {
    itReturnsActionWithErrors(actions.resetErrors, constants.RESET_ERRORS_ACTION, params);
  });
  describe('resetFinalized', () => {
    itReturnsActionWithParams(actions.resetFinalized, constants.RESET_FINALIZED_ACTION, params);
  });
  describe('resetPassword', () => {
    itReturnsActionWithParams(actions.resetPassword, constants.RESET_PASSWORD_SUBMIT_ACTION, params);
  });
  describe('resetPasswordFinalized', () => {
    itReturnsActionWithParams(actions.resetPasswordFinalized, constants.RESET_PASSWORD_FINALIZED_ACTION, params);
  });
  describe('resetPasswordErrors', () => {
    itReturnsActionWithErrors(actions.resetPasswordErrors, constants.RESET_PASSWORD_ERRORS_ACTION, params);
  });
  describe('loginErrors', () => {
    itReturnsActionWithErrors(actions.loginErrors, constants.LOGIN_ERRORS_ACTION, params);
  });
  describe('signupErrors', () => {
    itReturnsActionWithErrors(actions.signupErrors, constants.SIGNUP_ERRORS_ACTION, params);
  });
  describe('signupFinalized', () => {
    itReturnsActionWithParams(actions.signupFinalized, constants.SIGNUP_FINALIZED_ACTION, params);
  });
  describe('logoutErrorsAction', () => {
    itReturnsActionWithErrors(actions.logoutErrorsAction, constants.LOGOUT_ERRORS_ACTION, params);
  });
  describe('loginFinalized', () => {
    itReturnsAction(actions.loginFinalized, constants.LOGIN_FINALIZED_ACTION);
  });
  describe('logoutFinalized', () => {
    itReturnsAction(actions.logoutFinalized, constants.LOGOUT_FINALIZED_ACTION);
  });
});
