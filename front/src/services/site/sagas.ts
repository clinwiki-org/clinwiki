import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';

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

async function* deleteSite(action) {  //! Need to do both delete desired site and fetch sites data.
    try {

        yield await call(() => api.deleteSite(action.id));
        
        let response = yield call(() => api.fetchSitesData());
        if(response) {
            yield put(actions.deleteSiteSuccess(response.data));
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


export default function* userSagas() {
    yield takeLatest(types.FETCH_ADMIN_SITE_VIEW_SEND, getAdminSiteView);
    yield takeLatest(types.FETCH_SITES_PAGE_SEND, getSitesPage);
    yield takeLatest(types.DELETE_SITE_SEND, deleteSite);
}
