import * as types from './types';

const initialState: types.SearchState = {
    isFetchingAggs: false,
    aggs: undefined,
    isSearching: false,
    searchResults: undefined
};

const searchReducer = ( state = initialState, action: types.SearchActionTypes) : types.SearchState => {
    switch(action.type) {
        case types.FETCH_SEARCH_PAGE_AGGS_SEND:
            return {
                ...state,
                isFetchingAggs: true
            };
        case types.FETCH_SEARCH_PAGE_AGGS_SUCCESS:
            return {
                ...state,
                isFetchingAggs: false,
                aggs: action.payload
            };
        case types.FETCH_SEARCH_PAGE_AGGS_ERROR:
            return {
                ...state,
                isFetchingAggs: false
            };

        case types.FETCH_SEARCH_STUDIES_SEND:
            return {
                ...state,
                isSearching: true
            };
        case types.FETCH_SEARCH_STUDIES_SUCCESS:
            return {
                ...state,
                isSearching: false,
                searchResults: action.payload
            };
        case types.FETCH_SEARCH_STUDIES_ERROR:
            return {
                ...state,
                isSearching: false
            };
    
        default:
            return {...state};
    }
}

export default searchReducer;