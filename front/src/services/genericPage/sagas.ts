import * as actions from './actions';
import * as api from './api';
import * as types from './types';

import { call, put, select, takeLatest } from 'redux-saga/effects';



const getCurrentUser = state => state.user.current;


function* insertPageViewLog(action) {
    try {
        const currentUser = yield select(getCurrentUser);
       let response = yield call(()=>api.InsertPageViewLog(action.userId, action.url))
        //No success action or error action called as this may be replaced by HasuraGenericTable editor 
       // if (response){}
    } catch (err) {
        console.log(err);
        // yield put(actions.InsertPageviewError(err.message));
    }
}

function* getGenericPage(action) {
    try {
        let response = yield call(() =>
            api.fetchGenericPage(action.params, action.primaryKey, action.QUERY, action.useHasura)
        );
        if (response) {
            yield put(actions.fetchGenericPageSuccess(action.name, response));
        } else {
            yield put(actions.fetchGenericPageError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchGenericPageError(err.message));
    }
}
export default function* genericPageSagas() {
    yield takeLatest(types.INSERT_PAGE_VIEW_LOG_SEND, insertPageViewLog);
    yield takeLatest(types.FETCH_GENERIC_PAGE_SEND, getGenericPage);

}
