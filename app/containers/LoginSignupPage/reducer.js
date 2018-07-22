/*
 *
 * LoginSignupPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  LOGIN_ERRORS_ACTION,
  SIGNUP_ERRORS_ACTION,
  LOGIN_FINALIZED_ACTION,
  SIGNUP_FINALIZED_ACTION,
  RESET_FINALIZED_ACTION,
  RESET_PASSWORD_ERRORS_ACTION,
  RESET_PASSWORD_FINALIZED_ACTION,
} from './constants';

const initialState = fromJS({
  errors: null,
  resetSent: false,
});

function loginSignupPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case LOGIN_FINALIZED_ACTION:
    case SIGNUP_FINALIZED_ACTION:
    case RESET_PASSWORD_FINALIZED_ACTION:
      return state.set('errors', null).set('resetSent', false);
    case LOGIN_ERRORS_ACTION:
    case SIGNUP_ERRORS_ACTION:
    case RESET_PASSWORD_ERRORS_ACTION:
      if (action.errors.errors) {
        return state.set('errors', action.errors.errors);
      }
      return state.set('errors', action.errors);
    case RESET_FINALIZED_ACTION:
      return state.set('resetSent', true);
    default:
      return state;
  }
}

export default loginSignupPageReducer;
