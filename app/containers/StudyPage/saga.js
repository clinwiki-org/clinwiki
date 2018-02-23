import { all, put, takeEvery, call, take, cancel, select } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import client from 'utils/client';
import {
  REQUEST_STUDY_ACTION,
  RELOAD_STUDY_ACTION,
  TAG_REMOVE_ACTION,
  TAG_SUBMIT_ACTION,
  SET_WIKI_OVERRIDE_ACTION,
  REVIEW_SUBMIT_ACTION,
  REVIEW_UPDATE_ACTION,
  REVIEW_DELETE_ACTION,
  GET_REVIEW_ACTION,
  WRITE_REVIEW_ACTION,
  STUDY_VIEWED,
} from './constants';
import { WIKI_VIEWED } from './WikiSection/constants';
import { makeSelectWikiOverride } from './selectors';
import {
  clearReviewAction,
  defaultAction,
  trackingAction,
  sitesAction,
  descriptiveAction,
  adminAction,
  recruitmentAction,
  reviewsAction,
  reviewReceiveAction,
  studyLoadErrorAction,
} from './actions';
import { loadWiki } from './WikiSection/saga';


export function* loadDefault(action) {
  if (action.nctId) {
    const override = yield select(makeSelectWikiOverride());
    const data = yield call(client.get, `/studies/${action.nctId}/json?wiki_override=${override}`);
    yield put(defaultAction(data.data));
    yield call(loadWiki, action);
  }
}

export function* loadTracking(action) {
  const data = yield client.get(`/studies/${action.nctId}/tracking`);
  yield put(trackingAction(data.data));
}

export function* loadSites(action) {
  const data = yield client.get(`/studies/${action.nctId}/sites`);
  yield put(sitesAction(data.data));
}
export function* loadDescriptive(action) {
  const data = yield client.get(`/studies/${action.nctId}/descriptive`);
  yield put(descriptiveAction(data.data));
}

export function* loadAdmin(action) {
  const data = yield client.get(`/studies/${action.nctId}/administrative`);
  yield put(adminAction(data.data));
}

export function* loadRecruitment(action) {
  const data = yield client.get(`/studies/${action.nctId}/recruitment`);
  yield put(recruitmentAction(data.data));
}

export function* loadReviews(action) {
  const data = yield client.get(`/reviews/${action.nctId}`);
  yield put(reviewsAction(data.data));
}

export function* loadStudy(action) {
  // could use all here but need the granular error catching
  try {
    yield call(loadDefault, action);
  } catch (e) { studyLoadErrorAction(e); }
  try {
    yield call(loadTracking, action);
  } catch (e) { studyLoadErrorAction(e); }
  try {
    yield call(loadSites, action);
  } catch (e) { studyLoadErrorAction(e); }
  try {
    yield call(loadDescriptive, action);
  } catch (e) { studyLoadErrorAction(e); }
  try {
    yield call(loadAdmin, action);
  } catch (e) { studyLoadErrorAction(e); }
  try {
    yield call(loadRecruitment, action);
  } catch (e) { studyLoadErrorAction(e); }
  try {
    yield call(loadReviews, action);
  } catch (e) { studyLoadErrorAction(e); }
}

export function* reloadStudy(action) {
  try {
    yield call(loadDefault, action);
  } catch (e) { studyLoadErrorAction(e); }
  try {
    yield call(loadReviews, action);
  } catch (e) { studyLoadErrorAction(e); }
}

export const wikiUrl = (action) => `/studies/${action.nctId}/wiki`;

export function* submitTag(action) {
  yield client.post(
    wikiUrl(action),
    { add_tag: action.tag }
  );
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* removeTag(action) {
  yield client.post(
    wikiUrl(action),
    { remove_tag: action.tag }
  );
  yield put({ type: RELOAD_STUDY_ACTION, nctId: action.nctId });
}

export function* reloadStudySaga() {
  const requestWatcher = yield takeEvery(REQUEST_STUDY_ACTION, loadStudy);
  const reloadWatcher = yield takeEvery(RELOAD_STUDY_ACTION, reloadStudy);

  yield take(LOCATION_CHANGE);

  yield cancel(requestWatcher);
  yield cancel(reloadWatcher);
}

export function* tagsSubmitSaga() {
  const watcher = yield takeEvery(TAG_SUBMIT_ACTION, submitTag);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* tagRemoveSaga() {
  const watcher = yield takeEvery(TAG_REMOVE_ACTION, removeTag);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* wikiOverrideSaga() {
  const watcher = yield takeEvery(SET_WIKI_OVERRIDE_ACTION, reloadStudy);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* submitReview(action) {
  yield call(client.post, `/reviews/${action.nctId}`, action);
  yield call(reloadStudy, action);
  yield put(push(`/study/${action.nctId}/reviews`));
}

export function* submitReviewSaga() {
  const watcher = yield takeEvery(REVIEW_SUBMIT_ACTION, submitReview);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* updateReview(action) {
  yield client.patch(`/review/${action.reviewId}`, action);
  yield call(reloadStudy, action);
  yield put(push(`/study/${action.nctId}/reviews`));
}

export function* updateReviewSaga() {
  const watcher = yield takeEvery(REVIEW_UPDATE_ACTION, updateReview);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* deleteReview(action) {
  yield call(client.delete, `/review/${action.reviewId}`);
  yield call(reloadStudy, action);
  yield put(push(`/study/${action.nctId}/reviews`));
}

export function* deleteReviewSaga() {
  const watcher = yield takeEvery(REVIEW_DELETE_ACTION, deleteReview);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* getReview(action) {
  const { data } = yield client.get(`/review/${action.reviewId}`);
  yield put(reviewReceiveAction(data));
}

export function* getReviewSaga() {
  const watcher = yield takeEvery(GET_REVIEW_ACTION, getReview);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* writeReview(action) {
  yield put(push(`/review/${action.nctId}`));
  yield put(clearReviewAction());
}

export function* writeReviewSaga() {
  const watcher = yield takeEvery(WRITE_REVIEW_ACTION, writeReview);
  yield put(clearReviewAction());
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


export default function* doAll() {
  yield takeEvery(WIKI_VIEWED, loadWiki);
  yield takeEvery(STUDY_VIEWED, loadDefault);
  yield takeEvery(STUDY_VIEWED, loadStudy);
  yield takeEvery(RELOAD_STUDY_ACTION, reloadStudy);
  yield takeEvery(SET_WIKI_OVERRIDE_ACTION, reloadStudy);
  yield takeEvery(TAG_SUBMIT_ACTION, submitTag);
  yield takeEvery(TAG_REMOVE_ACTION, removeTag);
  yield takeEvery(WRITE_REVIEW_ACTION, writeReview);
  yield takeEvery(REVIEW_SUBMIT_ACTION, submitReview);
  yield takeEvery(REVIEW_DELETE_ACTION, deleteReview);
  yield takeEvery(GET_REVIEW_ACTION, getReview);
  yield takeEvery(REVIEW_UPDATE_ACTION, updateReview);
  yield all([
    reloadStudySaga,
    tagsSubmitSaga,
    tagRemoveSaga,
    wikiOverrideSaga,
    submitReviewSaga,
    deleteReviewSaga,
    updateReviewSaga,
    getReviewSaga,
    writeReviewSaga,
  ]);
}
