/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest, select } from 'redux-saga/effects';
import client from 'utils/client';
import { SEARCH_MOUNTED, SEARCH_CHANGED } from './constants';
import { searchLoaded, searchLoadedError, clearSearchData } from './actions';
import searchSelector from './selectors';


export function* doSearch(data) {
  let url = '/studies';
  if (data.query) {
    const searchPage = yield select(searchSelector());
    if (searchPage.query !== data.query) {
      yield put(clearSearchData());
    }
    url = `/studies/search/${data.query}/json`;
  }
  try {
    const results = yield call(client.post, url, data.params);
    const resultActionData = Object.assign({ query: data.query }, { ...data.params }, results.data);
    yield put(searchLoaded(resultActionData));
  } catch (err) {
    yield put(searchLoadedError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* loadSearch() {
  yield takeLatest(SEARCH_MOUNTED, doSearch);
  yield takeLatest(SEARCH_CHANGED, doSearch);
}
