import { call, put, takeLatest, select } from 'redux-saga/effects';
import { push } from 'connected-react-router'
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
            yield put(actions.fetchSearchParamsSuccess(response));
            yield put(actions.updateSearchParamsSuccess(action.hash))
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
    try {
        let response = yield call(() => api.fetchSearchStudies(action.searchParams));
        if(response) {
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
function* updateSearchParams(action) { 
    try {
        let updateResponse = yield call(() => api.updateSearchParams(action)); 
        let location = yield select( (state) => state.router.location);
        let searchHash = updateResponse.data.provisionSearchHash.searchHash
        if (updateResponse.data.provisionSearchHash.searchHash !== null){ 
            yield put(actions.fetchSearchParams(searchHash.short))
            yield put(actions.updateSearchParamsSuccess(searchHash));
            yield put(push(`/search?hash=${searchHash.short}&sv=${location.query.sv}&pv=${location.query.pv}`))
        }
        else {
            yield put(actions.updateSearchParamsError(updateResponse.message));
        }
    }
    catch(err) {
        console.log("err");
        yield put(actions.updateSearchParamsError(err.message));
    }
}

export default function* userSagas() {
    yield takeLatest(types.FETCH_SEARCH_PAGE_AGGS_SEND, getSearchPageAggs);
    yield takeLatest(types.FETCH_SEARCH_PARAMS_SEND, getSearchParams);
    yield takeLatest(types.FETCH_SEARCH_STUDIES_SEND, getSearchStudies);
    yield takeLatest(types.UPDATE_SEARCH_PARAMS_SEND, updateSearchParams)
}
