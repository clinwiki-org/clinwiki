import * as actions from './actions';
import * as api from './api';
import * as types from './types';

import { call, put, select, takeLatest } from 'redux-saga/effects';



function* getHasuraPresentSiteProvider(action) {
    //console.log("SAGA get Present Site Provider", action);
    try {
        let response = yield call(() =>
            api.fetchHasuraPresentSiteProvider(action.id, action.url)
        );
        if (response) {
            if (response.errors) {
                //console.log('HasuraPresentSite ERROR', response.errors[0]);
                localStorage.removeItem('jwt');
                action.history.push('/sign_in');
                window.location.reload();
            }
            yield put(
                actions.fetchHasuraPresentSiteProviderSuccess(response.data)
            );
            return response;
        } else {
            yield put(
                actions.fetchHasuraPresentSiteProviderError(response.message)
            );
        }
    } catch (err) {
        console.log('HasuraPresentSite response ERROR', err);
        yield put(actions.fetchHasuraPresentSiteProviderError(err.message));
    }
}

export default function* userSagas() {

    yield takeLatest(
        types.FETCH_HASURA_PRESENT_SITE_PROVIDER_SEND,
        getHasuraPresentSiteProvider
    );

}
