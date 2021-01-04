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
        console.log("GetSitesPage",response)
        if(response) {
            yield put(actions.fetchSitesPageSuccess(response.data));
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
            //console.log("🚀 ~  NEW SITES", newSites);
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
        console.log("SAGA CREATING SITE", action);
        let response = yield call(() => api.createSite(action.input));  //! ERROR on response message: "Parse error on "[" (LBRACKET) at [11, 3]"

        console.log("🚀 *createSite ~ response", response);

        if (response.data.createSite.errors === null){  //! createSite undefined since response errors.
            yield getSitesPage(action);
            yield put(actions.createSiteSuccess(response.data));
        }
        else {
            yield put(actions.createSiteError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.createSiteError(err.message));
    }
}

export default function* userSagas() {
    yield takeLatest(types.FETCH_ADMIN_SITE_VIEW_SEND, getAdminSiteView);
    yield takeLatest(types.FETCH_SITES_PAGE_SEND, getSitesPage);
    yield takeLatest(types.DELETE_SITE_SEND, deleteSite);
    yield takeLatest(types.CREATE_SITE_SEND, createSite);
}
