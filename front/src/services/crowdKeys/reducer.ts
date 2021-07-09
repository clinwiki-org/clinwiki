import * as types from './types';

const initialState: types.CrowdKeyState = {
    isUpdatingCrowdKeyValueId: false,
};

const crowdKeysReducer = (
    state = initialState,
    action: types.HasuraSiteActionTypes
): types.CrowdKeyState => {
    switch (action.type) {
        case types.INSERT_CROWD_KEY_VALUE_ID_SEND:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: true,
            };
        case types.INSERT_CROWD_KEY_VALUE_ID_SUCCESS:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: false,
            };
        case types.INSERT_CROWD_KEY_VALUE_ID_ERROR:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: false,
            };
        case types.DELETE_CROWD_KEY_VALUE_ID_SEND:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: true,
            };
        case types.DELETE_CROWD_KEY_VALUE_ID_SUCCESS:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: false,
            };
        case types.DELETE_CROWD_KEY_VALUE_ID_ERROR:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: false,
            };

        case types.UPDATE_CROWD_KEY_VALUE_ID_SEND:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: true,
            };
        case types.UPDATE_CROWD_KEY_VALUE_ID_SUCCESS:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: false,
            };
        case types.UPDATE_CROWD_KEY_VALUE_ID_ERROR:
            return {
                ...state,
                isUpdatingCrowdKeyValueId: false,
            };

        default:
            return { ...state };
    }
};

export default crowdKeysReducer;
