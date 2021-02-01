import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';

const getCurrentPageViews = (state)=> state.study.pageViews.data.site.pageViews; //TODO CHeck path to redux store pageViews


function* getSampleStudy(action) {
    try {
        let response = yield call(() => api.fetchSampleStudy(action.nctId));
        if(response) {
            yield put(actions.fetchSampleStudySuccess(response));
        }
        else {
            yield put(actions.fetchSampleStudyError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSampleStudyError(err.message));
    }
}

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
            return response;
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

//PAGE VIEW SAGAS

function* createPageView(action) {
    try {
       // console.log("SAGA CREATING PAGE VIEW", action);
        let createResponse = yield call(() => api.createPageView(action.url, action.siteId)); 
        if (createResponse.data.createPageView.errors === null){                     
            let response = yield getPageViews(action);    
            yield put(actions.createPageViewSuccess(response));
        }
        else {
            yield put(actions.createPageViewError(createResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.createPageViewError(err.message));
    }
}

function* updatePageView(action) { 
    try {
       // console.log("SAGA Updating PAGE VIEW", action);
        let updateResponse = yield call(() => api.updatePageView(action.input)); 
        if (updateResponse.data.updatePageView.errors === null){ 
            let response = yield getPageViews(action); 
            yield put(actions.updatePageViewSuccess(response));
        }
        else {
            yield put(actions.updatePageViewError(updateResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.updatePageViewError(err.message));
    }
}

function* deletePageView(action) { 
    const currentPageViews = yield select(getCurrentPageViews)
    try {
        //console.log("SAGA DELETE PAGE VIEW", action);
        let response = yield call(() => api.deletePageView(action.id));
        const { id } = response.data.deletePageView.pageView
        if(id === action.id) {
            let newPageViews = currentPageViews.filter(pv => pv.id !== id)
            //console.log("🚀 ~  ~ newPageViews", newPageViews);
            yield put(actions.deletePageViewSuccess(newPageViews));
        }    
        else {
            yield put(actions.deletePageViewError(response.message));
        }   
    }    
    catch(err) {
        console.log(err);
        yield put(actions.deletePageViewError(err.message));
    }    
}    

export default function* userSagas() {
    yield takeLatest(types.FETCH_SAMPLE_STUDY_SEND, getSampleStudy);
    yield takeLatest(types.FETCH_STUDY_PAGE_SEND, getStudyPage);
    yield takeLatest(types.FETCH_PAGE_VIEWS_SEND, getPageViews);
    yield takeLatest(types.FETCH_PAGE_VIEW_SEND, getPageView);
    yield takeLatest(types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND, updateStudyViewLogCount);
    yield takeLatest(types.CREATE_PAGE_VIEW_SEND, createPageView)
    yield takeLatest(types.DELETE_PAGE_VIEW_SEND, deletePageView);
    yield takeLatest(types.UPDATE_PAGE_VIEW_SEND, updatePageView);
}
