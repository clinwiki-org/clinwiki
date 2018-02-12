import { push } from 'react-router-redux';
import { takeEvery, call, put } from 'redux-saga/effects';
import client from 'utils/client';
import {
  SUBMIT_PROFILE_ACTION,
} from './constants';
import { populateColumnPickerAction, submitProfileErrorsAction } from './actions';

export function* submitProfile(action) {
  try {
    yield call(client.patch, '/users.json', action.data);
    yield put(push('/'));
  } catch (err) {
    yield put(submitProfileErrorsAction(err));
  }
}

export function* populateColumnPicker() {
  const data = yield call(client.get, '/studies/fields');
  yield put(populateColumnPickerAction(data.data));
}

export default function* defaultSaga() {
  yield call(populateColumnPicker);
  yield takeEvery(SUBMIT_PROFILE_ACTION, submitProfile);
}
