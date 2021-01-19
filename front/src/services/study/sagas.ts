import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';



function* getStudyPage(action) {
    try {
        let response = yield call(() => api.fetchStudyPage(action.nctId, action.QUERY));
        if(response) {
            yield put(actions.fetchStudyPageSuccess(response));
            yield call(()=> api.updateStudyViewLogCount(action.nctId));
        }
        else {
            yield put(actions.fetchStudyPageError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchStudyPageError(err.message));
    }
}
function* getPageViews(action) {
    try {
        let response = yield call(() => api.fetchPageViews(action));
        if(response) {
            yield put(actions.fetchPageViewsSuccess(response));
        }
        else {
            yield put(actions.fetchPageViewsError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchPageViewsError(err.message));
    }
}
function* getPageView(action) {
    try {
        let response = yield call(() => api.fetchPageView(action));
        if(response) {
            yield put(actions.fetchPageViewSuccess(response));
        }
        else {
            yield put(actions.fetchPageViewError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchPageViewError(err.message));
    }
}


function* updateStudyViewLogCount(action) { 
    try {
        let response = yield call(() => api.updateStudyViewLogCount(action.input)); 
        if (response){ 
            yield put(actions.updateStudyViewLogCountSuccess(response.data));
        }
        else {
            yield put(actions.updateStudyViewLogCountError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.updateStudyViewLogCountError(err.message));
    }
}
function* getWorkFlowPage(action) {
    try {
        let response = yield call(() => api.fetchWorkFlowPage(action.nctId));
        if(response) {
            yield put(actions.fetchWorkFlowPageSuccess(response));        }
        else {
            yield put(actions.fetchWorkFlowPageError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchWorkFlowPageError(err.message));
    }
}
function* upsertLabelMutation(action) {
    try {
        console.log(action)
        let response = yield call(() => api.upsertLabelMutation(action.nctId, action.key, action.value));
        if(response) {
            yield put(actions.upsertLabelMutation(response.nctId, response.key, response.any));
            yield call(()=> api.fetchWorkFlowPage(action.nctId));
        }
        else {
            yield put(actions.upsertLabelMutationError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.upsertLabelMutationError(err.message));
    }
}
function* deleteLabelMutation(action) {
    try {
        let response = yield call(() => api.deleteLabelMutation(action.nctId, action.key, action.value));
        if(response) {
            yield put(actions.deleteLabelMutation(response.nctId, response.key, response.any));
            yield call(()=> api.fetchWorkFlowPage(action.nctId));
        }
        else {
            yield put(actions.deleteLabelMutationError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.deleteLabelMutationError(err.message));
    }
}
export default function* userSagas() {
    yield takeLatest(types.FETCH_STUDY_PAGE_SEND, getStudyPage);
    yield takeLatest(types.FETCH_PAGE_VIEWS_SEND, getPageViews);
    yield takeLatest(types.FETCH_PAGE_VIEW_SEND, getPageView);
    yield takeLatest(types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND, updateStudyViewLogCount);
    yield takeLatest(types.FETCH_WORKFLOW_PAGE_SEND, getWorkFlowPage);
    yield takeLatest(types.UPSERT_LABEL_MUTATION_SEND, upsertLabelMutation);
    yield takeLatest(types.DELETE_LABEL_MUTATION_SEND, deleteLabelMutation);

}
