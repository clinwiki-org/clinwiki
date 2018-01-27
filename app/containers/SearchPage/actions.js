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
