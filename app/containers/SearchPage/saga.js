/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeEvery, select } from 'redux-saga/effects';
import client from 'utils/client';
import {
  SEARCH_CHANGED,
  AGG_VIEWED,
  DATA_FETCHED,
} from './constants';
import {
  searchLoaded,
  searchLoadedError,
  clearSearchData,
  aggLoaded,
  aggLoadedError,
  searchLoading,
} from './actions';
import searchSelector from './selectors';

export function* loadAgg(data) {
  const searchPage = yield select(searchSelector());
  try {
    const results = yield call(
      client.post,
      '/studies/agg_buckets',
      Object.assign({}, searchPage.params, { agg: data.agg })
    );
    yield put(aggLoaded(data.agg, results.data));
  } catch (err) {
    yield put(aggLoadedError(data.agg, err));
  }
}

function getParams(searchPage, data) {
  const allParams = Object.assign({}, searchPage.params, data.state);
  return {
    pageSize: allParams.pageSize,
    sorted: allParams.sorted,
    page: allParams.page,
  };
}

export function* doSearch(data) {
  let url = '/studies';
  const { searchQuery } = data;
  const searchPage = yield select(searchSelector());
  if (searchQuery) {
    if (searchPage.query !== searchQuery) {
      yield put(clearSearchData());
    }
    url = `/studies/search/${searchQuery}/json`;
  }
  try {
    const results = yield call(client.post, url, getParams(searchPage, data));
    const resultActionData = Object.assign({ searchQuery }, { state: data.state }, results.data);
    yield put(searchLoaded(resultActionData));
  } catch (err) {
    yield put(searchLoadedError(err));
  }
}

export function* dataFetched(data) {
  const searchPage = yield select(searchSelector());
  if (searchPage.params !== data.state) {
    yield searchLoading();
    yield doSearch(Object.assign({ query: searchPage.query, params: searchPage.state }, data));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* loadSearch() {
  yield takeEvery(SEARCH_CHANGED, doSearch);
  yield takeEvery(AGG_VIEWED, loadAgg);
  yield takeEvery(DATA_FETCHED, dataFetched);
}
