import * as types from './types';

const initialState: types.AdminState = {
    isReindexing: false,
    isLookingUp: false,
    reIndexingErrors: [],
    actionData: undefined
};

const adminReducer = ( state = initialState, action: types.AdminActionTypes) : types.AdminState => {
    switch(action.type) {
        case types.ACTION_QUERY_SEND:
            return {
                ...state,
                isLookingUp: true
            };
        case types.ACTION_QUERY_SUCCESS:
            let resultObject = {};
            resultObject[action.label]=action.payload
            return {
                ...state,
                isLookingUp: false,
                actionData: resultObject
            };
        case types.ACTION_QUERY_ERROR:
            return {
                ...state,
                isLookingUp: false
            };
        case types.REINDEX_ALL_SEND:
            return {
                ...state,
                isReindexing: true
            };
        case types.REINDEX_ALL_SUCCESS:
            return {
                ...state,
                isReindexing: false
            };
        case types.REINDEX_ALL_ERROR:
            return {
                ...state,
                isReindexing: false
            };

        case types.REINDEX_STUDY_SEND:
            return {
                ...state,
                isReindexing: true
            };
        case types.REINDEX_STUDY_SUCCESS:
            return {
                ...state,
                isReindexing: false
            };
        case types.REINDEX_STUDY_ERROR:
            return {
                ...state,
                isReindexing: false
            };
                    
        default:
            return {...state};
    }
}

export default adminReducer;