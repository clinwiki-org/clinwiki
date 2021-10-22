import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';
import history from 'createHistory';
import { setLocalJwt } from 'utils/localStorage';

function* getUser(action) {
  try {
    let response = yield call(() => api.fetchUser(action.userId));
    if (response) {
      response.data.user.userId = action.userId;
      yield put(actions.fetchUserSuccess(response.data));
    } else {
      yield put(actions.fetchUserError([response.message]));
    }
  } catch (err) {
    console.log(err);
    yield put(actions.fetchUserError([err.message]));
  }
}

function* getCurrentUser(action) {
  try {
    let response = yield call(() => api.fetchCurrentUser());
    if (response) {
      yield put(actions.fetchCurrentUserSuccess(response.data.me));
    } else {
      yield put(actions.fetchCurrentUserError([response.message]));
    }
  } catch (err) {
    console.log(err);
    yield put(actions.fetchCurrentUserError([err.message]));
  }
}

function* signIn(action) {
  //console.log("signIn in saga called");
  try {
    let response = yield call(() =>
      api.signIn(action.email, action.password, action.oAuthToken)
    );
    console.log('🚀 ~ function*signIn ~ response', response);

    if (response?.data?.signIn?.jwt) {
      yield call(() => setLocalJwt(response.data.signIn.jwt));
      yield put(actions.signInSuccess(response.data.signIn.user));
      yield call(() => history.goBack());
    } else {
      yield put(actions.signInError(['Invalid email or password']));
    }
  } catch (err) {
    console.log(err);
    yield put(actions.signInError([err.message]));
  }
}

function* logout(action) {
  try {
    yield call(() => setLocalJwt(null));
    yield call(() => history.push('/'));
  } catch (err) {
    console.log(err);
    yield put(actions.logoutError([err.message]));
  }
}

function* signUp(action) {
  //console.log("signup in saga called");
  try {
    let response = yield call(() =>
      api.signUp(action.email, action.password, action.oAuthToken)
    );
    /*        console.log(response);
        console.log(response.data);
        console.log(response.data.signUp);*/
    if (
      response.data &&
      response.data.signUp &&
      response.data.signUp.errors == null
    ) {
      yield put(actions.signUpSuccess(response));
      yield signIn(action);
    } else {
      yield put(actions.signUpError([response.data.signUp.errors]));
    }
  } catch (err) {
    console.log(err);
    yield put(actions.signUpError([err.message]));
  }
}

function* updatePassword(action) {
  try {
    let response = yield call(() =>
      api.updatePassword(
        action.resetPasswordToken,
        action.password,
        action.passwordConfirmation
      )
    );
    if (response.data.updatePassword.success) {
      yield put(actions.updatePasswordSuccess(response));
      yield signIn({ email: response.data.updatePassword.user.email, password: action.password });
      yield call(() => history.push('/'));
    } else {
      yield put(actions.updatePasswordError([response.data.updatePassword.message]));
    }
  } catch (err) {
    console.log(err);
    yield put(actions.updatePasswordError([`${err}`]));
  }
}

function* resetPassword(action) {
  //console.log("SAGA reset pass", action)
  try {
    let response = yield call(() => api.resetPassword(action.email));
    if (response) {
      yield put(actions.resetPasswordSuccess(response));
    } else {
      yield put(actions.resetPasswordError(response.message));
    }
  } catch (err) {
    console.log(err);
    yield put(actions.resetPasswordError([err.message]));
  }
}

function* editProfile(action) {
  try {
    let response = yield call(() =>
      api.editProfile(
        action.firstName,
        action.lastName,
        action.defaultQueryString
      )
    );
    if (response) {
      yield put(actions.editProfileSuccess(response));
    } else {
      yield put(actions.editProfileError([response.message]));
    }
  } catch (err) {
    console.log(err);
    yield put(actions.editProfileError([err.message]));
  }
}

export default function* userSagas() {
  yield takeLatest(types.FETCH_USER_SEND, getUser);
  yield takeLatest(types.FETCH_CURRENT_USER_SEND, getCurrentUser);
  yield takeLatest(types.SIGN_IN_SEND, signIn);
  yield takeLatest(types.LOGOUT_SEND, logout);
  yield takeLatest(types.SIGN_UP_SEND, signUp);
  yield takeLatest(types.UPDATE_PASSWORD_SEND, updatePassword);
  yield takeLatest(types.RESET_PASSWORD_SEND, resetPassword);
  yield takeLatest(types.EDIT_PROFILE_SEND, editProfile);
}
