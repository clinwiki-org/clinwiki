/*
 *
 * SearchPage actions
 *
 */
import {
  DEFAULT_ACTION,
  SEARCH_MOUNTED,
  SEARCH_LOADED,
  SEARCH_LOADED_ERROR,
  CLEAR_SEARCH_DATA,
  SEARCH_CHANGED,
  AGG_VIEWED,
  AGG_LOADED,
  AGG_LOADED_ERROR,
  DATA_FETCHED,
  SEARCH_LOADING,
  AGG_SELECTED,
  AGG_REMOVED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function searchMounted(query = null, params = {}) {
  return {
    type: SEARCH_MOUNTED,
    query,
    params,
  };
}

export function searchChanged(searchQuery) {
  return {
    type: SEARCH_CHANGED,
    searchQuery,
  };
}

export function searchLoaded(data) {
  return {
    type: SEARCH_LOADED,
    data,
  };
}

export function searchLoadedError(err) {
  return {
    type: SEARCH_LOADED_ERROR,
    err,
  };
}

export function clearSearchData() {
  return { type: CLEAR_SEARCH_DATA };
}

export function aggViewed(agg) {
  return { type: AGG_VIEWED, agg };
}

export function aggLoaded(agg, data) {
  return { type: AGG_LOADED, agg, data };
}

export function aggLoadedError(agg, err) {
  return { type: AGG_LOADED_ERROR, agg, err };
}

export function dataFetched(state, match = { params: null }) {
  const { searchQuery } = match.params;
  return { type: DATA_FETCHED, state, searchQuery };
}

export function searchLoading() {
  return { type: SEARCH_LOADING };
}

export function aggSelected(agg, value) {
  return { type: AGG_SELECTED, agg, value };
}

export function aggRemoved(agg, value) {
  return { type: AGG_REMOVED, agg, value };
}
