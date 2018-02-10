/*
 *
 * LoginSignupPage actions
 *
 */

import {
  DEFAULT_ACTION,
  LOGIN_ACTION,
  SIGNUP_ACTION,
  LOGOUT_ACTION,
  RESET_ACTION,
  LOGIN_ERRORS_ACTION,
  LOGIN_FINALIZED_ACTION,
  SIGNUP_ERRORS_ACTION,
  SIGNUP_FINALIZED_ACTION,
  LOGOUT_ERRORS_ACTION,
  LOGOUT_FINALIZED_ACTION,
  RESET_ERRORS_ACTION,
  RESET_FINALIZED_ACTION,
  RESET_PASSWORD_SUBMIT_ACTION,
  RESET_PASSWORD_FINALIZED_ACTION,
  RESET_PASSWORD_ERRORS_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function login(params) {
  return {
    type: LOGIN_ACTION,
    params,
  };
}

export function logout(params) {
  return {
    type: LOGOUT_ACTION,
    params,
  };
}

export function signup(params) {
  return {
    type: SIGNUP_ACTION,
    params,
  };
}

export function recover(params) {
  return {
    type: RESET_ACTION,
    params,
  };
}

export function resetErrors(errors) {
  return {
    type: RESET_ERRORS_ACTION,
    errors,
  };
}

export function resetFinalized(params) {
  return {
    type: RESET_FINALIZED_ACTION,
    params,
  };
}

export function resetPassword(params) {
  return {
    type: RESET_PASSWORD_SUBMIT_ACTION,
    params,
  };
}

export function resetPasswordFinalized(params) {
  return {
    type: RESET_PASSWORD_FINALIZED_ACTION,
    params,
  };
}

export function resetPasswordErrors(errors) {
  return {
    type: RESET_PASSWORD_ERRORS_ACTION,
    errors,
  };
}

export function loginErrors(errors) {
  return {
    type: LOGIN_ERRORS_ACTION,
    errors,
  };
}

export function signupErrors(errors) {
  return {
    type: SIGNUP_ERRORS_ACTION,
    errors,
  };
}

export function signupFinalized(params) {
  return {
    type: SIGNUP_FINALIZED_ACTION,
    params,
  };
}

export function loginFinalized() {
  return { type: LOGIN_FINALIZED_ACTION };
}

export function logoutFinalized() {
  return { type: LOGOUT_FINALIZED_ACTION };
}

export function logoutErrorsAction(errors) {
  return {
    type: LOGOUT_ERRORS_ACTION,
    errors,
  };
}
