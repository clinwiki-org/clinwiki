import { getSitesPage } from '../site/sagas'
import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import * as actions from './actions';
import * as types from './types';
import * as siteActions from '../site/actions'

function* updateSiteHasura(action) { 
    try {
        //console.log("updateSiteHasura called in hasiraSite/sagas", action);
        let updateResponse = yield call(() => api.updateSiteHasura(action.input));
        //console.log('response = ', updateResponse);
        if (updateResponse.data.updateSitehasura.errors === null){ 
            let response = yield getSitesPage(action);
            yield put(actions.updateSiteHasuraSuccess(response.data));
        }
        else {
            yield put(actions.updateSiteHasuraError(updateResponse.message));
        }
    }
    catch(err) {
        //console.log(err);
        yield put(actions.updateSiteHasuraError(err.message));
    }
}

export function* getSitesPageHasura(action) {
    //console.log("getSitesPageHasura called in hasuraSites sagas");
    try {
        let response = yield call(() => api.fetchSitesPageHasura());
    	//console.log(response);
        const hasuraSites = {"me": {"id": 1, "ownSites": response.data.sites, "editorSites": response.data.sites}};
        //console.log(hasuraSites);
        if(response) {
            yield put(siteActions.fetchSitesPageSuccess(hasuraSites));
            return response;
        }
        else {
            yield put(actions.fetchSitesPageHasuraError(response.message));
        }
    }
    catch(err) {
        //console.log(err);
        yield put(actions.fetchSitesPageHasuraError(err.message));
    }
}

function* getSiteProviderHasura(action) {
    //console.log("getSiteProviderHasura called in hasuraSite/sagas", action);
    try {
        let response = yield call(() => api.fetchSiteProviderHasura(action.id, action.url));
        //console.log(response);
        const hasuraSiteProvider = {"id": response.data.sites[0].id, 
                                    "editors": [ "charlesvincentanderson@gmail.com" ], 
                                    "name": response.data.sites[0].name, 
                                    "skipLanding": response.data.sites[0].skip_landing, 
                                    "hideDonation": response.data.sites[0].hide_donation, 
                                    "subdomain": response.data.sites[0].subdomain, 
                                    "themes": response.data.sites[0].themes, 
                                    "reactionsConfig": response.data.sites[0].reactions_config, 
                                    "userRank": response.data.sites[0].user_rank, 
                                    "owners": [ "charlesvincentanderson@gmail.com"]
                                    };
        //console.log(hasuraSiteProvider);
        if(response) {
            yield put(actions.fetchSiteProviderHasuraSuccess(hasuraSiteProvider));
            return hasuraSiteProvider;
        }
        else {
            yield put(actions.fetchSiteProviderHasuraError(response.message));
        }
    }
    catch(err) {
        //console.log(err);
        yield put(actions.fetchSiteProviderHasuraError(err.message));
    }
}

export default function* hasuraSagas() {
    yield takeLatest(types.FETCH_SITES_PAGE_HASURA_SEND, getSitesPageHasura);
    yield takeLatest(types.FETCH_SITE_PROVIDER_HASURA_SEND, getSiteProviderHasura);
    yield takeLatest(types.UPDATE_SITE_HASURA_SEND, updateSiteHasura);
}
