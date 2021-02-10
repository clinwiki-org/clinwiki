import { call, put, takeLatest, select } from 'redux-saga/effects';
import { push } from 'connected-react-router'
import * as types from './types';
import * as actions from './actions';
import * as api from './api';

const getCurrentSavedSearches = (state)=> state.search.savedSearches.data.savedSearch; 


function* getSearchPageAggs(action) {
    try {
        let response = yield call(() => api.fetchSearchPageAggs(action.searchParams));
        if(response) {
            yield put(actions.fetchSearchPageAggsSuccess(response));
        }
        else {
            yield put(actions.fetchSearchPageAggsError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchPageAggsError(err.message));
    }
}

function* getSearchPageAggBuckets(action) {
   // console.log("SAGA SP Agg Buckets", action);
    try {
        let response = yield call(() => api.fetchSearchPageAggBuckets(action.searchParams));         
        if(response) {
            let nameBuckets = response.data.aggBuckets.aggs?.[0];
            yield put(actions.fetchSearchPageAggBucketsSuccess(nameBuckets));
        }
        else {
            yield put(actions.fetchSearchPageAggBucketsError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchPageAggBucketsError(err.message));
    }
}

function* getSearchPageCrowdAggBuckets(action) {
    //console.log("SAGA SP Agg Buckets", action);
    try {
        let response = yield call(() => api.fetchSearchPageCrowdAggBuckets(action.searchParams));     
        if(response) {
            let nameBuckets = response.data.aggBuckets.aggs?.[0];
            yield put(actions.fetchSearchPageCrowdAggBucketsSuccess(nameBuckets));
        }
        else {
            yield put(actions.fetchSearchPageCrowdAggBucketsError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchPageCrowdAggBucketsError(err.message));
    }
}

function* getSearchParams(action) {
    try {
        let response = yield call(() => api.fetchSearchParams(action.hash));
        if(response) {
            yield put(actions.fetchSearchParamsSuccess(response));
            yield put(actions.updateSearchParamsSuccess(action.hash))
        }
        else {
            yield put(actions.fetchSearchParamsError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchParamsError(err.message));
    }
}
function* getSearchStudies(action) {
    try {
        let response = yield call(() => api.fetchSearchStudies(action.searchParams));
        if(response) {
            yield put(actions.fetchSearchStudiesSuccess(response));

}
        else {
            yield put(actions.fetchSearchStudiesError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchStudiesError(err.message));
    }
}

function* updateSearchParams(action) { 
    try {
        let updateResponse = yield call(() => api.updateSearchParams(action)); 
        let location = yield select( (state) => state.router.location);
        let searchHash = updateResponse.data.provisionSearchHash.searchHash
        //console.log(searchHash)
        if (updateResponse.data.provisionSearchHash.searchHash !== null && location.pathname =='/profile' ){ 
            yield put(actions.fetchSearchParams(searchHash.short))
            yield put(actions.fetchSearchPageAggs(action.searchParams))
            yield put(actions.updateSearchParamsSuccess(searchHash));
            console.log(location)
                    yield put(push(`/profile?hash=${searchHash.short}&sv=${location.query.sv || ""}&pv=${location.query.pv|| ""}`))
            // TODO need to pull default page view possibly defaulting to blank string which should default to configured default pageview
        }
        if (updateResponse.data.provisionSearchHash.searchHash !== null && location.pathname =='/search' ){ 
            yield put(actions.fetchSearchParams(searchHash.short))
            yield put(actions.fetchSearchPageAggs(action.searchParams))
            yield put(actions.updateSearchParamsSuccess(searchHash));
            //console.log(location)
                    yield put(push(`/search?hash=${searchHash.short}&sv=${location.query.sv || ""}&pv=${location.query.pv|| ""}`))
        }
        else {
            yield put(actions.updateSearchParamsError(updateResponse.message));
        }
    }
    catch(err) {
        console.log("err");
        yield put(actions.updateSearchParamsError(err.message));
    }
}

function* getSearchAutoSuggest(action) {
    try {
        let response = yield call(() => api.fetchSearchAutoSuggest(action.searchParams));
        if(response) {
            yield put(actions.fetchSearchAutoSuggestSuccess(response));
        }
        else {
            yield put(actions.fetchSearchAutoSuggestError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSearchAutoSuggestError(err.message));
    }
}

function* getSavedSearches(action) {
    //console.log("SAGA get Saved Searches", action)
    try {
        let response = yield call(() => api.fetchSavedSearches(action.userId));
        if(response) {
            yield put(actions.fetchSavedSearchesSuccess(response));
            return response;
        }
        else {
            yield put(actions.fetchSavedSearchesError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.fetchSavedSearchesError(err.message));
    }
}


function* createSavedSearch(action) {
    try {
        let createResponse = yield call(() => api.createSavedSearch(action.searchHash, action.url)); 
        if (createResponse.data.createSavedSearch.savedSearch){                     
            let response = yield getSavedSearches(action);    
            yield put(actions.createSavedSearchSuccess(response));
        }
        else {
            yield put(actions.createSavedSearchError(createResponse.message));
        }
    }
catch(err) {
    console.log(err);
    yield put(actions.createSavedSearchError(err.message));
}    
} 

function* deleteSavedSearch(action) { 
   // console.log("SAGA Delete Saved Search", action)
    const currentSavedSearches = yield select(getCurrentSavedSearches)
    try {
        let response = yield call(() => api.deleteSavedSearch(action.id));
        const { id } = response.data.deleteSavedSearch.savedSearch
        if(id === action.id) {
            let newSavedSearches = currentSavedSearches.filter(s => s.id !== id)
            //console.log("🚀 ~  ~ newSavedSearches", newSavedSearches);
            yield put(actions.deleteSavedSearchSuccess(newSavedSearches));
        }    
        else {
            yield put(actions.deleteSavedSearchError(response.message));
        }   
    }    
    catch(err) {
        console.log(err);
        yield put(actions.deleteSavedSearchError(err.message));
    }    
} 


function* getSearchExport(action) {
    try {
        let response = yield call(() => api.searchExport(action.searchExportId));
        if(response) {
            yield put(actions.SearchExportSuccess(response));
        }
        else {
            yield put(actions.SearchExportError(response.message));
        }
    }
    catch(err) {
        console.log(err);
        yield put(actions.SearchExportError(err.message));
    }
}

function* exportToCsv(action) {
    try {
        let exportResponse = yield call(() => api.exportToCsv(action.searchHash, action.siteViewId)); 
        console.log("EXPORT RES", exportResponse)
        if (exportResponse.data.exportToCsv){                     
            let response = yield getSearchExport(action);     //! Will we need this?
            yield put(actions.ExportToCsvSuccess(response));
        }
        else {
            yield put(actions.ExportToCsvError(exportResponse.message));
        }
    }
catch(err) {
    console.log(err);
    yield put(actions.ExportToCsvError(err.message));
}    
} 

export default function* userSagas() {
    yield takeLatest(types.FETCH_SEARCH_PAGE_AGGS_SEND, getSearchPageAggs);
    yield takeLatest(types.FETCH_SEARCH_PAGE_AGG_BUCKETS_SEND, getSearchPageAggBuckets);
    yield takeLatest(types.FETCH_SEARCH_PAGE_CROWD_AGG_BUCKETS_SEND, getSearchPageCrowdAggBuckets);
    yield takeLatest(types.FETCH_SEARCH_PARAMS_SEND, getSearchParams);
    yield takeLatest(types.FETCH_SEARCH_STUDIES_SEND, getSearchStudies);
    yield takeLatest(types.UPDATE_SEARCH_PARAMS_SEND, updateSearchParams)
    yield takeLatest(types.FETCH_SEARCH_AUTOSUGGEST_SEND, getSearchAutoSuggest);
    yield takeLatest(types.FETCH_SAVED_SEARCHES_SEND, getSavedSearches);
    yield takeLatest(types.CREATE_SAVED_SEARCH_SEND, createSavedSearch);
    yield takeLatest(types.DELETE_SAVED_SEARCH_SEND, deleteSavedSearch);
    yield takeLatest(types.SEARCH_EXPORT_SEND, getSearchExport);
    yield takeLatest(types.EXPORT_T0_CSV_SEND, exportToCsv);
}
