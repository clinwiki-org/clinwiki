import { fetchSuggestedLabels } from './../study/actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import * as actions from './actions';
import * as types from './types';

const getCurrentSuggestedLabels = state => state.study.suggestedLabels;

function* insertCrowdKeyValueId(action) {
    const currentLabels = yield select(getCurrentSuggestedLabels);
    const currentKeys = currentLabels.data.crowd_keys;
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
        //console.log(action)
        if (updateResponse?.data?.insert_crowd_key_value_ids) {
            let crowdKeysArray =currentKeys.map(a => a.crowd_key);     
            yield put(
                fetchSuggestedLabels(action.crowdKeyValueId, crowdKeysArray)
            );
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
    const currentLabels = yield select(getCurrentSuggestedLabels);
    const currentKeys = currentLabels.data.crowd_keys;
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
        if (updateResponse?.data?.delete_crowd_key_value_ids) {
            let crowdKeysArray =currentKeys.map(a => a.crowd_key);
            yield put(
                fetchSuggestedLabels(action.crowdKeyValueId, crowdKeysArray)
            );
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
