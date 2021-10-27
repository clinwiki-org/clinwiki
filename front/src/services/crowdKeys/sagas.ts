import * as actions from './actions';
import * as api from './api';
import * as types from './types';

import { call, put, select, takeLatest } from 'redux-saga/effects';

import { fetchSuggestedLabels } from './../study/actions';

const getCurrentSuggestedLabels = state => state.study.suggestedLabels;

function* insertCrowdKeyValueId(action) {
    const currentLabels = yield select(getCurrentSuggestedLabels);
    const currentKeys = currentLabels.data.crowd_keys;
    const currentValues = currentLabels.data.crowd_key_value_ids;
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
            let crowdKeysArray = currentValues.map(a => a.crowd_key).concat(currentKeys.map(a=>a.crowd_key));
//TO-DO revisit and check why this fetch suggested label is here, was sending empty crowdKeysArray and clearing our data in store 
            yield crowdKeysArray[0] && put(
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
    const currentValues = currentLabels.data.crowd_key_value_ids;
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
            let crowdKeysArray = currentValues.map(a => a.crowd_key).concat(currentKeys.map(a=>a.crowd_key));
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

function* updateCrowdKeyValueId(action) {
    const currentLabels = yield select(getCurrentSuggestedLabels);
    const currentKeys = currentLabels.data.crowd_keys;
    const currentValues = currentLabels.data.crowd_key_value_ids;
    try {
        //console.log("updateCrowdKeyValueId called in hasiraSite/sagas", action);
        let updateResponse = yield call(() =>
            api.updateCrowdKeyValueId(
                action.crowdKeyValueIdPK,
                action.crowdValue
            )
        );
        console.log('update CKVID res', updateResponse);
        if (updateResponse?.data?.update_crowd_key_value_ids_by_pk) {
            let crowdKeysArray = currentValues.map(a => a.crowd_key).concat(currentKeys.map(a=>a.crowd_key));
//TO-DO revisit and check why this fetch suggested label is here, was sending empty crowdKeysArray and clearing our data in store 
            yield  crowdKeysArray[0] && put(
                fetchSuggestedLabels(action.crowdKeyValueId, crowdKeysArray)
            );
            yield put(
                actions.updateCrowdKeyValueIdSuccess(updateResponse.data)
            );
        } else {
            yield put(
                actions.updateCrowdKeyValueIdError(updateResponse.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.updateCrowdKeyValueIdError(err.message));
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
    yield takeLatest(
        types.UPDATE_CROWD_KEY_VALUE_ID_SEND,
        updateCrowdKeyValueId
    );
}
