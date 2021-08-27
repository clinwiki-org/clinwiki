import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';


// function* getIntrospection(action) {
//     try {
//         let response = yield call(() => api.fetchIntrospection(action.QUERY));
//         if(response) {
//             yield put(actions.fetchIntrospectionSuccess(response));
//         }
//         else {
//             yield put(actions.fetchIntrospectionError(response.message));
//         }
//     }
//     catch(err) {
//         console.log(err);
//         yield put(actions.fetchIntrospectionError(err.message));
//     }
// }

function* getHasuraIntrospection(action) {
    try {
        let response = yield call(() => api.fetchHasuraIntrospection(action.QUERY));
        if(response) {
            yield put(actions.fetchHasuraIntrospectionSuccess(response));
        }
        else {
            yield put(actions.fetchHasuraIntrospectionError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchHasuraIntrospectionError(err.message));
    }
}
function* getNodeIntrospection(action) {
    try {
        let response = yield call(() => api.fetchNodeIntrospection(action.QUERY));
        if(response) {
            yield put(actions.fetchNodeIntrospectionSuccess(response));
        }
        else {
            yield put(actions.fetchNodeIntrospectionError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchNodeIntrospectionError(err.message));
    }
}


export default function* introspectionSagas() {
    // yield takeLatest(types.FETCH_INTROSPECTION_SEND, getIntrospection);
    yield takeLatest(types.FETCH_HASURA_INTROSPECTION_SEND, getHasuraIntrospection);
    yield takeLatest(types.FETCH_NODE_INTROSPECTION_SEND, getNodeIntrospection);
}