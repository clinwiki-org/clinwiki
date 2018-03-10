
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import studyPageReducer from '../reducer';
import { wikiAction } from '../WikiSection/actions';
import * as actions from '../actions';

describe('studyPageReducer', () => {
  it('returns the initial state', () => {
    expect(studyPageReducer(undefined, {})).toEqual(fromJS({ wikiOverride: true }));
  });
  describe('handling actions', () => {
    let state;
    const data = { test: 'data' };
    const itSetsTheDataToTheProperNode = (action, node) =>
      it(`sets the data as the ${node}`, () => {
        expect(
          studyPageReducer(state, action(data)).get(node)
        ).toEqual(data);
      });
    beforeEach(() => { state = studyPageReducer(undefined, {}); });
    describe('DEFAULT_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.defaultAction, 'study');
    });
    describe('CROWD_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.crowdAction, 'crowd');
    });
    describe('TRACKING_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.trackingAction, 'tracking');
    });
    describe('SITES_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.sitesAction, 'sites');
    });
    describe('DESCRIPTIVE_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.descriptiveAction, 'descriptive');
    });
    describe('ADMINISTRATIVE_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.adminAction, 'administrative');
    });
    describe('RECRUITMENT_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.recruitmentAction, 'recruitment');
    });
    describe('CLEAR_REVIEW_ACTION', () => {
      beforeEach(() => state.set('review', { foo: 'bar' }));
      it('removes the review from the state', () => {
        expect(
          studyPageReducer(state, actions.clearReviewAction()).get('review')
        ).toEqual({});
      });
    });
    describe('REVIEWS_RECEIVE_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.reviewsAction, 'reviews');
    });
    describe('REVIEW_RECEIVE_ACTION', () => {
      itSetsTheDataToTheProperNode(actions.reviewReceiveAction, 'review');
    });
    describe('LOCATION_CHANGE', () => {
      beforeEach(() => state.set('review', { foo: 'bar' }));
      it('removes the review from the state', () => {
        expect(
          studyPageReducer(state, { type: LOCATION_CHANGE }).get('review')
        ).toEqual({});
      });
    });
    describe('SET_WIKI_OVERRIDE_ACTION', () => {
      it('sets the wiki override', () => {
        expect(
          studyPageReducer(
            state, actions.onWikiOverrideAction('nct1234', false)
          ).get('wikiOverride')
        ).toEqual(false);
      });
    });
    describe('WIKI_ACTION', () => {
      it('sets the wiki', () => {
        expect(studyPageReducer(state, wikiAction(data)).get('wiki')).toEqual(fromJS(data));
      });
    });
  });
});
