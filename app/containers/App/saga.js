// auth sagas live here
import { put, call, takeEvery } from 'redux-saga/effects';
import client from 'utils/client';
import {
  SESSION_CHECKED,
  RELOAD_SESSION,
} from './constants';

export function* checkSession() {
  const { data } = yield call(client.get, '/user/exists');
  yield put({ type: SESSION_CHECKED, data });
}

export default function* defaultSaga() {
  yield call(checkSession);
  yield takeEvery(RELOAD_SESSION, checkSession);
}
