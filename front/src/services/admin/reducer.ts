import * as types from './types';

const initialState: types.AdminState = {
    isReindexing: false,
    reIndexingErrors: []
};

const adminReducer = ( state = initialState, action: types.AdminActionTypes) : types.AdminState => {
    switch(action.type) {
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