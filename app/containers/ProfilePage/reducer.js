/*
 *
 * ProfilePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  POPULATE_COLUMN_PICKER_ACTION,
} from './constants';

export const initialState = fromJS({
  fields: [],
});

function profilePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case POPULATE_COLUMN_PICKER_ACTION:
      return state.set('fields', fromJS(action.fields));
    default:
      return state;
  }
}

export default profilePageReducer;
