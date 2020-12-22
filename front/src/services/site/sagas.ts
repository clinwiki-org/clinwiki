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

export default function* userSagas() {
    yield takeLatest(types.FETCH_ADMIN_SITE_VIEW_SEND, getAdminSiteView);
}
