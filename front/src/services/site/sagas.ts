import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';

const getCurrentSites = (state) => state.site.sitesData.me;
const getCurrentSiteViews = (state)=> state.site.siteProvider.site.siteViews;


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
          //  console.log("SAGA get Site Provider", action);
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

function* getPresentSiteProvider(action) {
            //console.log("SAGA get Present Site Provider", action);
    try {
        let response = yield call(() => api.fetchPresentSiteProvider(action.id, action.url));
        if(response) {
            yield put(actions.fetchPresentSiteProviderSuccess(response.data));
            return response;
        }
        else {
            yield put(actions.fetchPresentSiteProviderError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchPresentSiteProviderError(err.message));
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

//SITE VIEW SAGAS

function* createSiteView(action) {
    try {
       // console.log("SAGA CREATING SITE VIEW", action);
        let createResponse = yield call(() => api.createSiteView(action.input)); 
    // NOTE CRUD site view mutations now pass in the site ID inside action.param
    // old Apollo(refetch) used the fetchSiteProvider action after mutations in the handleSave > SiteViewsForm.tsx to refresh data.
        if (createResponse.data.createSiteView.errors === null){                     
            let response = yield getSiteProvider(action);    
            yield put(actions.createSiteViewSuccess(response.data));
        }
        else {
            yield put(actions.createSiteViewError(createResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.createSiteViewError(err.message));
    }
}

function* copySiteView(action) { 
    try {
       // console.log("SAGA COPY SITE VIEW", action);
        let copyResponse = yield call(() => api.copySiteView(action.input)); 
        if (copyResponse.data.copySiteView.errors === null){ 
            let response = yield getSiteProvider(action);
            yield put(actions.copySiteViewSuccess(response.data));
        }
        else {
            yield put(actions.copySiteViewError(copyResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.copySiteViewError(err.message));
    }
}    

function* updateSiteView(action) { 
    try {
       // console.log("SAGA Updating SITE VIEW", action);
        let updateResponse = yield call(() => api.updateSiteView(action.input)); 
        if (updateResponse.data.updateSiteView.errors === null){ 
            let response = yield getSiteProvider(action); 
            yield put(actions.updateSiteViewSuccess(response.data));
        }
        else {
            yield put(actions.updateSiteViewError(updateResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.updateSiteViewError(err.message));
    }
}

function* deleteSiteView(action) { 
    const currentSiteViews = yield select(getCurrentSiteViews)
    try {
        //console.log("SAGA DELETE SITE VIEW", action);
        let response = yield call(() => api.deleteSiteView(action.input));
        const { id } = response.data.deleteSiteView.siteView
        if(id === action.input.id) {
            let newSiteViews = currentSiteViews.filter(sv => sv.id !== id)
            yield put(actions.deleteSiteViewSuccess(newSiteViews));
        }    
        else {
            yield put(actions.deleteSiteViewError(response.message));
        }   
    }    
    catch(err) {
        console.log(err);
        yield put(actions.deleteSiteViewError(err.message));
    }    
}    

export default function* userSagas() {
    yield takeLatest(types.FETCH_ADMIN_SITE_VIEW_SEND, getAdminSiteView);
    yield takeLatest(types.FETCH_SITES_PAGE_SEND, getSitesPage);
    yield takeLatest(types.FETCH_SITE_PROVIDER_SEND, getSiteProvider);
    yield takeLatest(types.FETCH_PRESENT_SITE_PROVIDER_SEND, getPresentSiteProvider);
    yield takeLatest(types.DELETE_SITE_SEND, deleteSite);
    yield takeLatest(types.CREATE_SITE_SEND, createSite);
    yield takeLatest(types.UPDATE_SITE_SEND, updateSite);
    yield takeLatest(types.COPY_SITE_VIEW_SEND, copySiteView);
    yield takeLatest(types.CREATE_SITE_VIEW_SEND, createSiteView)
    yield takeLatest(types.DELETE_SITE_VIEW_SEND, deleteSiteView);
    yield takeLatest(types.UPDATE_SITE_VIEW_SEND, updateSiteView);
}
