/*
 *
 * Study reducer
 *
 */

import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  DEFAULT_ACTION,
  CROWD_ACTION,
  TRACKING_ACTION,
  SITES_ACTION,
  DESCRIPTIVE_ACTION,
  ADMINISTRATIVE_ACTION,
  RECRUITMENT_ACTION,
  REVIEWS_RECEIVE_ACTION,
  REVIEW_RECEIVE_ACTION,
  SET_WIKI_OVERRIDE_ACTION,
  CLEAR_REVIEW_ACTION,
} from './constants';

const initialState = fromJS({
  wikiOverride: true,
});

function studyPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('study', action.data);
    case CROWD_ACTION:
      return state.set('crowd', action.data);
    case TRACKING_ACTION:
      return state.set('tracking', action.data);
    case SITES_ACTION:
      return state.set('sites', action.data);
    case DESCRIPTIVE_ACTION:
      return state.set('descriptive', action.data);
    case ADMINISTRATIVE_ACTION:
      return state.set('administrative', action.data);
    case RECRUITMENT_ACTION:
      return state.set('recruitment', action.data);
    case CLEAR_REVIEW_ACTION:
      return state.set('review', {});
    case REVIEWS_RECEIVE_ACTION:
      return state.set('reviews', action.data);
    case REVIEW_RECEIVE_ACTION:
      return state.set('review', action.data);
    case LOCATION_CHANGE:
      return state.set('review', {});
    case SET_WIKI_OVERRIDE_ACTION:
      return state.set('wikiOverride', action.shouldOverride);
    default:
      return state;
  }
}

export default studyPageReducer;
