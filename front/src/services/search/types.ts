import { UserSavedSearchesQuery } from 'services/search/model/UserSavedSearchesQuery';
import {SearchPageAggsQuery} from './model/SearchPageAggsQuery';
import {SearchPageSearchQuery} from '../../services/search/model/SearchPageSearchQuery'
import {SearchPageParamsQuery} from  '../../services/search/model/SearchPageParamsQuery'
import { SearchPageAggBucketsQuery } from 'types/SearchPageAggBucketsQuery';
import { SearchPageCrowdAggBucketsQuery } from 'types/SearchPageCrowdAggBucketsQuery';
import { FacetConfigQuery } from './model/FacetConfigQuery';
import { UpdateFacetConfigInput } from './model/UpdateFacetConfigInput'


export const FETCH_SEARCH_PAGE_AGGS_SEND = 'FETCH_SEARCH_PAGE_AGGS_SEND';
export const FETCH_SEARCH_PAGE_AGGS_SUCCESS = 'FETCH_SEARCH_PAGE_AGGS_SUCCESS';
export const FETCH_SEARCH_PAGE_AGGS_ERROR = 'FETCH_SEARCH_PAGE_AGGS_ERROR';

export const FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND = 'FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND';
export const FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS = 'FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS';
export const FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR = 'FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR';

export const FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND = 'FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND';
export const FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS = 'FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS';
export const FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR = 'FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR';

export const FETCH_SEARCH_PARAMS_SEND = 'FETCH_SEARCH_PARAMS_SEND';
export const FETCH_SEARCH_PARAMS_SUCCESS = 'FETCH_SEARCH_PARAMS_SUCCESS';
export const FETCH_SEARCH_PARAMS_ERROR = 'FETCH_SEARCH_PARAMS_ERROR';

export const UPDATE_SEARCH_PARAMS_SEND = 'UPDATE_SEARCH_PARAMS_SEND';
export const UPDATE_SEARCH_PARAMS_SUCCESS = 'UPDATE_SEARCH_PARAMS_SUCCESS';
export const UPDATE_SEARCH_PARAMS_ERROR = 'UPDATE_SEARCH_PARAMS_ERROR';

export const FETCH_SEARCH_STUDIES_SEND = 'FETCH_SEARCH_STUDIES_SEND';
export const FETCH_SEARCH_STUDIES_SUCCESS = 'FETCH_SEARCH_STUDIES_SUCCESS';
export const FETCH_SEARCH_STUDIES_ERROR = 'FETCH_SEARCH_STUDIES_ERROR';

export const FETCH_SEARCH_AUTOSUGGEST_SEND = 'FETCH_SEARCH_AUTOSUGGEST_SEND';
export const FETCH_SEARCH_AUTOSUGGEST_SUCCESS = 'FETCH_SEARCH_AUTOSUGGEST_SUCCESS';
export const FETCH_SEARCH_AUTOSUGGEST_ERROR = 'FETCH_SEARCH_AUTOSUGGEST_ERROR';

export const FETCH_SAVED_SEARCHES_SEND = 'FETCH_SAVED_SEARCHES_SEND';
export const FETCH_SAVED_SEARCHES_SUCCESS = 'FETCH_SAVED_SEARCHES_SUCCESS';
export const FETCH_SAVED_SEARCHES_ERROR = 'FETCH_SAVED_SEARCHES_ERROR';

export const CREATE_SAVED_SEARCH_SEND = 'CREATE_SAVED_SEARCH_SEND';
export const CREATE_SAVED_SEARCH_SUCCESS = 'CREATE_SAVED_SEARCH_SUCCESS';
export const CREATE_SAVED_SEARCH_ERROR = 'CREATE_SAVED_SEARCH_ERROR';

export const DELETE_SAVED_SEARCH_SEND = 'DELETE_SAVED_SEARCH_SEND';
export const DELETE_SAVED_SEARCH_SUCCESS = 'DELETE_SAVED_SEARCH_SUCCESS';
export const DELETE_SAVED_SEARCH_ERROR = 'DELETE_SAVED_SEARCH_ERROR';

export const FETCH_FACET_CONFIG_SEND = 'FETCH_FACET_CONFIG_SEND';
export const FETCH_FACET_CONFIG_SUCCESS = 'FETCH_FACET_CONFIG_SUCCESS';
export const FETCH_FACET_CONFIG_ERROR = 'FETCH_FACET_CONFIG_ERROR';

export const UPDATE_FACET_CONFIG_SEND = 'UPDATE_FACET_CONFIG_SEND';
export const UPDATE_FACET_CONFIG_SUCCESS = 'UPDATE_FACET_CONFIG_SUCCESS';
export const UPDATE_FACET_CONFIG_ERROR = 'UPDATE_FACET_CONFIG_ERROR';
export const SEARCH_EXPORT_SEND = 'SEARCH_EXPORT_SEND';
export const SEARCH_EXPORT_SUCCESS = 'SEARCH_EXPORT_SUCCESS';
export const SEARCH_EXPORT_ERROR = 'SEARCH_EXPORT_ERROR';

export const EXPORT_T0_CSV_SEND = 'EXPORT_TO_CSV_SEND';
export const EXPORT_T0_CSV_SUCCESS = 'EXPORT_TO_CSV_SUCCESS';
export const EXPORT_T0_CSV_ERROR = 'EXPORT_TO_CSV_ERROR';

export interface SearchState {
    isFetchingAggs: boolean,
    aggs: SearchPageAggsQuery | undefined,
    isFetchingAggBuckets: boolean,
    aggBuckets: any | SearchPageAggBucketsQuery | undefined,
    isFetchingCrowdAggBuckets: boolean,
    crowdAggBuckets: any | SearchPageCrowdAggBucketsQuery | undefined,
    isFetchingSearchParams: boolean,
    searchResults: SearchPageParamsQuery | undefined
    isFetchingStudies: boolean,
    studies: SearchPageSearchQuery | undefined
    isUpdatingParams: boolean,
    searchHash: any;
    isFetchingAutoSuggest: boolean,
    suggestions: Array<any>
    isFetchingSavedSearches: boolean,
    savedSearches: any | UserSavedSearchesQuery | undefined,
    isCreatingSavedSearch: boolean,
    isDeletingSavedSearch: boolean,
    isFetchingFacetConfig: boolean,
    facetConfig: FacetConfigQuery | undefined 
    isUpdatingFacetConfig: boolean,
    isFetchingSearchExport: boolean,
    searchExport: any;
    isExportingToCsv: boolean,

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

export interface FetchSearchPageAggBucketsSendAction {
    type: typeof FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND
    searchParams: any                                  
};

export interface FetchSearchPageAggBucketsSuccessAction {
    type: typeof FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS,
    payload: SearchPageAggBucketsQuery | any
};

export interface FetchSearchPageAggBucketsErrorAction {
    type: typeof FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR,
    payload: SearchDataError
};


export interface FetchSearchPageCrowdAggBucketsSendAction {
    type: typeof FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND
    searchParams: any                                         
};

export interface FetchSearchPageCrowdAggBucketsSuccessAction {
    type: typeof FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS,
    payload: SearchPageCrowdAggBucketsQuery | any
};

export interface FetchSearchPageCrowdAggBucketsErrorAction {
    type: typeof FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR,
    payload: SearchDataError
};


export interface FetchSearchParamsSendAction {
    type: typeof FETCH_SEARCH_PARAMS_SEND
    hash: any
};

export interface FetchSearchParamsSuccessAction {
    type: typeof FETCH_SEARCH_PARAMS_SUCCESS,
    payload:  SearchPageParamsQuery
};

export interface FetchSearchParamsErrorAction {
    type: typeof FETCH_SEARCH_PARAMS_ERROR,
    payload: SearchDataError
};
export interface UpdateSearchParamsSendAction {
    type: typeof UPDATE_SEARCH_PARAMS_SEND
    searchParams: any
};

export interface UpdateSearchParamsSuccessAction {
    type: typeof UPDATE_SEARCH_PARAMS_SUCCESS,
    payload:  SearchPageParamsQuery
};

export interface UpdateSearchParamsErrorAction {
    type: typeof UPDATE_SEARCH_PARAMS_ERROR,
    payload: SearchDataError
};

export interface FetchSearchStudiesSendAction {
    type: typeof FETCH_SEARCH_STUDIES_SEND
    searchParams: any
};

export interface FetchSearchStudiesSuccessAction {
    type: typeof FETCH_SEARCH_STUDIES_SUCCESS,
    payload: SearchPageSearchQuery
};

export interface FetchSearchStudiesErrorAction {
    type: typeof FETCH_SEARCH_STUDIES_ERROR,
    payload: SearchDataError
};

export interface FetchSearchAutoSuggestSendAction {
    type: typeof FETCH_SEARCH_AUTOSUGGEST_SEND
    searchParams: any
};

export interface FetchSearchAutoSuggestSuccessAction {
    type: typeof FETCH_SEARCH_AUTOSUGGEST_SUCCESS,
    payload: any
};

export interface FetchSearchAutoSuggestErrorAction {
    type: typeof FETCH_SEARCH_AUTOSUGGEST_ERROR,
    payload: SearchDataError
};

export interface FetchSavedSearchesSendAction {
    type: typeof FETCH_SAVED_SEARCHES_SEND
    userId: number
};

export interface FetchSavedSearchesSuccessAction {
    type: typeof FETCH_SAVED_SEARCHES_SUCCESS,
    payload:  UserSavedSearchesQuery
};

export interface FetchSavedSearchesErrorAction {
    type: typeof FETCH_SAVED_SEARCHES_ERROR,
    payload: SearchDataError
};

export interface CreateSavedSearchSendAction {
    type: typeof CREATE_SAVED_SEARCH_SEND
    searchHash: string,
    url: string,
    userId: number,
};

export interface CreateSavedSearchSuccessAction {
    type: typeof CREATE_SAVED_SEARCH_SUCCESS,
    payload: UserSavedSearchesQuery
};

export interface CreateSavedSearchErrorAction {
    type: typeof CREATE_SAVED_SEARCH_ERROR,
    payload: SearchDataError
};

export interface DeleteSavedSearchSendAction {
    type: typeof DELETE_SAVED_SEARCH_SEND
    id: number
};

export interface DeleteSavedSearchSuccessAction {
    type: typeof DELETE_SAVED_SEARCH_SUCCESS,
    payload:  UserSavedSearchesQuery
};

export interface DeleteSavedSearchErrorAction {
    type: typeof DELETE_SAVED_SEARCH_ERROR,
    payload: SearchDataError
};
export interface FetchFacetConfigSendAction {
    type: typeof FETCH_FACET_CONFIG_SEND
}
export interface FetchFacetConfigSuccessAction {
    type: typeof FETCH_FACET_CONFIG_SUCCESS,
    payload: any
};
export interface FetchFacetConfigErrorAction {
    type: typeof FETCH_FACET_CONFIG_ERROR,
    payload: SearchDataError
};

export interface UpdateFacetConfigSendAction {
    type: typeof UPDATE_FACET_CONFIG_SEND,
    input: UpdateFacetConfigInput,
}

export interface UpdateFacetConfigSuccessAction {
    type: typeof UPDATE_FACET_CONFIG_SUCCESS,
    payload: FacetConfigQuery
    };

export interface UpdateFacetConfigErrorAction {
    type: typeof UPDATE_FACET_CONFIG_ERROR,
    payload: SearchDataError
};
export interface SearchExportSendAction {
    type: typeof SEARCH_EXPORT_SEND,
    searchExportId: number
}
export interface SearchExportSuccessAction {
    type: typeof SEARCH_EXPORT_SUCCESS,
    payload: any;
}
export interface SearchExportErrorAction {
    type: typeof SEARCH_EXPORT_ERROR,
    payload: SearchDataError
}
export interface ExportToCsvSendAction {
    type: typeof EXPORT_T0_CSV_SEND,
    searchHash: string,
    siteViewId: number
}
export interface ExportToCsvSuccessAction {
    type: typeof EXPORT_T0_CSV_SUCCESS,
    payload: any;
}
export interface ExportToCsvErrorAction {
    type: typeof EXPORT_T0_CSV_ERROR,
    payload: SearchDataError
}

export type SearchActionTypes = 
    FetchSearchPageAggsSendAction | FetchSearchPageAggsSuccessAction | FetchSearchPageAggsErrorAction |
    FetchSearchPageAggBucketsSendAction | FetchSearchPageAggBucketsSuccessAction | FetchSearchPageAggBucketsErrorAction |
    FetchSearchPageCrowdAggBucketsSendAction | FetchSearchPageCrowdAggBucketsSuccessAction | FetchSearchPageCrowdAggBucketsErrorAction |
    FetchSearchParamsSendAction | FetchSearchParamsSuccessAction | FetchSearchParamsErrorAction |
    UpdateSearchParamsSendAction | UpdateSearchParamsSuccessAction | UpdateSearchParamsErrorAction |
    FetchSearchStudiesSendAction | FetchSearchStudiesSuccessAction | FetchSearchStudiesErrorAction |
    FetchSearchAutoSuggestSendAction | FetchSearchAutoSuggestSuccessAction | FetchSearchAutoSuggestErrorAction |
    FetchSavedSearchesSendAction | FetchSavedSearchesSuccessAction | FetchSavedSearchesErrorAction |
    CreateSavedSearchSendAction | CreateSavedSearchSuccessAction | CreateSavedSearchErrorAction |
    DeleteSavedSearchSendAction | DeleteSavedSearchSuccessAction | DeleteSavedSearchErrorAction |
    FetchFacetConfigSendAction | FetchFacetConfigSuccessAction | FetchFacetConfigErrorAction |
    UpdateFacetConfigSendAction | UpdateFacetConfigSuccessAction | UpdateFacetConfigErrorAction |
    SearchExportSendAction  | SearchExportSuccessAction | SearchExportErrorAction |
    ExportToCsvSendAction | ExportToCsvSuccessAction |  ExportToCsvErrorAction  
;
