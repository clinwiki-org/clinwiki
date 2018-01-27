/*
 *
 * SearchPage reducer
 *
 */

import { fromJS, List } from 'immutable';
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
});

function SearchPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CLEAR_SEARCH_DATA:
      return initialState;
    case SEARCH_LOADED:
      return state.set('query', action.data.query)
                  .set('recordsTotal', action.data.recordsTotal)
                  .set('data', state.get('data').concat(List(action.data.data)))
                  .set('params', action.data.params);
    default:
      return state;
  }
}

export default SearchPageReducer;
