import * as types from './types';
import {SearchPageAggsQuery} from 'types/SearchPageAggsQuery';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';

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


export const fetchSearchStudies = ( hash: any) : types.SearchActionTypes => ({
    type: types.FETCH_SEARCH_STUDIES_SEND,
    hash
});

export const fetchSearchStudiesSuccess = (payload: typeof SearchPageParamsQuery) : types.SearchActionTypes => ({
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

