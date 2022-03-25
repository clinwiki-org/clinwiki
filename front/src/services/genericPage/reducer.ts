import * as types from './types';

const initialState: types.GenericPageState = {
    isFetchingGenericPage: false,
    isFetchingMMSchemas: false,
    isInsertingPageViewLog: false,
    genericPageData: undefined,
    MMSchemas: undefined,
    metaFields: {},
};

const genericPageReducer = (
    state = initialState,
    action: types.GenericPageActionTypes
): types.GenericPageState => {
    switch (action.type) {
        case types.FETCH_GENERIC_PAGE_SEND:
            return {
                ...state,
                isFetchingGenericPage: true,
            };
        case types.FETCH_GENERIC_PAGE_SUCCESS:
            let tempObject = {...state.genericPageData}
            tempObject[action.name] = action.payload
            return {
                ...state,
                isFetchingGenericPage: false,
                genericPageData: {...tempObject, currentPage: action.name},
            };
        case types.FETCH_GENERIC_PAGE_ERROR:
            return {
                ...state,
                isFetchingGenericPage: false,
            };
            
        case types.FETCH_MM_SCHEMAS_SEND:
            return {
                ...state,
                isFetchingMMSchemas: true,
            };
        case types.FETCH_MM_SCHEMAS_SUCCESS:
            return {
                ...state,
                isFetchingMMSchemas: false,
                MMSchemas: action.payload.data,
            };
        case types.FETCH_MM_SCHEMAS_ERROR:
            return {
                ...state,
                isFetchingMMSchemas: false,
            };
            
        case types.FETCH_META_FIELDS_SUCCESS:
            return {
                ...state,
                metaFields: action.payload
            };
  
        default:
            return { ...state };
    }
};

export default genericPageReducer;
