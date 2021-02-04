import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';


function* getIntrospection(action) {
    try {
        let response = yield call(() => api.fetchIntrospection(action.QUERY));
        if(response) {
            yield put(actions.fetchIntrospectionSuccess(response));
        }
        else {
            yield put(actions.fetchIntrospectionError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchIntrospectionError(err.message));
    }
}

export default function* introspectionSagas() {
    yield takeLatest(types.FETCH_INTROSPECTION_SEND, getIntrospection);
}