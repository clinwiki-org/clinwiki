import { getSitesPage } from '../site/sagas'
import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import * as actions from './actions';
import * as types from './types';

function* updateSiteHasura(action) { 
    try {
        //console.log("SAGA Updating SITE", action);
        let updateResponse = yield call(() => api.updateSiteHasura(action.input)); 
        if (updateResponse.data.updateSitehasura.errors === null){ 
            let response = yield getSitesPage(action);
            yield put(actions.updateSiteHasuraSuccess(response.data));
        }
        else {
            yield put(actions.updateSiteHasuraError(updateResponse.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.updateSiteHasuraError(err.message));
    }
}

export function* getSitesPageHasura(action) {
    console.log("getSitesOageHasura called in hasuraSites sagas");
    try {
        let response = yield call(() => api.fetchSitesPageHasura());
    	console.log(response);
        if(response) {
            yield put(actions.fetchSitesPageHasuraSuccess(response.data));
            return response;
        }
        else {
            yield put(actions.fetchSitesPageHasuraError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSitesPageHasuraError(err.message));
    }
}

export default function* hasuraSagas() {
    yield takeLatest(types.FETCH_SITES_PAGE_HASURA_SEND, getSitesPageHasura);
}
