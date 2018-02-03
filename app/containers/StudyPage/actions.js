/*
 *
 * StudyPage actions
 *
 */
import {
  DEFAULT_ACTION,
  CROWD_ACTION,
  TRACKING_ACTION,
  SITES_ACTION,
  DESCRIPTIVE_ACTION,
  ADMINISTRATIVE_ACTION,
  RECRUITMENT_ACTION,
  TAG_REMOVE_ACTION,
  TAG_SUBMIT_ACTION,
  REVIEW_SUBMIT_ACTION,
  REVIEW_UPDATE_ACTION,
  REVIEW_RECEIVE_ACTION,
  REVIEWS_RECEIVE_ACTION,
  GET_REVIEW_ACTION,
  REVIEW_DELETE_ACTION,
  REQUEST_STUDY_ACTION,
  RELOAD_STUDY_ACTION,
  SET_WIKI_OVERRIDE_ACTION,
  WRITE_REVIEW_ACTION,
  CLEAR_REVIEW_ACTION,
  STUDY_LOAD_ERROR_ACTION,
  STUDY_VIEWED,
} from './constants';

export const onWikiOverrideAction = (nctId, shouldOverride) => ({
  type: SET_WIKI_OVERRIDE_ACTION,
  nctId,
  shouldOverride,
});

export const getStudyAction = (nctId) => ({
  type: REQUEST_STUDY_ACTION,
  nctId,
});

export const reloadStudyAction = (nctId) => ({
  type: RELOAD_STUDY_ACTION,
  nctId,
});

export const defaultAction = (data) => ({
  type: DEFAULT_ACTION,
  data,
});

export const crowdAction = (data) => ({
  type: CROWD_ACTION,
  data,
});

export const trackingAction = (data) => ({
  type: TRACKING_ACTION,
  data,
});

export const sitesAction = (data) => ({
  type: SITES_ACTION,
  data,
});

export const descriptiveAction = (data) => ({
  type: DESCRIPTIVE_ACTION,
  data,
});

export const adminAction = (data) => ({
  type: ADMINISTRATIVE_ACTION,
  data,
});

export const recruitmentAction = (data) => ({
  type: RECRUITMENT_ACTION,
  data,
});

export const removeTagAction = (nctId, tag) => ({
  type: TAG_REMOVE_ACTION,
  nctId,
  tag,
});

export const submitTagAction = (nctId, tag) => ({
  type: TAG_SUBMIT_ACTION,
  nctId,
  tag,
});

export const submitReviewAction = (nctId, review, stars) => ({
  type: REVIEW_SUBMIT_ACTION,
  nctId,
  review,
  stars,
});

export const updateReviewAction = (nctId, reviewId, review, stars) => ({
  type: REVIEW_UPDATE_ACTION,
  nctId,
  reviewId,
  review,
  stars,
});

export const reviewsAction = (data) => ({
  type: REVIEWS_RECEIVE_ACTION,
  data,
});

export const reviewReceiveAction = (data) => ({
  type: REVIEW_RECEIVE_ACTION,
  data,
});

export const getReviewAction = (reviewId) => ({
  type: GET_REVIEW_ACTION,
  reviewId,
});

export const deleteReviewAction = (nctId, reviewId) => ({
  type: REVIEW_DELETE_ACTION,
  nctId,
  reviewId,
});

export const writeReviewAction = (nctId) => ({
  type: WRITE_REVIEW_ACTION,
  nctId,
});

export const clearReviewAction = () => ({
  type: CLEAR_REVIEW_ACTION,
});

export const studyLoadErrorAction = (error) => ({
  type: STUDY_LOAD_ERROR_ACTION,
  error,
});

export const studyViewed = (nctId) => ({
  type: STUDY_VIEWED,
  nctId,
});
