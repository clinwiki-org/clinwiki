import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';

function* actionQuery(action) {
  try {
    let response = yield call(() => api.actionQuery(action.query, action.label));
    if (response) {
      yield put(actions.actionQuerySuccess(response.data,action.label));
    } 
    else {
      yield put(actions.actionQueryError(response.message));
    }
  } 
  catch (err) {
    console.log(err);
    yield put(actions.actionQueryError(err.message));
  }
}
function* reindexAll(action) {
  try {
    let response = yield call(() => api.reindexAll());
    if (response) {
      yield put(actions.reindexAllSuccess(response.data));
    } 
    else {
      yield put(actions.reindexAllError(response.message));
    }
  } 
  catch (err) {
    console.log(err);
    yield put(actions.reindexAllError(err.message));
  }
}
function* reindexByDate(action) {
  try {
    let response = yield call(() => api.reindexByDate(action.date));
    if (response) {
      yield put(actions.reindexByDateSuccess(response.data));
    } 
    else {
      yield put(actions.reindexByDateError(response.message));
    }
  } 
  catch (err) {
    console.log(err);
    yield put(actions.reindexByDateError(err.message));
  }
}
function* reindexAllDocuments(action) {
  console.log(action)
  try {
    let response = yield call(() => api.reindexAllDocuments(action.primaryKey, action.indexName));
    if (response) {
      yield put(actions.reindexAllDocumentsSuccess(response.data));
    } 
    else {
      yield put(actions.reindexAllDocumentsError(response.message));
    }
  } 
  catch (err) {
    console.log(err);
    yield put(actions.reindexAllDocumentsError(err.message));
  }
}

function* reindexStudy(action) {
  try {
    let response = yield call(() => api.reindexStudy(action.nctId));
    if (response) {
      yield put(actions.reindexStudySuccess(response.data));
    } 
    else {
      yield put(actions.reindexStudyError(response.message));
    }
  } 
  catch (err) {
    console.log(err);
    yield put(actions.reindexStudyError(err.message));
  }
}
function* reindexDocument(action) {
  console.log("ACT", action)
  try {
    let response = yield call(() => api.reindexDocument(action.primaryKey, action.primaryKeyList, action.indexName));
    if (response) {
      yield put(actions.reindexDocumentSuccess(response.data));
    } 
    else {
      yield put(actions.reindexDocumentError(response.message));
    }
  } 
  catch (err) {
    console.log(err);
    yield put(actions.reindexDocumentError(err.message));
  }
}

export default function* userSagas() {
  yield takeLatest(types.ACTION_QUERY_SEND, actionQuery);
  yield takeLatest(types.REINDEX_ALL_SEND, reindexAll);
  yield takeLatest(types.REINDEX_BY_DATE_SEND, reindexByDate);
  yield takeLatest(types.REINDEX_ALL_DOCUMENT_SEND, reindexAllDocuments);
  yield takeLatest(types.REINDEX_STUDY_SEND, reindexStudy);
  yield takeLatest(types.REINDEX_DOCUMENT_SEND, reindexDocument);
}
