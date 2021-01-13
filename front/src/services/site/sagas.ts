import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';


const getCurrentSites = (state) => state.site.sitesData.me;

function* getAdminSiteView(action) {
    try {
        let response = yield call(() => api.fetchAdminSiteView());
        if(response) {
            yield put(actions.fetchAdminSiteViewSuccess(response));
        }
        else {
            yield put(actions.fetchAdminSiteViewError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchAdminSiteViewError(err.message));
    }
}

function* getSitesPage(action) {
    try {
        let response = yield call(() => api.fetchSitesPage());
        if(response) {
            yield put(actions.fetchSitesPageSuccess(response.data));
            return response;
        }
        else {
            yield put(actions.fetchSitesPageError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSitesPageError(err.message));
    }
}

function* getSiteProvider(action) {
            //console.log("SAGA get Site Provider", action);
    try {
        let response = yield call(() => api.fetchSiteProvider(action.id, action.url));
        if(response) {
            yield put(actions.fetchSiteProviderSuccess(response.data));
            return response;
        }
        else {
            yield put(actions.fetchSiteProviderError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSiteProviderError(err.message));
    }
}


function* deleteSite(action) { 
    const currentSites = yield select(getCurrentSites)
    try {
        //console.log("SAGA Current SITES", currentSites);
        let response = yield call(() => api.deleteSite(action.id));
        const { id } = response.data.deleteSite.site
        if(id === action.id) {
            let newEditorSites = currentSites.editorSites.filter(site => site.id !== id)
            let newOwnSites = currentSites.ownSites.filter(site => site.id !== id)
            let newSites = {
                id: currentSites.id,
                ownSites: newOwnSites,
                editorSites: newEditorSites
            }
            yield put(actions.deleteSiteSuccess(newSites));
        }
        else {
            yield put(actions.deleteSiteError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.deleteSiteError(err.message));
    }
}

function* createSite(action) { 
    try {
        //console.log("SAGA CREATING SITE", action);
        let createResponse = yield call(() => api.createSite(action.input)); 
        if (createResponse.data.createSite.errors === null){ 
            let response = yield getSitesPage(action);
            yield put(actions.createSiteSuccess(response.data));
        }
        else {
            yield put(actions.createSiteError(createResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.createSiteError(err.message));
    }
}

function* updateSite(action) { 
    try {
        //console.log("SAGA Updating SITE", action);
        let updateResponse = yield call(() => api.updateSite(action.input)); 
        if (updateResponse.data.updateSite.errors === null){ 
            let response = yield getSitesPage(action);
            yield put(actions.updateSiteSuccess(response.data));
        }
        else {
            yield put(actions.updateSiteError(updateResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.updateSiteError(err.message));
    }
}


export default function* userSagas() {
    yield takeLatest(types.FETCH_ADMIN_SITE_VIEW_SEND, getAdminSiteView);
    yield takeLatest(types.FETCH_SITES_PAGE_SEND, getSitesPage);
    yield takeLatest(types.FETCH_SITE_PROVIDER_SEND, getSiteProvider);
    yield takeLatest(types.DELETE_SITE_SEND, deleteSite);
    yield takeLatest(types.CREATE_SITE_SEND, createSite);
    yield takeLatest(types.UPDATE_SITE_SEND, updateSite);
    yield takeLatest(types.COPY_SITE_VIEW_SEND, copySiteView);
}

function* copySiteView(action) { 
    const currentSites = yield select(getCurrentSites) //TODO check saga getCurrentSites
    try {
        //console.log("SAGA Current SITES", currentSites);
        let response = yield call(() => api.copySiteView(action.id));
        const { id } = response.data.copySiteView.site
        if(id === action.id) {
            let newEditorSites = currentSites.editorSites.filter(site => site.id !== id)
            let newOwnSites = currentSites.ownSites.filter(site => site.id !== id)
            let newSites = {
                id: currentSites.id,
                ownSites: newOwnSites,
                editorSites: newEditorSites
            }
            yield put(actions.copySiteViewSuccess(newSites));
        }
        else {
            yield put(actions.copySiteViewError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.copySiteViewError(err.message));
    }
}
