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

export default function* userSagas() {
    yield takeLatest(types.FETCH_STUDY_PAGE_SEND, getStudyPage);
    yield takeLatest(types.FETCH_PAGE_VIEWS_SEND, getPageViews);
    yield takeLatest(types.FETCH_PAGE_VIEW_SEND, getPageView);
    yield takeLatest(types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND, updateStudyViewLogCount);

}
