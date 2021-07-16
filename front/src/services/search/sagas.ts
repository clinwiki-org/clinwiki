import * as actions from './actions';
import * as api from './api';
import * as types from './types';

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { camelCase, sentanceCase } from 'utils/helpers';

import { push } from 'connected-react-router';

const getCurrentSavedSearches = state =>
    state.search.savedSearches.data.saved_searches;
const getCurrentSearcheParams = state =>
    state.search.searchResults.data.searchParams;
const getCurrentIslands = state => state.search.islandConfig;

function* getSearchPageAggs(action) {
    try {
        let response = yield call(() =>
            api.fetchSearchPageAggs(action.searchParams)
        );
        if (response) {
            yield put(actions.fetchSearchPageAggsSuccess(response));
        } else {
            yield put(actions.fetchSearchPageAggsError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchPageAggsError(err.message));
    }
}

function* getSearchPageAggBuckets(action) {
    //    console.log("SAGA SP Agg Buckets", action);
    try {
        let response = yield call(() =>
            api.fetchSearchPageAggBuckets(action.searchParams)
        );
        if (response) {
            let nameBuckets = response.data.aggBuckets.aggs.filter(
                agg => agg.name === action.searchParams.agg
            )[0];
            yield put(actions.fetchSearchPageAggBucketsSuccess(nameBuckets));
        } else {
            yield put(actions.fetchSearchPageAggBucketsError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchPageAggBucketsError(err.message));
    }
}

function* getSearchPageCrowdAggBuckets(action) {
    try {
        let response = yield call(() =>
            api.fetchSearchPageCrowdAggBuckets(action.searchParams)
        );
        if (response) {
            let nameBuckets = response.data.aggBuckets.aggs?.[0];
            yield put(
                actions.fetchSearchPageCrowdAggBucketsSuccess(nameBuckets)
            );
        } else {
            yield put(
                actions.fetchSearchPageCrowdAggBucketsError(response.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchPageCrowdAggBucketsError(err.message));
    }
}
function* getSearchPageOpenCrowdAggBuckets(action) {
    try {
        let response = yield call(() =>
            api.fetchSearchPageOpenCrowdAggBuckets(action.searchParams)
        );
        if (response) {
            yield put(
                actions.fetchSearchPageOpenCrowdAggBucketsSuccess({
                    ...response,
                    crowdAggIdArray: action.crowdAggIdArray,
                })
            );
        } else {
            yield put(
                actions.fetchSearchPageOpenCrowdAggBucketsError(
                    response.message
                )
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchPageOpenCrowdAggBucketsError(err.message));
    }
}
function* getSearchPageOpenAggBuckets(action) {
    try {
        let response = yield call(() =>
            api.fetchSearchPageOpenAggBuckets(action.searchParams)
        );
        if (response) {
            yield put(
                actions.fetchSearchPageOpenAggBucketsSuccess({
                    ...response,
                    aggIdArray: action.aggIdArray,
                })
            );
        } else {
            yield put(
                actions.fetchSearchPageOpenAggBucketsError(response.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchPageOpenAggBucketsError(err.message));
    }
}

function* getSearchParams(action) {
    try {
        let response = yield call(() => api.fetchSearchParams(action.hash));
        if (response) {
            let parsedParams = JSON.parse(
                response.data.searchParams.searchParams
            );
            let camelCasedParams = {};
            for (const [key, value] of Object.entries(parsedParams)) {
                // console.log(`${key}: ${value}`);
                camelCasedParams[camelCase(key)] = value;
            }

            response.data.searchParams.searchParams = camelCasedParams;
            yield put(actions.fetchSearchParamsSuccess(response));
            yield put(actions.updateSearchParamsSuccess(action.hash));
            //need this to run to populate our recordsTotal for time being was quick and easy way but probs not ideal
            // yield put(actions.fetchSearchPageAggs({...response.data.searchParams,
            //     q : JSON.parse(response.data.searchParams.q)
            // }))
        } else {
            yield put(actions.fetchSearchParamsError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchParamsError(err.message));
    }
}
function* getSearchStudies(action) {
    try {
        let response = yield call(() =>
            api.fetchSearchStudies(action.searchParams)
        );
        if (response) {
            yield put(actions.fetchSearchStudiesSuccess(response));
        } else {
            yield put(actions.fetchSearchStudiesError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchStudiesError(err.message));
    }
}

function* updateSearchParams(action) {
    try {
        let updateResponse = yield call(() => api.updateSearchParams(action));
        let location = yield select(state => state.router.location);
        let searchHash = updateResponse.data.provisionSearchHash.searchHash;
        if (updateResponse.data.provisionSearchHash.searchHash !== null) {
            // yield put(actions.fetchSearchParams(searchHash.short))
            // yield put(actions.fetchSearchPageAggs(action.searchParams))
            yield put(actions.updateSearchParamsSuccess(searchHash));
            console.log(location);
            switch (location.pathname) {
                case '/profile':
                    yield put(
                        push(
                            `/profile?hash=${searchHash.short}&sv=${
                                location.query.sv || ''
                            }&pv=${location.query.pv || ''}`
                        )
                    );
                    return;
                case '/search':
                    yield put(
                        push(
                            `/search?hash=${searchHash.short}&sv=${
                                location.query.sv || ''
                            }&pv=${location.query.pv || ''}`
                        )
                    );
                    return;
                case '/search2':
                    yield put(
                        push(
                            `/search2?hash=${searchHash.short}&sv=${
                                location.query.sv || ''
                            }&pv=${location.query.pv || ''}`
                        )
                    );
                    return;
                case '/mmtest':
                    yield put(
                        push(
                            `/mmtest?hash=${searchHash.short}&sv=${
                                location.query.sv || ''
                            }&pv=${location.query.pv || ''}`
                        )
                    );
            }
            // TODO need to pull default page view possibly defaulting to blank string which should default to configured default pageview
        }
        // if (updateResponse.data.provisionSearchHash.searchHash !== null && location.pathname =='/search' ){
        //     yield put(actions.fetchSearchParams(searchHash.short))
        //     yield put(actions.fetchSearchPageAggs(action.searchParams))
        //     yield put(actions.updateSearchParamsSuccess(searchHash));
        //             yield put(push(`/search?hash=${searchHash.short}&sv=${location.query.sv || ""}&pv=${location.query.pv|| ""}`))
        //     //console.log(location)
        // }
        else {
            yield put(actions.updateSearchParamsError(updateResponse.message));
        }
    } catch (err) {
        yield put(actions.updateSearchParamsError(err.message));
    }
}

function* getSearchAutoSuggest(action) {
    try {
        let response = yield call(() =>
            api.fetchSearchAutoSuggest(action.searchParams)
        );
        if (response) {
            yield put(actions.fetchSearchAutoSuggestSuccess(response));
        } else {
            yield put(actions.fetchSearchAutoSuggestError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchAutoSuggestError(err.message));
    }
}

function* getSavedSearches(action) {
    //console.log("SAGA get Saved Searches", action)
    try {
        let response = yield call(() => api.fetchSavedSearches(action.userId));
        if (response) {
            yield put(actions.fetchSavedSearchesSuccess(response));
            return response;
        } else {
            yield put(actions.fetchSavedSearchesError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSavedSearchesError(err.message));
    }
}

function* createSavedSearch(action) {
    try {
        let findShortLink = yield call(() =>
            api.findShortLinkId(action.searchHash)
        );
        let shortLinkId = findShortLink.data.short_links[0].id;
        let createResponse = yield call(() =>
            api.createSavedSearch(
                action.searchHash,
                action.url,
                action.userId,
                action.nameLabel,
                shortLinkId
            )
        );
        if (createResponse.data.insert_saved_searches_one) {
            let response = yield getSavedSearches(action);
            yield put(actions.createSavedSearchSuccess(response));
        } else {
            yield put(actions.createSavedSearchError(createResponse.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.createSavedSearchError(err.message));
    }
}

function* deleteSavedSearch(action) {
    // console.log("SAGA Delete Saved Search", action)
    const currentSavedSearches = yield select(getCurrentSavedSearches);
    try {
        let response = yield call(() => api.deleteSavedSearch(action.id));
        const { id } = response.data.delete_saved_searches_by_pk;
        if (id === action.id) {
            let newSavedSearches = currentSavedSearches.filter(
                s => s.id !== id
            );
            //console.log('🚀 ~  ~ newSavedSearches', newSavedSearches);
            yield put(actions.deleteSavedSearchSuccess(newSavedSearches));
        } else {
            yield put(actions.deleteSavedSearchError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.deleteSavedSearchError(err.message));
    }
}

// function* getFacetConfig() {
//     try {
//         let response = yield call(() => api.fetchFacetConfig());
//         if (response) {
//             yield put(actions.fetchFacetConfigSuccess(response));
//         }
//         else {
//             yield put(actions.fetchFacetConfigError(response.message));
//         }
//     }  catch (err) {
//         console.log(err);
//         yield put(actions.fetchFacetConfigError(err.message));
//     }
// }

function* getIslandConfig() {
    try {
        let response = yield call(() => api.fetchIslandConfig());
        if (response) {
            yield put(actions.fetchIslandConfigSuccess(response));
        } else {
            yield put(actions.fetchIslandConfigError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchIslandConfigError(err.message));
    }
}

function* updateFacetConfig(action) {
    try {
        // console.log("SAGA Updating PAGE VIEW", action);
        let updateResponse = yield call(() =>
            api.updateFacetConfig(action.input)
        );
        if (updateResponse.data.updateFacetConfig.errors === null) {
            let response = yield getIslandConfig();
            yield put(actions.updateFacetConfigSuccess(response));
        } else {
            yield put(actions.updateFacetConfigError(updateResponse.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.updateFacetConfigError(err.message));
    }
}

function* getSearchExport(action) {
    //console.log("Search EXPORT", action)
    try {
        let response = yield call(() =>
            api.searchExport(action.searchExportId)
        );
        // console.log("🚀 ~ etSearchExport ~ response", response);
        if (response.data.searchExport.downloadUrl === null) {
            yield getSearchExport(action);
            return;
        }
        if (response) {
            yield put(actions.searchExportSuccess(response));
        } else {
            yield put(actions.searchExportError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.searchExportError(err.message));
    }
}

function* exportToCsv(action) {
    try {
        let exportResponse = yield call(() =>
            api.exportToCsv(action.searchHash, action.siteViewId)
        );
        //console.log("EXPORT RES", exportResponse)
        if (exportResponse.data.exportToCsv) {
            yield put(actions.exportToCsvSuccess(exportResponse));
        } else {
            yield put(actions.exportToCsvError(exportResponse.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.exportToCsvError(err.message));
    }
}
function* toggleAgg(action) {
    try {
        // const variables = {
        //     ...action.searchParams,
        //     // url: paramsUrl.sv,
        //     configType: 'presearch',
        //     returnAll: false,
        //     agg: action.input.name,
        //     pageSize: 100,
        //     page: 25,
        //     q: action.searchParams.q,
        //     bucketsWanted: [],
        //     // bucketsWanted: action.searchParams.visibleOptions.values
        // };
        // console.log('VARS', variables);
        // action.input.aggKind == 'crowdAggs'
        //     ? yield getSearchPageCrowdAggBuckets({ searchParams: variables })
        //     : yield getSearchPageAggBuckets({ searchParams: variables });
    } catch (err) {
        console.log(err);
    }
}
function* bucketFilter(action) {
    try {
        const currentSearchParams = yield select(getCurrentSearcheParams);
        const currentIslands = yield select(getCurrentIslands);

        let currentAgg = currentIslands[action.id];

        const variables = {
            ...currentSearchParams.searchParams,
            url: '',
            configType: 'presearch',
            returnAll: false,
            agg: [currentAgg.name],
            pageSize: 25,
            page: 1,
            aggOptionsFilter: action.bucketsFilter,
            aggOptionsSort: [{ id: 'key', desc: false }],
            bucketsWanted: [currentAgg.visibleOptions],
        };

        // Better error handling could be done here
        let response =
            currentAgg.aggKind == 'crowdAggs'
                ? yield getSearchPageOpenCrowdAggBuckets({
                      searchParams: variables,
                      crowdAggIdArray: [
                          { id: action.id, name: currentAgg.name },
                      ],
                  })
                : yield getSearchPageOpenAggBuckets({
                      searchParams: variables,
                      aggIdArray: [{ id: action.id, name: currentAgg.name }],
                  });
    } catch (err) {
        console.log(err);
    }
}

// Replace display name handlebars with helper_text values
function* convertIslandConfigDisplayName(action) {
    //console.log('🚀 CONVERT DISPLAY NAME ~ action', action);
    try {
        //const currentIslands = yield select(getCurrentIslands);
        // let response = yield call(() => api.fetchIslandConfig());
        // if (response) {
        //     yield put(actions.fetchIslandConfigSuccess(response));
        // } else {
        //     yield put(actions.fetchIslandConfigError(response.message));
        // }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchIslandConfigError(err.message));
    }
}

export default function* userSagas() {
    yield takeLatest(types.FETCH_SEARCH_PAGE_AGGS_SEND, getSearchPageAggs);
    yield takeLatest(
        types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND,
        getSearchPageAggBuckets
    );
    yield takeLatest(
        types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND,
        getSearchPageCrowdAggBuckets
    );
    yield takeLatest(
        types.FETCH_SEARCH_PAGE_OPEN_AGG_BUCKETS_SEND,
        getSearchPageOpenAggBuckets
    );
    yield takeLatest(
        types.FETCH_SEARCH_PAGE_OPEN_CROWD_AGG_BUCKETS_SEND,
        getSearchPageOpenCrowdAggBuckets
    );
    yield takeLatest(types.FETCH_SEARCH_PARAMS_SEND, getSearchParams);
    yield takeLatest(types.FETCH_SEARCH_STUDIES_SEND, getSearchStudies);
    yield takeLatest(types.UPDATE_SEARCH_PARAMS_SEND, updateSearchParams);
    yield takeLatest(types.FETCH_SEARCH_AUTOSUGGEST_SEND, getSearchAutoSuggest);
    yield takeLatest(types.FETCH_SAVED_SEARCHES_SEND, getSavedSearches);
    yield takeLatest(types.CREATE_SAVED_SEARCH_SEND, createSavedSearch);
    yield takeLatest(types.DELETE_SAVED_SEARCH_SEND, deleteSavedSearch);
    // yield takeLatest(types.FETCH_FACET_CONFIG_SEND, getFacetConfig);
    yield takeLatest(types.FETCH_ISLAND_CONFIG_SEND, getIslandConfig);
    yield takeLatest(
        types.CONVERT_DISPLAY_NAME,
        convertIslandConfigDisplayName
    );
    yield takeLatest(types.UPDATE_FACET_CONFIG_SEND, updateFacetConfig);
    yield takeLatest(types.SEARCH_EXPORT_SEND, getSearchExport);
    yield takeLatest(types.EXPORT_T0_CSV_SEND, exportToCsv);
    yield takeLatest(types.TOGGLE_AGG, toggleAgg);
    yield takeLatest(types.BUCKET_FILTER, bucketFilter);
}
