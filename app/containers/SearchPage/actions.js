/*
 *
 * SearchPage actions
 *
 */
import {
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
  CROWD_AGG_VIEWED,
} from './constants';

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

export function searchLoadedError(errors) {
  return {
    type: SEARCH_LOADED_ERROR,
    errors,
  };
}

export function clearSearchData() {
  return { type: CLEAR_SEARCH_DATA };
}

export function aggViewed(agg) {
  return { type: AGG_VIEWED, agg };
}

export function crowdAggViewed(agg) {
  return { type: CROWD_AGG_VIEWED, agg };
}

export function aggLoaded(agg, data) {
  return { type: AGG_LOADED, agg, data };
}

export function aggLoadedError(agg, error) {
  return { type: AGG_LOADED_ERROR, agg, error };
}

export function dataFetched(state, match = { params: { searchQuery: null } }) {
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
