/*
 *
 * LoginSignup reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SIGNUP_ERRORS_ACTION,
  LOGIN_ERRORS_ACTION,
  LOGIN_ACTION,
  SIGNUP_ACTION,
  LOGOUT_ACTION,
  IS_LOGGED_IN_ACTION,
} from './constants';

const initialState = fromJS({});

function loginSignupReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SIGNUP_ERRORS_ACTION:
    case LOGIN_ERRORS_ACTION:
      return state
        .set('errors', action.data.errors);
    case LOGIN_ACTION:
    case SIGNUP_ACTION:
      return state
        .set('isLoggedIn', true);
    case IS_LOGGED_IN_ACTION:
      return state
        .set('isLoggedIn', action.data.isLoggedIn);
    case LOGOUT_ACTION:
      return state
        .set('isLoggedIn', false);
    default:
      return state;
  }
}

export default loginSignupReducer;
