/**
 * Gets the repositories of the user from Github
 */
import _ from 'lodash';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import client from 'utils/client';
import makeSelectAuthHeader from '../AuthHeader/selectors';
import {
  SEARCH_CHANGED,
  AGG_VIEWED,
  DATA_FETCHED,
  AGG_SELECTED,
  AGG_REMOVED,
  CROWD_AGG_VIEWED,
  CROWD_AGG_SELECTED,
  CROWD_AGG_REMOVED,
} from './constants';
import {
  searchLoaded,
  searchLoadedError,
  clearSearchData,
  aggLoaded,
  aggLoadedError,
  searchLoading,
  crowdAggLoaded,
  crowdAggLoadedError,
} from './actions';
import searchSelector from './selectors';


export function* loadAgg(data) {
  const searchPage = yield select(searchSelector());
  if (searchPage.aggs[data.agg].loaded) {
    return;
  }
  try {
    const params = yield call(getParams, searchPage, data);
    const results = yield call(
      client.post,
      '/studies/agg_buckets',
      Object.assign({}, params, { agg: data.agg })
    );
    yield put(aggLoaded(data.agg, results.data));
  } catch (err) {
    yield put(aggLoadedError(data.agg, err));
  }
}

export function* loadCrowdAgg(data) {
  const searchPage = yield select(searchSelector());
  if (searchPage.crowdAggs[data.agg].loaded) {
    return;
  }
  try {
    const params = yield call(getParams, searchPage, data);
    const results = yield call(
      client.post,
      '/studies/crowd_agg_buckets',
      Object.assign({}, params, { agg: data.agg })
    );
    yield put(crowdAggLoaded(data.agg, results.data));
  } catch (err) {
    yield put(crowdAggLoadedError(data.agg, err));
  }
}

export function* getParams(searchPage, data) {
  const authHeader = yield select(makeSelectAuthHeader());
  const allParams = Object.assign({}, searchPage.params, data.state);
  return {
    q: data.searchQuery || searchPage.searchQuery,
    pageSize: allParams.pageSize,
    sorted: allParams.sorted,
    page: allParams.page,
    aggFilters: searchPage.aggFilters,
    selectedColumns: Object.keys(_.get(authHeader, 'user.search_result_columns') || {}),
  };
}

export function* doSearch(data) {
  let url = '/studies';
  const { type } = data;
  let { searchQuery } = data;
  const searchPage = yield select(searchSelector());
  if (searchQuery !== undefined) {
    if (searchPage.searchQuery !== searchQuery && type === SEARCH_CHANGED) {
      yield put(clearSearchData());
    }
  } else if (searchPage.searchQuery && type !== SEARCH_CHANGED) {
    searchQuery = searchPage.searchQuery;
  }
  if (searchQuery !== undefined) {
    url = '/studies/search';
  } else {
    url = '/studies';
  }

  try {
    const params = yield call(getParams, searchPage, data);
    const results = yield call(client.post, `${url}/json`, params);
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
    yield call(doSearch, Object.assign({}, { searchQuery: searchPage.searchQuery, params: searchPage.state }, data));
  }
}

export function* handleAgg(action) {
  yield put(searchLoading());
  yield call(doSearch, action);
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* loadSearch() {
  yield takeEvery(AGG_VIEWED, loadAgg);
  yield takeEvery(CROWD_AGG_VIEWED, loadCrowdAgg);
  yield takeEvery(DATA_FETCHED, dataFetched);
  yield takeEvery(AGG_SELECTED, handleAgg);
  yield takeEvery(AGG_REMOVED, handleAgg);
  yield takeEvery(CROWD_AGG_SELECTED, handleAgg);
  yield takeEvery(CROWD_AGG_REMOVED, handleAgg);
  yield takeEvery(SEARCH_CHANGED, doSearch);
}
