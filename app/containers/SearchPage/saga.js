/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeEvery, select } from 'redux-saga/effects';
import client from 'utils/client';
import {
  SEARCH_CHANGED,
  AGG_VIEWED,
  DATA_FETCHED,
  AGG_SELECTED,
  AGG_REMOVED,
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
  if (searchPage.aggs[data.agg].loaded) {
    return;
  }
  try {
    const results = yield call(
      client.post,
      '/studies/agg_buckets',
      Object.assign({}, getParams(searchPage, data), { agg: data.agg })
    );
    yield put(aggLoaded(data.agg, results.data));
  } catch (err) {
    yield put(aggLoadedError(data.agg, err));
  }
}

function getParams(searchPage, data) {
  const allParams = Object.assign({}, searchPage.params, data.state);
  return {
    q: searchPage.searchQuery,
    pageSize: allParams.pageSize,
    sorted: allParams.sorted,
    page: allParams.page,
    aggFilters: searchPage.aggFilters,
  };
}

export function* doSearch(data) {
  let url = '/studies';
  const { type } = data;
  let { searchQuery } = data;
  const searchPage = yield select(searchSelector());
  if (searchQuery) {
    if (searchPage.searchQuery !== searchQuery && type === SEARCH_CHANGED) {
      yield put(clearSearchData());
    }
  } else if (searchPage.searchQuery && type !== SEARCH_CHANGED) {
    searchQuery = searchPage.searchQuery;
  }
  url = `/studies/search/${searchQuery}`;
  try {
    const results = yield call(client.post, `${url}/json`, getParams(searchPage, data));
    const resultActionData = Object.assign({}, { searchQuery }, { state: data.state || searchPage.params }, results.data);
    yield put(searchLoaded(resultActionData));
  } catch (err) {
    yield put(searchLoadedError(err));
  }
}

export function* dataFetched(data) {
  const searchPage = yield select(searchSelector());
  if (searchPage.params !== data.state) {
    yield put(searchLoading());
    yield doSearch(Object.assign({}, { searchQuery: searchPage.searchQuery, params: searchPage.state }, data));
  }
}

export function* handleAgg(action) {
  yield put(searchLoading());
  yield doSearch(action);
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* loadSearch() {
  yield takeEvery(SEARCH_CHANGED, doSearch);
  yield takeEvery(AGG_VIEWED, loadAgg);
  yield takeEvery(DATA_FETCHED, dataFetched);
  yield takeEvery(AGG_SELECTED, handleAgg);
  yield takeEvery(AGG_REMOVED, handleAgg);
}
