/*
 *
 * LoginSignup actions
 *
 */

import client from '../../utils/client';
import {
  DEFAULT_ACTION,
  SIGNUP_ACTION,
  SIGNUP_ERRORS_ACTION,
  LOGIN_ACTION,
  LOGIN_ERRORS_ACTION,
  LOGOUT_ACTION,
  LOGOUT_ERRORS_ACTION,
  IS_LOGGED_IN_ACTION,
  CLEAR_MODAL_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const loginAction = (dispatch) =>
  (params) =>
    client.post('/users/sign_in', params)
      .catch((errors) => dispatch({
        type: LOGIN_ERRORS_ACTION,
        data: errors,
      }))
      .then((data) => dispatch({
        type: LOGIN_ACTION,
        data: data.data,
      })).then(sessionExistsAction(dispatch));

export const signupAction = (dispatch) =>
  (params) =>
    client.post('/users', params)
      .catch((error) => {
        dispatch({
          type: SIGNUP_ERRORS_ACTION,
          data: error.response.data,
        });
        throw error;
      }).then((data) => dispatch({
        type: SIGNUP_ACTION,
        data: data.data,
      })).then(sessionExistsAction(dispatch));

export const logoutAction = (dispatch) =>
  () =>
    client.delete('/users/sign_out')
      .catch((error) => {
        dispatch({
          type: LOGOUT_ERRORS_ACTION,
          data: error.response.data,
        });
        throw error;
      }).then((data) => dispatch({
        type: LOGOUT_ACTION,
        data: data.data,
      }));

export const sessionExistsAction = (dispatch) =>
  () =>
    client.get('/user/exists')
      .catch(() => ({ data: { isLoggedIn: false } }))
      .then((data) => dispatch({
        type: IS_LOGGED_IN_ACTION,
        data: data.data,
      }));

export const clearModalAction = (dispatch) =>
  () =>
    dispatch({
      type: CLEAR_MODAL_ACTION,
    });
