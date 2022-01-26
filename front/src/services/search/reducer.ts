import * as types from './types';

// import { exportToCsv, searchExport } from './api';

import { IslandConfigQuery } from './model/IslandConfigQuery';
import { filter } from 'ramda';

const initialState: types.SearchState = {
    isFetchingAggs: false,
    aggs: undefined,
    isFetchingAggBuckets: false,
    aggBuckets: undefined,
    isFetchingCrowdAggBuckets: false,
    crowdAggBuckets: undefined,
    isFetchingSearchParams: false,
    searchResults: undefined,
    isFetchingStudies: false,
    studies: undefined,
    isUpdatingParams: false,
    searchHash: undefined,
    isFetchingAutoSuggest: false,
    suggestions: [],
    isFetchingSavedSearches: false,
    savedDocs: undefined,
    isFetchingSavedDocs: false,
    isCreatingSavedDocument: false,
    isDeletingSavedDocument: false,
    savedSearches: undefined,
    isCreatingSavedSearch: false,
    isDeletingSavedSearch: false,
    isFetchingFacetConfig: false,
    islandConfig: undefined,
    isUpdatingFacetConfig: false,
    isFetchingSearchExport: false,
    searchExport: undefined,
    isExportingToCsv: false,
    expanders: undefined,
    aggBucketFilter: undefined,
};

const searchReducer = (
    state = initialState,
    action: types.SearchActionTypes
): types.SearchState => {
    switch (action.type) {
        case types.FETCH_SEARCH_PAGE_AGGS_SEND:
            return {
                ...state,
                isFetchingAggs: true,
            };
        case types.FETCH_SEARCH_PAGE_AGGS_SUCCESS:
            return {
                ...state,
                isFetchingAggs: false,
                aggs: action.payload,
            };
        case types.FETCH_SEARCH_PAGE_AGGS_ERROR:
            return {
                ...state,
                isFetchingAggs: false,
            };

        case types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND:
            return {
                ...state,
                // isFetchingAggBuckets: true,
            };
        case types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SUCCESS:
            return {
                ...state,
                // isFetchingAggBuckets: false,
                aggBuckets: {
                    ...state.aggBuckets,
                    aggs: {
                        ...state.aggBuckets?.aggs,
                        [action.payload.aggId]: action.payload.buckets,
                    },
                },
                aggBucketFilter: {
                    ...state.aggBucketFilter,
                    isFetchingCurrentAggBucket: false,
                },
            };
        case types.FETCH_SEARCH_PAGE_AGG_BUCKETS_ERROR:
            return {
                ...state,
                // isFetchingAggBuckets: false,
                aggBucketFilter: {
                    ...state.aggBucketFilter,
                    isFetchingCurrentAggBucket: false,
                },
            };

        case types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND:
            return {
                ...state,
                isFetchingCrowdAggBuckets: true,
            };
        case types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SUCCESS:
            let backendName = action.payload.name;
            let frontName = backendName.substring(3);
            return {
                ...state,
                isFetchingCrowdAggBuckets: false,
                crowdAggBuckets: {
                    ...state.crowdAggBuckets,
                    aggs: {
                        ...state.crowdAggBuckets?.aggs,
                        [frontName]: action.payload.buckets,
                    },
                },
            };
        case types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_ERROR:
            return {
                ...state,
                isFetchingCrowdAggBuckets: false,
            };
        case types.FETCH_SEARCH_PAGE_OPEN_AGG_BUCKETS_SEND:
            return {
                ...state,
                isFetchingCrowdAggBuckets: true,
            };
        case types.FETCH_SEARCH_PAGE_OPEN_AGG_BUCKETS_SUCCESS:
            console.log('Payload', action.payload);
            let aggObject = {};
            let crowdAggObject = {};

            action.payload.data.openAggBuckets.aggs.map((agg, index) => {
                // console.log(agg[0])
                if (agg.name.substring(0, 3) == 'fm_') {
                    let crowdAggFromIdArray = filter(
                        x => `fm_${x.name}` == agg.name,
                        action.payload.crowdAggIdArray
                    );
                    console.log(agg.name);
                    console.log('PLZ AL HELP ME', crowdAggFromIdArray);
                    crowdAggObject[crowdAggFromIdArray[0].id] = agg.buckets;
                } else {
                    let aggFromIdArray = filter(
                        x => x.name == agg.name,
                        action.payload.aggIdArray
                    );
                    console.log('PLZ AL HELP ME', aggFromIdArray);
                    aggObject[aggFromIdArray[0].id] = agg.buckets;
                }
            });
            return {
                ...state,
                isFetchingCrowdAggBuckets: false,
                aggBuckets: {
                    ...state.aggBuckets,
                    aggs: {
                        ...state.aggBuckets?.aggs,
                        ...aggObject,
                        // ...crowdAggObject
                    },
                },
                crowdAggBuckets: {
                    ...state.crowdAggBuckets,
                    aggs: {
                        ...state.crowdAggBuckets?.aggs,
                        ...crowdAggObject,
                    },
                },
            };
        case types.FETCH_SEARCH_PAGE_OPEN_AGG_BUCKETS_ERROR:
            return {
                ...state,
                isFetchingCrowdAggBuckets: false,
            };
        case types.FETCH_SEARCH_PAGE_OPEN_CROWD_AGG_BUCKETS_SEND:
            return {
                ...state,
                isFetchingCrowdAggBuckets: true,
            };
        case types.FETCH_SEARCH_PAGE_OPEN_CROWD_AGG_BUCKETS_ERROR:
            return {
                ...state,
                isFetchingCrowdAggBuckets: false,
            };
        case types.FETCH_SEARCH_PARAMS_SEND:
            return {
                ...state,
                isFetchingSearchParams: true,
            };
        case types.FETCH_SEARCH_PARAMS_SUCCESS:
            return {
                ...state,
                isFetchingSearchParams: false,
                searchResults: action.payload,
            };
        case types.FETCH_SEARCH_PARAMS_ERROR:
            return {
                ...state,
                isFetchingSearchParams: false,
            };
        case types.UPDATE_SEARCH_PARAMS_SEND:
            return {
                ...state,
                isUpdatingParams: true,
            };
        case types.UPDATE_SEARCH_PARAMS_SUCCESS:
            return {
                ...state,
                isUpdatingParams: false,
                searchHash: action.payload,
            };
        case types.UPDATE_SEARCH_PARAMS_ERROR:
            return {
                ...state,
                isUpdatingParams: false,
            };
        case types.FETCH_SEARCH_STUDIES_SEND:
            return {
                ...state,
                isFetchingStudies: true,
            };
        case types.FETCH_SEARCH_STUDIES_SUCCESS:
            return {
                ...state,
                isFetchingStudies: false,
                studies: action.payload,
            };
        case types.FETCH_SEARCH_STUDIES_ERROR:
            return {
                ...state,
                isFetchingStudies: false,
            };

        case types.FETCH_SEARCH_AUTOSUGGEST_SEND:
            return {
                ...state,
                isFetchingAutoSuggest: true,
            };
        case types.FETCH_SEARCH_AUTOSUGGEST_SUCCESS:
            return {
                ...state,
                isFetchingAutoSuggest: false,
                suggestions: action.payload,
            };
        case types.FETCH_SEARCH_AUTOSUGGEST_ERROR:
            return {
                ...state,
                isFetchingAutoSuggest: false,
            };

        case types.FETCH_SAVED_DOCS_SEND:
            return {
                ...state,
                isFetchingSavedDocs: true,
            };
        case types.FETCH_SAVED_DOCS_SUCCESS:
            return {
                ...state,
                isFetchingSavedDocs: false,
                savedDocs: action.payload,
            };
        case types.FETCH_SAVED_DOCS_ERROR:
            return {
                ...state,
                isFetchingSavedDocs: false,
            };

        case types.CREATE_SAVED_DOCUMENT_SEND:
            return {
                ...state,
                isCreatingSavedDocument: true,
            };
        case types.CREATE_SAVED_DOCUMENT_SUCCESS:
            return {
                ...state,
                isCreatingSavedDocument: false,
                savedDocs: action.payload,
            };
        case types.CREATE_SAVED_DOCUMENT_ERROR:
            return {
                ...state,
                isCreatingSavedDocument: false,
            };

        case types.DELETE_SAVED_DOC_SEND:
            return {
                ...state,
                isDeletingSavedSearch: true,
            };
        case types.DELETE_SAVED_DOC_SUCCESS:
            return {
                ...state,
                isDeletingSavedSearch: false,
                savedDocs: {
                    ...state.savedDocs,
                    data: {
                        ...state.savedDocs.data,
                        saved_documents: action.payload,
                    },
                },
            };
        case types.DELETE_SAVED_SEARCH_ERROR:
            return {
                ...state,
                isDeletingSavedSearch: false,
            };

        case types.FETCH_SAVED_SEARCHES_SEND:
            return {
                ...state,
                isFetchingSavedSearches: true,
            };
        case types.FETCH_SAVED_SEARCHES_SUCCESS:
            return {
                ...state,
                isFetchingSavedSearches: false,
                savedSearches: action.payload,
            };
        case types.FETCH_SAVED_SEARCHES_ERROR:
            return {
                ...state,
                isFetchingSavedSearches: false,
            };

        case types.CREATE_SAVED_SEARCH_SEND:
            return {
                ...state,
                isCreatingSavedSearch: true,
            };
        case types.CREATE_SAVED_SEARCH_SUCCESS:
            return {
                ...state,
                isCreatingSavedSearch: false,
                savedSearches: action.payload,
            };
        case types.CREATE_SAVED_SEARCH_ERROR:
            return {
                ...state,
                isCreatingSavedSearch: false,
            };

        case types.DELETE_SAVED_SEARCH_SEND:
            return {
                ...state,
                isDeletingSavedSearch: true,
            };
        case types.DELETE_SAVED_SEARCH_SUCCESS:
            return {
                ...state,
                isDeletingSavedSearch: false,
                savedSearches: {
                    ...state.savedSearches,
                    data: {
                        ...state.savedSearches.data,
                        saved_searches: action.payload,
                    },
                },
            };
        case types.DELETE_SAVED_SEARCH_ERROR:
            return {
                ...state,
                isDeletingSavedSearch: false,
            };
        case types.FETCH_ISLAND_CONFIG_SEND:
            return {
                ...state,
                isFetchingFacetConfig: true,
            };
        case types.FETCH_ISLAND_CONFIG_SUCCESS:
            let response = action.payload.data.island_configs;
            let newObject = {} as IslandConfigQuery;
            response.map(island => {
                newObject[island.id] = JSON.parse(island.config);
            });
            return {
                ...state,
                isFetchingFacetConfig: false,
                islandConfig: newObject,
            };
        case types.FETCH_ISLAND_CONFIG_ERROR:
            return {
                ...state,
                isFetchingFacetConfig: false,
            };

        case types.CONVERT_DISPLAY_NAME:
            let currentIslandConfigs =
                state.islandConfig || ({} as IslandConfigQuery);
            let oldConfig = currentIslandConfigs[action.islandId];

            let newConfig = {
                ...oldConfig,
                displayName: action.displayName,
            };
            return {
                ...state,
                //@ts-ignore
                islandConfig: {
                    ...state.islandConfig,
                    [action.islandId]: newConfig,
                },
            };
        case types.SEARCH_EXPORT_SEND:
            return {
                ...state,
                isFetchingSearchExport: true,
            };
        case types.SEARCH_EXPORT_SUCCESS:
            return {
                ...state,
                isFetchingSearchExport: false,
                searchExport: action.payload.data.searchExport,
            };
        case types.SEARCH_EXPORT_ERROR:
            return {
                ...state,
                isFetchingSearchExport: false,
            };

        case types.EXPORT_T0_CSV_SEND:
            return {
                ...state,
                isExportingToCsv: true,
            };
        case types.EXPORT_T0_CSV_SUCCESS:
            return {
                ...state,
                isExportingToCsv: false,
                searchExport: action.payload.data.exportToCsv.searchExport, //! TODO CHeck the redux store structure for searchExport/exportToCsv
            };
        case types.EXPORT_T0_CSV_ERROR:
            return {
                ...state,
                isExportingToCsv: false,
            };
        case types.BUCKET_FILTER:
            let obj = {
                ...state.aggBucketFilter,
                isFetchingCurrentAggBucket: true,
            };
            let tempIslandConfig =
                state.islandConfig || ({} as IslandConfigQuery);

            obj[action.id] = action.bucketsState;
            tempIslandConfig[action.id].order = {
                sortKind: action.bucketsState.sortKind == 0 ? 'key' : 'count',
                desc: action.bucketsState.desc,
            };

            return {
                ...state,
                aggBucketFilter: obj,
                islandConfig: tempIslandConfig,
                // isFetchingAggBuckets: true,
            };
        case types.TOGGLE_AGG:
            let newIslandConfig =
                state.islandConfig || ({} as IslandConfigQuery);
            newIslandConfig[action.id] = { ...action.input };
            newIslandConfig[action.id] = {
                ...newIslandConfig[action.id],
                defaultToOpen: !newIslandConfig[action.id].defaultToOpen,
            };
            return {
                ...state,
                islandConfig: newIslandConfig,
            };
        case types.TOGGLE_EXPANDER:
            let newExpanderObj = state.expanders || {};
            if (!state.expanders) {
                newExpanderObj[action.id] = {
                    id: action.id,
                    collapsed: action.collapsed,
                };
                return {
                    ...state,
                    expanders: newExpanderObj,
                };
            }
            if (state.expanders[action.id]) {
                newExpanderObj[action.id] = {
                    id: action.id,
                    collapsed: action.collapsed,
                };
                return {
                    ...state,
                    expanders: newExpanderObj,
                };
            }
        default:
            return { ...state };
    }
};

export default searchReducer;
