import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';

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
  yield takeLatest(types.REINDEX_ALL_SEND, reindexAll);
  yield takeLatest(types.REINDEX_STUDY_SEND, reindexStudy);
  yield takeLatest(types.REINDEX_DOCUMENT_SEND, reindexDocument);
}
