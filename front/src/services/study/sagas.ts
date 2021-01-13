import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';



function* getStudyPage(action) {
    try {
        let response = yield call(() => api.fetchStudyPage());
        if(response) {
            yield put(actions.fetchStudyPageSuccess(response));
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




export default function* userSagas() {
    yield takeLatest(types.FETCH_STUDY_PAGE_SEND, getStudyPage);

}
