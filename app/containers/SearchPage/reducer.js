/*
 *
 * SearchPage reducer
 *
 */

import _ from 'lodash';
import { fromJS } from 'immutable';
import {
  SEARCH_LOADED,
  CLEAR_SEARCH_DATA,
  AGG_LOADED,
  AGG_VIEWED,
  AGG_SELECTED,
  AGG_REMOVED,
  SEARCH_LOADING,
} from './constants';

const initialState = fromJS({
  searchQuery: null,
  recordsTotal: 0,
  data: [],
  loading: true,
  aggFilters: {},
  params: {
    page: 0,
    pageSize: 25,
    sorted: [],
  },
  aggs: {},
});

function SearchPageReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_SEARCH_DATA:
      return initialState.set('searchQuery', state.get('searchQuery'))
                         .setIn(['params', 'sorted'], state.getIn(['params', 'sorted']))
                         .set('aggs', state.get('aggs'))
                         .set('aggFilters', state.get('aggFilters'));
    case SEARCH_LOADING:
      return state.set('loading', true).set('data', fromJS([]).set('aggs', fromJS([])));
    case SEARCH_LOADED:
      return state.set('searchQuery', action.data.searchQuery)
                  .set('params', fromJS(action.data.state))
                  .set('recordsTotal', action.data.recordsTotal)
                  .set('pages', Math.ceil(action.data.recordsTotal / (_.get(action, 'data.state.pageSize') || 25)))
                  .set('data', fromJS(action.data.data))
                  .set('aggs', fromJS(action.data.aggs))
                  .set('loading', false);
    case AGG_VIEWED:
      return state.updateIn(['aggs', action.agg],
      (x) => fromJS(Object.assign({}, x.toJS(), { loading: !x.loaded })));
    case AGG_SELECTED:
      return state.updateIn(['aggFilters'],
        (x) => fromJS(Object.assign({}, x.toJS(), { [action.agg]: (x.get(action.agg) || []).concat([action.value]) })));
    case AGG_REMOVED:
      return state.updateIn(['aggFilters', action.agg],
      (x) => fromJS(x.toJS().filter((y) => y !== action.value)));
    case AGG_LOADED:
      return state.setIn(['aggs', action.agg],
        fromJS(Object.assign({}, action.data.aggs[action.agg], { loaded: true })));
    default:
      return state;
  }
}

export default SearchPageReducer;
