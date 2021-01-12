import * as types from './types';

const initialState: types.SearchState = {
    isFetchingAggs: false,
    aggs: undefined,
    isSearching: false,
    searchResults: undefined,
    isFetchingAutoSuggest: false,
    suggestions: []
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

        case types.FETCH_SEARCH_AUTOSUGGEST_SEND:
            return {
                ...state,
                isFetchingAutoSuggest: true
            };
        case types.FETCH_SEARCH_AUTOSUGGEST_SUCCESS:
            return {
                ...state,
                isFetchingAutoSuggest: false,
                suggestions: action.payload
            };
        case types.FETCH_SEARCH_AUTOSUGGEST_ERROR:
            return {
                ...state,
                isFetchingAutoSuggest: false
            };
                
        default:
            return {...state};
    }
}

export default searchReducer;