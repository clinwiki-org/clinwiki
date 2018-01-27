/*
 *
 * SearchPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SEARCH_LOADED,
  CLEAR_SEARCH_DATA,
} from './constants';

const initialState = fromJS({
  query: null,
  recordsTotal: 0,
  data: [],
  params: {},
  aggs: {},
});

function SearchPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CLEAR_SEARCH_DATA:
      return initialState;
    case SEARCH_LOADED:
      return state.set('query', action.data.query)
                  .set('params', fromJS(action.data.params))
                  .set('recordsTotal', action.data.recordsTotal)
                  .set('data', fromJS(action.data.data))
                  .set('aggs', fromJS(action.data.aggs));
    default:
      return state;
  }
}

export default SearchPageReducer;
