import { push } from 'react-router-redux';
import { takeEvery, call, put } from 'redux-saga/effects';
import client from 'utils/client';
import {
  SUBMIT_PROFILE_ACTION,
} from './constants';

export function* submitProfile(action) {
  yield call(client.patch, '/users.json', action.data);
  yield put(push('/'));
}

export default function* defaultSaga() {
  yield takeEvery(SUBMIT_PROFILE_ACTION, submitProfile);
}
