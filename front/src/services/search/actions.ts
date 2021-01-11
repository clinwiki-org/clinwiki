import * as types from './types';
import {SearchPageAggsQuery} from 'types/SearchPageAggsQuery';
import {SearchPageSearchQuery} from 'types/SearchPageSearchQuery';
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
