import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import * as actions from './actions';
import * as types from './types';

function* insertCrowdKeyValueId(action) {
    try {
        //console.log("insertCrowdKeyValueId called in hasiraSite/sagas", action);
        let updateResponse = yield call(() =>
            api.insertCrowdKeyValueId(
                action.crowdKeyValueId,
                action.crowdValue,
                action.crowdKey,
                action.userId,
                action.verified,
                action.approved
            )
        );
        //console.log('response = ', updateResponse);
        if (updateResponse?.data?.updateSitehasura.errors === null) {
            yield put(
                actions.insertCrowdKeyValueIdSuccess(updateResponse.data)
            );
        } else {
            yield put(
                actions.insertCrowdKeyValueIdError(updateResponse.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.insertCrowdKeyValueIdError(err.message));
    }
}
function* deleteCrowdKeyValueId(action) {
    try {
        // console.log("deleteCrowdKeyValueId called in hasiraSite/sagas", action);
        let updateResponse = yield call(() =>
            api.deleteCrowdKeyValueId(
                action.crowdKeyValueId,
                action.crowdValue,
                action.crowdKey
            )
        );
        //console.log('response = ', updateResponse);
        if (updateResponse?.data?.updateSitehasura.errors === null) {
            yield put(
                actions.deleteCrowdKeyValueIdSuccess(updateResponse.data)
            );
        } else {
            yield put(
                actions.deleteCrowdKeyValueIdError(updateResponse.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.deleteCrowdKeyValueIdError(err.message));
    }
}

export default function* hasuraSagas() {
    yield takeLatest(
        types.INSERT_CROWD_KEY_VALUE_ID_SEND,
        insertCrowdKeyValueId
    );
    yield takeLatest(
        types.DELETE_CROWD_KEY_VALUE_ID_SEND,
        deleteCrowdKeyValueId
    );
}
