import {SearchPageAggsQuery} from 'types/SearchPageAggsQuery';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';

export const FETCH_SEARCH_PAGE_AGGS_SEND = 'FETCH_SEARCH_PAGE_AGGS_SEND';
export const FETCH_SEARCH_PAGE_AGGS_SUCCESS = 'FETCH_SEARCH_PAGE_AGGS_SUCCESS';
export const FETCH_SEARCH_PAGE_AGGS_ERROR = 'FETCH_SEARCH_PAGE_AGGS_ERROR';

export const FETCH_SEARCH_STUDIES_SEND = 'FETCH_SEARCH_STUDIES_SEND';
export const FETCH_SEARCH_STUDIES_SUCCESS = 'FETCH_SEARCH_STUDIES_SUCCESS';
export const FETCH_SEARCH_STUDIES_ERROR = 'FETCH_SEARCH_STUDIES_ERROR';

export interface SearchState {
    isFetchingAggs: boolean,
    aggs: SearchPageAggsQuery | undefined,
    isSearching: boolean,
    searchResults: typeof SearchPageParamsQuery | undefined
}

export interface SearchDataError {
    message: string
};

export interface FetchSearchPageAggsSendAction {
    type: typeof FETCH_SEARCH_PAGE_AGGS_SEND
    searchParams: any
};

export interface FetchSearchPageAggsSuccessAction {
    type: typeof FETCH_SEARCH_PAGE_AGGS_SUCCESS,
    payload: SearchPageAggsQuery
};

export interface FetchSearchPageAggsErrorAction {
    type: typeof FETCH_SEARCH_PAGE_AGGS_ERROR,
    payload: SearchDataError
};

export interface FetchSearchStudiesSendAction {
    type: typeof FETCH_SEARCH_STUDIES_SEND
    hash: any
};

export interface FetchSearchStudiesSuccessAction {
    type: typeof FETCH_SEARCH_STUDIES_SUCCESS,
    payload: typeof SearchPageParamsQuery
};

export interface FetchSearchStudiesErrorAction {
    type: typeof FETCH_SEARCH_STUDIES_ERROR,
    payload: SearchDataError
};

export type SearchActionTypes = FetchSearchPageAggsSendAction | FetchSearchPageAggsSuccessAction | FetchSearchPageAggsErrorAction |
    FetchSearchStudiesSendAction | FetchSearchStudiesSuccessAction | FetchSearchStudiesErrorAction;
