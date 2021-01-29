import * as types from './types';
import {SearchPageAggsQuery} from './model/SearchPageAggsQuery';
import {SearchPageSearchQuery} from './model/SearchPageSearchQuery';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import { SearchPageAggBucketsQuery } from 'types/SearchPageAggBucketsQuery';
import { SearchPageCrowdAggBucketsQuery } from 'types/SearchPageCrowdAggBucketsQuery';

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
    searchParams          //TODO CHeck
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
    searchParams      //TODO CHeck
});

export const fetchSearchPageCrowdAggBucketsSuccess = (payload: SearchPageCrowdAggBucketsQuery) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS,
    payload
});

export const fetchSearchPageCrowdAggBucketsError = (message: string) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR,
    payload: { message }
});


export const fetchSearchParams = ( hash: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_PARAMS_SEND,
    hash
});

export const fetchSearchParamsSuccess = (payload: typeof SearchPageParamsQuery) : types.SearchActionTypes => ({
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
export const updateSearchParamsSuccess = (payload: typeof SearchPageParamsQuery) : types.SearchActionTypes => ({
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

