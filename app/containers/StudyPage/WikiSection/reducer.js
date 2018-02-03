/*
 *
 * WikiSection reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  WIKI_ACTION,
} from './constants';

const initialState = fromJS({});

function wikiSectionReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case WIKI_ACTION:
      return state.set('wiki', fromJS(action.data));
    default:
      return state;
  }
}

export default wikiSectionReducer;
