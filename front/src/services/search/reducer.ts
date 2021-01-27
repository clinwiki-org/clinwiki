import * as types from './types';

const initialState: types.SearchState = {
    isFetchingAggs: false,
    aggs: undefined,
    isFetchingAggBuckets: false,
    aggBuckets:  undefined,
    isFetchingCrowdAggBuckets: false,
    crowdAggBuckets: undefined,
    isFetchingSearchParams: false,
    searchResults: undefined,
    isFetchingStudies: false,
    studies: undefined,
    isUpdatingParams: false,
    searchHash: undefined,
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

        case types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND:
            return {
                ...state,
                isFetchingAggBuckets: true
            };
        case types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS:
            return {
                ...state,
                isFetchingAggBuckets: false,
                aggBuckets: {
                    ...state.aggBuckets,
                    aggs: {
                        ...state.aggBuckets?.aggs,
                        [action.payload.name]: action.payload.buckets
                    }
                }      
            };
        case types.FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR:
            return {
                ...state,
                isFetchingAggBuckets: false
            };

        case types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND:
            return {
                ...state,
                isFetchingCrowdAggBuckets: true
            };
        case types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS:
            let backendName = action.payload.name 
            let frontName = backendName.substring(3);     
            return {
                ...state,
                isFetchingCrowdAggBuckets: false,
                crowdAggBuckets: {
                    ...state.crowdAggBuckets,
                    aggs: {
                        ...state.crowdAggBuckets?.aggs,
                        [frontName]: action.payload.buckets
                    }
                } 
            };
        case types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR:
            return {
                ...state,
                isFetchingCrowdAggBuckets: false
            };
        

        case types.FETCH_SEARCH_PARAMS_SEND:
            return {
                ...state,
                isFetchingSearchParams: true
            };
        case types.FETCH_SEARCH_PARAMS_SUCCESS:
            return {
                ...state,
                isFetchingSearchParams: false,
                searchResults: action.payload
            };
        case types.FETCH_SEARCH_PARAMS_ERROR:
            return {
                ...state,
                isFetchingSearchParams: false
            };
        case types.UPDATE_SEARCH_PARAMS_SEND:
            return {
                ...state,
                isUpdatingParams: true
            };
        case types.UPDATE_SEARCH_PARAMS_SUCCESS:
            return {
                ...state,
                isUpdatingParams: false,
                searchHash: action.payload
            };
        case types.UPDATE_SEARCH_PARAMS_ERROR:
            return {
                ...state,
                isUpdatingParams: false
            };
        case types.FETCH_SEARCH_STUDIES_SEND:
            return {
                ...state,
                isFetchingStudies: true
            };
        case types.FETCH_SEARCH_STUDIES_SUCCESS:
            return {
                ...state,
                isFetchingStudies: false,
                studies: action.payload
            };
        case types.FETCH_SEARCH_STUDIES_ERROR:
            return {
                ...state,
                isFetchingStudies: false
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