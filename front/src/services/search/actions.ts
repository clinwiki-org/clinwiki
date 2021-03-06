import * as types from './types';
import {SearchPageAggsQuery} from './model/SearchPageAggsQuery';
import {SearchPageSearchQuery} from '../../services/search/model/SearchPageSearchQuery'
import { SearchPageAggBucketsQuery } from 'types/SearchPageAggBucketsQuery';
import { SearchPageCrowdAggBucketsQuery } from 'types/SearchPageCrowdAggBucketsQuery';
import { UserSavedSearchesQuery } from 'services/search/model/UserSavedSearchesQuery';


export const fetchSearchPageAggs = ( searchParams: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGGS_SEND,
    searchParams
});

export const fetchSearchPageAggsSuccess = (payload: SearchPageAggsQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGGS_SUCCESS,
    payload
});

export const fetchSearchPageAggsError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGGS_ERROR,
    payload: { message }
});


export const fetchSearchPageAggBuckets = ( searchParams: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND,
    searchParams         
});

export const fetchSearchPageAggBucketsSuccess = (payload: SearchPageAggBucketsQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS,
    payload
});

export const fetchSearchPageAggBucketsError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR,
    payload: { message }
});


export const fetchSearchPageCrowdAggBuckets = ( searchParams: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND,
    searchParams     
});

export const fetchSearchPageCrowdAggBucketsSuccess = (payload: SearchPageCrowdAggBucketsQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS,
    payload
});

export const fetchSearchPageCrowdAggBucketsError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR,
    payload: { message }
});

export const fetchCrumbsSearchPageAggBuckets = ( searchParams: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND,
    searchParams          //TODO CHeck
});

export const fetchCrumbsSearchPageAggBucketsSuccess = (payload: SearchPageAggBucketsQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS,
    payload
});

export const fetchCrumbsSearchPageAggBucketsError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR,
    payload: { message }
});


export const fetchSearchParams = ( hash: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PARAMS_SEND,
    hash
});

export const fetchSearchParamsSuccess = (payload:  any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PARAMS_SUCCESS,
    payload
});

export const fetchSearchParamsError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PARAMS_ERROR,
    payload: { message }
});
export const updateSearchParamsAction = ( searchParams: any) : types.SearchActionTypes => ({
    type: types.UPDATE_SEARCH_PARAMS_SEND,
    searchParams
});
export const updateSearchParamsSuccess = (payload:  any) : types.SearchActionTypes => ({
    type: types.UPDATE_SEARCH_PARAMS_SUCCESS,
    payload
});

export const updateSearchParamsError = (message: string) : types.SearchActionTypes => ({
    type: types.UPDATE_SEARCH_PARAMS_ERROR,
    payload: { message }
});
export const fetchSearchStudies = ( searchParams: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_STUDIES_SEND,
    searchParams
});

export const fetchSearchStudiesSuccess = (payload: SearchPageSearchQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_STUDIES_SUCCESS,
    payload
});

export const fetchSearchStudiesError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_STUDIES_ERROR,
    payload: { message }
});

export const fetchSearchAutoSuggest = ( searchParams: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_AUTOSUGGEST_SEND,
    searchParams
});

export const fetchSearchAutoSuggestSuccess = (payload: SearchPageAggsQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_AUTOSUGGEST_SUCCESS,
    payload
});

export const fetchSearchAutoSuggestError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_AUTOSUGGEST_ERROR,
    payload: { message }
});


export const fetchSavedSearches = ( userId: number) : types.SearchActionTypes => ({
    type: types.FETCH_SAVED_SEARCHES_SEND,
    userId
});

export const fetchSavedSearchesSuccess = (payload: UserSavedSearchesQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SAVED_SEARCHES_SUCCESS,
    payload
});

export const fetchSavedSearchesError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SAVED_SEARCHES_ERROR,
    payload: { message }
});

export const createSavedSearch = ( searchHash: string, url: string, userId: number) : types.SearchActionTypes => ({
    type: types.CREATE_SAVED_SEARCH_SEND,
    searchHash,
    url,
    userId
});

export const createSavedSearchSuccess = (payload: UserSavedSearchesQuery) : types.SearchActionTypes => ({
    type: types.CREATE_SAVED_SEARCH_SUCCESS,
    payload
});

export const createSavedSearchError = (message: string) : types.SearchActionTypes => ({
    type: types.CREATE_SAVED_SEARCH_ERROR,
    payload: { message }
});

export const deleteSavedSearch = ( id: number) : types.SearchActionTypes => ({
    type: types.DELETE_SAVED_SEARCH_SEND,
    id
});

export const deleteSavedSearchSuccess = (payload: UserSavedSearchesQuery) : types.SearchActionTypes => ({
    type: types.DELETE_SAVED_SEARCH_SUCCESS,
    payload
});

export const deleteSavedSearchError = (message: string) : types.SearchActionTypes => ({
    type: types.DELETE_SAVED_SEARCH_ERROR,
    payload: { message }
});

export const searchExport = (searchExportId: number) : types.SearchActionTypes => ({
    type: types.SEARCH_EXPORT_SEND,
    searchExportId,
});

export const searchExportSuccess = (payload: any) : types.SearchActionTypes => ({
    type: types.SEARCH_EXPORT_SUCCESS,
    payload
});

export const searchExportError = ( message: string) : types.SearchActionTypes => ({
    type: types.SEARCH_EXPORT_ERROR,
    payload: { message }
});

export const exportToCsv = ( searchHash: string, siteViewId: number ) : types.SearchActionTypes => ({
    type: types.EXPORT_T0_CSV_SEND,
    searchHash,
    siteViewId
})

export const exportToCsvSuccess = (payload: any) : types.SearchActionTypes => ({
    type: types.EXPORT_T0_CSV_SUCCESS,
    payload
})

export const exportToCsvError = (message: string) : types.SearchActionTypes => ({
    type: types.EXPORT_T0_CSV_ERROR,
    payload: { message }
})