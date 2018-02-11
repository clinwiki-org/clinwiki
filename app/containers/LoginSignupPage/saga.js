import { takeEvery, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import client from 'utils/client';
import { checkSession } from '../App/saga';
import {
  LOGIN_ACTION,
  LOGOUT_ACTION,
  RESET_ACTION,
  SIGNUP_ACTION,
  RESET_PASSWORD_SUBMIT_ACTION,
} from './constants';
import {
  loginFinalized,
  loginErrors,
  signupFinalized,
  signupErrors,
  logoutErrorsAction,
  logoutFinalized,
  resetErrors,
  resetFinalized,
  resetPasswordErrors,
  resetPasswordFinalized,
} from './actions';


export function* login(action) {
  try {
    const data = yield call(client.post, '/users/sign_in', action.params);
    yield put(loginFinalized(data.data));
    yield call(checkSession);
    yield put(push('/profile'));
  } catch (err) {
    yield put(loginErrors(err.response.data));
  }
}

export function* signup(action) {
  try {
    const data = yield call(client.post, '/users', action.params);
    yield put(signupFinalized(data.data));
    yield call(checkSession);
    yield put(push('/profile'));
  } catch (err) {
    yield put(signupErrors(err.response.data));
  }
}

export function* logout() {
  try {
    const data = yield call(client.delete, '/users/sign_out');
    yield put(logoutFinalized(data));
    yield call(checkSession);
  } catch (errs) {
    yield put(logoutErrorsAction(errs.response.data));
  }
}

export function* requestReset(action) {
  try {
    const data = yield call(client.put, '/users/password.json', { email: action.params.email, reset: true });
    yield put(resetFinalized(data));
  } catch (errs) {
    yield put(resetErrors(errs.response.data.errors));
  }
}

export function* doReset(action) {
  try {
    yield call(client.put, '/users/password.json', action.params);
    yield put(resetPasswordFinalized());
    yield call(checkSession);
    yield put(push('/profile'));
  } catch (errs) {
    yield put(resetPasswordErrors(errs.response.data.errors));
  }
}


// Individual exports for testing
export default function* defaultSaga() {
  yield takeEvery(SIGNUP_ACTION, signup);
  yield takeEvery(LOGIN_ACTION, login);
  yield takeEvery(LOGOUT_ACTION, logout);
  yield takeEvery(RESET_ACTION, requestReset);
  yield takeEvery(RESET_PASSWORD_SUBMIT_ACTION, doReset);
}
