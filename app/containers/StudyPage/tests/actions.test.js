
import * as actions from '../actions';
import * as constants from '../constants';

describe('StudyPage actions', () => {
  describe('Default Action', () => {
    it('has a type of DEFAULT_ACTION', () => {
      const expected = {
        type: constants.DEFAULT_ACTION,
      };
      expect(actions.defaultAction()).toEqual(expected);
    });
  });
  describe('onWikiOverrideAction', () => {
    it('should pass the override on for the nctId provided', () => {
      expect(actions.onWikiOverrideAction('nct1234', false)).toEqual({
        type: constants.SET_WIKI_OVERRIDE_ACTION,
        nctId: 'nct1234',
        shouldOverride: false,
      });
    });
  });
  const itPassesNctIdWithType = (action, type) => {
    it('should publish an nct id with the correct type', () => {
      const nctId = 'nct12345';
      expect(action(nctId)).toEqual({
        type,
        nctId,
      });
    });
  };
  const itPassesDataWithType = (action, type) => {
    it('should publish data with the correct type', () => {
      const data = { foo: 'bar' };
      expect(action(data)).toEqual({
        type,
        data,
      });
    });
  };
  describe('getStudyAction', () => {
    itPassesNctIdWithType(actions.getStudyAction, constants.REQUEST_STUDY_ACTION);
  });
  describe('reloadStudyAction', () => {
    itPassesNctIdWithType(actions.reloadStudyAction, constants.RELOAD_STUDY_ACTION);
  });
  describe('crowdAction', () => {
    itPassesDataWithType(actions.crowdAction, constants.CROWD_ACTION);
  });
  describe('trackingAction', () => {
    itPassesDataWithType(actions.trackingAction, constants.TRACKING_ACTION);
  });
  describe('sitesAction', () => {
    itPassesDataWithType(actions.sitesAction, constants.SITES_ACTION);
  });
  describe('descriptiveAction', () => {
    itPassesDataWithType(actions.descriptiveAction, constants.DESCRIPTIVE_ACTION);
  });
  describe('adminAction', () => {
    itPassesDataWithType(actions.adminAction, constants.ADMINISTRATIVE_ACTION);
  });
  describe('recruitmentAction', () => {
    itPassesDataWithType(actions.recruitmentAction, constants.RECRUITMENT_ACTION);
  });
  describe('submitTag', () => {
    it('passes the nct id and tag with the correct type', () => {
      expect(actions.submitTag('nct12345', 'foo')).toEqual({
        type: constants.TAG_SUBMIT_ACTION,
        nctId: 'nct12345',
        tag: 'foo',
      });
    });
  });
  describe('removeTag', () => {
    it('passes the nct id and tag with the correct type', () => {
      expect(actions.removeTag('nct12345', 'foo')).toEqual({
        type: constants.TAG_REMOVE_ACTION,
        nctId: 'nct12345',
        tag: 'foo',
      });
    });
  });
  describe('submitReview', () => {
    it('passes the nctId, review, and stars', () => {
      const nctId = 'nct12345';
      const review = 'okay i guess';
      const stars = { 'Overall Rating': 5 };
      expect(actions.submitReview(nctId, review, stars)).toEqual({
        type: constants.REVIEW_SUBMIT_ACTION,
        nctId,
        review,
        stars,
      });
    });
  });
  describe('updateReview', () => {
    it('passes the nctId, review id, review, and stars', () => {
      const nctId = 'nct12345';
      const review = 'okay i guess';
      const stars = { 'Overall Rating': 5 };
      const reviewId = 5;
      expect(actions.updateReview(nctId, review, stars, reviewId)).toEqual({
        type: constants.REVIEW_UPDATE_ACTION,
        nctId,
        review,
        stars,
        reviewId,
      });
    });
  });
  describe('reviewReceiveAction', () => {
    itPassesDataWithType(actions.reviewReceiveAction, constants.REVIEW_RECEIVE_ACTION);
  });
  describe('reviewsAction', () => {
    itPassesDataWithType(actions.reviewsAction, constants.REVIEWS_RECEIVE_ACTION);
  });
  describe('getReviewAction', () => {
    it('passes the review id and correct type', () => {
      expect(actions.getReviewAction(1234)).toEqual({
        type: constants.GET_REVIEW_ACTION,
        reviewId: 1234,
      });
    });
  });
  describe('deleteReview', () => {
    it('passes the review id, nct id, and correct type', () => {
      expect(actions.deleteReview('nct1234', 1234)).toEqual({
        type: constants.REVIEW_DELETE_ACTION,
        reviewId: 1234,
        nctId: 'nct1234',
      });
    });
  });
  describe('clearReviewAction', () => {
    it('passes the correct type', () => {
      expect(actions.clearReviewAction()).toEqual({
        type: constants.CLEAR_REVIEW_ACTION,
      });
    });
  });
  describe('studyLoadErrorAction', () => {
    it('passes the error on', () => {
      expect(actions.studyLoadErrorAction(new Error('foo'))).toEqual({
        type: constants.STUDY_LOAD_ERROR_ACTION,
        error: new Error('foo'),
      });
    });
  });
  describe('studyViewed', () => {
    itPassesNctIdWithType(actions.studyViewed, constants.STUDY_VIEWED);
  });
});
