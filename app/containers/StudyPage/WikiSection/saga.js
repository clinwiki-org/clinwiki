import { take, call, put, cancel, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import client from 'utils/client';
import {
  WIKI_SUBMIT_ACTION,
} from './constants';
import {
  wikiAction,
} from './actions';

export function* loadWiki(action) {
  const data = yield client.get(`/studies/${action.nctId}/wiki`);
  yield put(wikiAction(data.data));
}

export const wikiUrl = (action) => `/studies/${action.nctId}/wiki`;

export function* submitWiki(action) {
  yield call(client.post, wikiUrl(action), { wiki_text: action.wikiText });
  yield call(loadWiki, action);
}

export default function* wikiSaga() {
  const submitWatcher = yield takeEvery(WIKI_SUBMIT_ACTION, submitWiki);
  yield take(LOCATION_CHANGE);
  yield cancel(submitWatcher);
}
