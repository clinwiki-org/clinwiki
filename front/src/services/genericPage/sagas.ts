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

export default function* genericPageSagas() {
    yield takeLatest(types.INSERT_PAGE_VIEW_LOG_SEND, insertPageViewLog);

}
