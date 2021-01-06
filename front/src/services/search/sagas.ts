import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';

function* getSearchPageAggs(action) {
    try {
        let response = yield call(() => api.fetchSearchPageAggs(action.searchParams));
        if(response) {
            yield put(actions.fetchSearchPageAggsSuccess(response));
        }
        else {
            yield put(actions.fetchSearchPageAggsError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchPageAggsError(err.message));
    }
}

function* getSearchParams(action) {
    try {
        let response = yield call(() => api.fetchSearchParams(action.hash));
        if(response) {
            console.log(response)
//          let aggsResponse = yield call(() => api.fetchSearchPageAggs(response.data.searchParams));
// console.log("AGG", aggsResponse)        
            yield put(actions.fetchSearchParamsSuccess(response));

}
        else {
            yield put(actions.fetchSearchParamsError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchParamsError(err.message));
    }
}
function* getSearchStudies(action) {
    console.log('getSearchStudies', action.searchParams)
    try {
        let response = yield call(() => api.fetchSearchStudies(action.searchParams));
        if(response) {
            console.log(response)
 
            yield put(actions.fetchSearchStudiesSuccess(response));

}
        else {
            yield put(actions.fetchSearchStudiesError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchStudiesError(err.message));
    }
}

export default function* userSagas() {
    yield takeLatest(types.FETCH_SEARCH_PAGE_AGGS_SEND, getSearchPageAggs);
    yield takeLatest(types.FETCH_SEARCH_PARAMS_SEND, getSearchParams);
    yield takeLatest(types.FETCH_SEARCH_STUDIES_SEND, getSearchStudies);
}
