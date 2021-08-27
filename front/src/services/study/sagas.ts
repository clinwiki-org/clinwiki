import { push } from 'connected-react-router';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import { fetchCurrentUser } from '../user/actions';
import { fetchSearchParams } from '../search/actions';
import * as api from './api';

const getCurrentPageViews = state => state.study.pageViews.data.site.pageViews;
const delay = time => new Promise(resolve => setTimeout(resolve, time));

const getCurrentPageViewsHasura = state =>
    state.study.pageViewsHasura.data.site.pageViewsHasura; //TODO CHeck path to redux store pageViews HASURA

function* getPageViewsHasura(action) {
    //console.log('SAGA Hasura Page ViewS', action);
    try {
        let response = yield call(() => api.fetchPageViewsHasura(action));
        if (response) {
            yield put(actions.fetchPageViewsHasuraSuccess(response));
            return response;
        } else {
            yield put(actions.fetchPageViewsHasuraError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchPageViewsHasuraError(err.message));
    }
}
function* getPageViewHasura(action) {
    //console.log('SAGA Hasura Page VIEW', action);
    try {
        let response = yield call(() =>
            api.fetchPageViewHasura(action.id, action.url)
        );
        if (response) {
            yield put(actions.fetchPageViewHasuraSuccess(response));
        } else {
            yield put(actions.fetchPageViewHasuraError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchPageViewHasuraError(err.message));
    }
}

function* createPageViewHasura(action) {
    try {
        // console.log("SAGA CREATING PAGE VIEW", action);
        let createResponse = yield call(() =>
            api.createPageViewHasura(action.url, action.siteId)
        );
        if (createResponse.data.createPageView.errors === null) {
            let response = yield getPageViewsHasura(action);
            yield put(actions.createPageViewHasuraSuccess(response));
        } else {
            yield put(
                actions.createPageViewHasuraError(createResponse.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.createPageViewHasuraError(err.message));
    }
}
function* updatePageViewHasura(action) {
    try {
        let updateResponse = yield call(() =>
            api.updatePageViewHasura(action.id, action.input)
        );
        if (updateResponse.data.update_page_views.returning[0]) {
            let url = updateResponse.data.update_page_views.returning[0].url;
            let siteIdObj = { siteId: null };
            siteIdObj.siteId =
                updateResponse.data.update_page_views.returning[0].site_id;
            let response = yield call(() =>
                api.fetchPageViewHasura(action.id, url)
            );
            let response2 = yield call(() =>
                api.fetchPageViewsHasura(siteIdObj)
            );
            //we should only call this one time, need to figure out what's going on here.
            yield put(actions.fetchPageViewHasuraSuccess(response));
            yield put(actions.fetchPageViewsHasuraSuccess(response2));
            yield put(
                actions.updatePageViewHasuraSuccess(
                    updateResponse,
                    'Save successful'
                )
            );
            yield call(delay, 500);
            yield put(actions.updatePageViewHasuraSuccess(updateResponse, ''));
        } else {
            yield put(
                actions.updatePageViewHasuraError(updateResponse.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.updatePageViewHasuraError(err.message));
    }
}

function* deletePageViewHasura(action) {
    const currentPageViewsHasura = yield select(getCurrentPageViewsHasura);
    try {
        //console.log("SAGA DELETE PAGE VIEW", action);
        let response = yield call(() => api.deletePageViewHasura(action.id));
        const { id } = response.data.deletePageViewHasura.pageViewHasura;
        if (id === action.id) {
            let newPageViews = currentPageViewsHasura.filter(
                pv => pv.id !== id
            );
            //console.log("🚀 ~  ~ newPageViews", newPageViews);
            yield put(actions.deletePageViewHasuraSuccess(newPageViews));
        } else {
            yield put(actions.deletePageViewHasuraError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.deletePageViewHasuraError(err.message));
    }
}

function* getSampleStudy(action) {
    try {
        let response = yield call(() =>
            api.fetchSampleStudy(action.params, action.QUERY)
        );
        if (response) {
            yield put(actions.fetchSampleStudySuccess(response));
        } else {
            yield put(actions.fetchSampleStudyError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSampleStudyError(err.message));
    }
}

function* getHasuraSampleStudy(action) {
    //console.log('SAGA SAMPLE STUDY HASURA', action.QUERY);
    try {
        let response = yield call(() =>
            api.fetchHasuraSampleStudy(action.nctId, action.QUERY)
        );
        if (response) {
            //console.log('SAGA HASURA STUDY RESPONSE', response.data.ctgov_prod_studies[0]);
            yield put(actions.fetchSampleStudyHasuraSuccess(response));
        } else {
            yield put(actions.fetchSampleStudyHasuraError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSampleStudyHasuraError(err.message));
    }
}

// function* getStudyPage(action) {
//     try {
//         console.log(action);
//         let response = yield call(() =>
//             api.fetchStudyPage(action.nctId, action.QUERY)
//         );
//         if (response) {
//             yield put(actions.fetchStudyPageSuccess(response));
//             yield call(() => api.updateStudyViewLogCount(action.nctId));
//         } else {
//             yield put(actions.fetchStudyPageError(response.message));
//         }
//     } catch (err) {
//         console.log(err);
//         yield put(actions.fetchStudyPageError(err.message));
//     }
// }

function* getSearchPageMM(action) {
    try {
        console.log(action)
        let response = yield call(() =>
            api.fetchSearchPageMM(action.params, action.QUERY)
        );
        if (response) {
            yield put(actions.fetchStudyPageSuccess(response));
        } else {
            yield put(actions.fetchStudyPageError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchStudyPageError(err.message));
    }
}

function* getStudyPageNearby(action) {
    try {
        // console.log('action in getStudyPageNearby', action);

        let response = yield call(() =>
            api.fetchSearchPageNearby(action.params, action.QUERY)
        );
        // yield put(fetchSearchParams(action.hash))
        if (response) {
            yield put(actions.fetchStudyPageNearbySuccess(response));
        } else {
            yield put(actions.fetchStudyPageNearbyError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchStudyPageNearbyError(err.message));
    }
}

function* getSearchPageStudy(action) {
    try {
        let response = yield call(() =>
            api.fetchSearchPageStudy(action.params, action.QUERY)
        );
        if (response) {
            yield put(actions.fetchSearchPageStudySuccess(response));
        } else {
            yield put(actions.fetchSearchPageStudyError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSearchPageStudyError(err.message));
    }
}

function* getStudyPageHasura(action) {
    //console.log('SAGA GET STUDY HASURA', action.HASURA_STUDY_QUERY);
    try {
        let response = yield call(() =>
            api.fetchStudyPageHasura(action.nctId, action.HASURA_STUDY_QUERY)
        );
        if (response) {
            yield put(actions.fetchStudyPageHasuraSuccess(response));
            //yield call(() => api.updateStudyViewLogCount(action.nctId));
        } else {
            yield put(actions.fetchStudyPageHasuraError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchStudyPageHasuraError(err.message));
    }
}
function* getDISPageHasura(action) {
    console.log('SAGA GET STUDY HASURA', action);
    try {
        let response = yield call(() =>
            api.fetchStudyPageHasuraDIS(action.conditionId, action.HASURA_STUDY_QUERY)
        );
        if (response) {
            yield put(actions.fetchStudyPageHasuraSuccess(response));
            //yield call(() => api.updateStudyViewLogCount(action.nctId));
        } else {
            yield put(actions.fetchStudyPageHasuraError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchStudyPageHasuraError(err.message));
    }
}

function* getSuggestedLabels(action) {
    try {
        let response = yield call(() =>
            api.fetchSuggestedLabels(action.nctId, action.crowdKeyArray)
        );
        if (response) {
            yield put(actions.fetchSuggestedLabelsSuccess(response));
        } else {
            yield put(actions.fetchSuggestedLabelsError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchSuggestedLabelsError(err.message));
    }
}

function* getHasuraWikiPage(action) {
    try {
        //console.log('SAGA Get HASURA WIKIpage', action);
        let response = yield call(() => api.fetchHasuraWikiPage(action.nctId));
        //console.log('HASURA WIKI res', response);
        if (response) {
            yield put(actions.fetchHasuraWikiPageSuccess(response));
        } else {
            yield put(actions.fetchHasuraWikiPageError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchHasuraWikiPageError(err.message));
    }
}


function* wikiPageUpdateHasuraMutation(action) {
    try {
        console.log('SAGA Hasura Wiki Update', action);
        let response = yield call(() =>
            api.wikiPageUpdateHasuraMutation(
                action.nctId,
                action.text,
                action.isWikiContent
            )
        );
        if (response) {
            console.log('SAGA RES Hasura Wiki Update', response);
            yield getHasuraWikiPage(action); //yield put(actions.fetchHasuraWikiPage(action.nctId));
            yield put(fetchCurrentUser());
            yield put(actions.wikiPageUpdateHasuraMutationSuccess(response));
        } else {
            yield put(
                actions.wikiPageUpdateHasuraMutationError(response.message)
            );
        }
    } catch (err) {
        console.log(err);
        yield put(actions.wikiPageUpdateHasuraMutationError(err.message));
    }
}







function* getFacilitiesPageHasura(action) {
    try {
        let response = yield call(() =>
            api.fetchFacilitiesPageHasura(action.nctId)
        );
        /*  console.log(
            '🚀 ~ SAGA HAS function*getFacilitiesPageHasura ~ response',
            response
        ); */

        if (response) {
            yield put(actions.fetchFacilitiesPageHasuraSuccess(response));
        } else {
            yield put(actions.fetchFacilitiesPageHasuraError(response.message));
        }
    } catch (err) {
        console.log(err);
        yield put(actions.fetchFacilitiesPageHasuraError(err.message));
    }
}

export default function* userSagas() {
    yield takeLatest(types.FETCH_PAGE_VIEWS_HASURA_SEND, getPageViewsHasura);
    yield takeLatest(types.FETCH_PAGE_VIEW_HASURA_SEND, getPageViewHasura);
    yield takeLatest(types.CREATE_PAGE_VIEW_HASURA_SEND, createPageViewHasura);
    yield takeLatest(types.DELETE_PAGE_VIEW_HASURA_SEND, deletePageViewHasura);
    yield takeLatest(types.UPDATE_PAGE_VIEW_HASURA_SEND, updatePageViewHasura);
    yield takeLatest(types.FETCH_SAMPLE_STUDY_SEND, getSampleStudy);
    // yield takeLatest(types.FETCH_STUDY_PAGE_SEND, getStudyPage);
    yield takeLatest(types.FETCH_STUDY_PAGE_NEARBY_SEND, getStudyPageNearby);
    yield takeLatest(types.FETCH_SEARCH_PAGE_MM_SEND, getSearchPageMM);
    yield takeLatest(types.FETCH_SEARCH_PAGE_STUDY_SEND, getSearchPageStudy);
    // yield takeLatest(types.FETCH_PAGE_VIEWS_SEND, getPageViews);
    // yield takeLatest(types.FETCH_PAGE_VIEW_SEND, getPageView);
    // yield takeLatest(
    //     types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND,
    //     updateStudyViewLogCount
    // );
    // yield takeLatest(types.CREATE_PAGE_VIEW_SEND, createPageView);
    // yield takeLatest(types.DELETE_PAGE_VIEW_SEND, deletePageView);
    // yield takeLatest(types.UPDATE_PAGE_VIEW_SEND, updatePageView);
    // yield takeLatest(types.FETCH_SEARCH_STUDY_PAGE_SEND, getSearchStudyPage);
    // yield takeLatest(types.FETCH_WORKFLOW_PAGE_SEND, getWorkFlowPage);
    // yield takeLatest(types.UPSERT_LABEL_MUTATION_SEND, upsertLabelMutation);
    // yield takeLatest(types.DELETE_LABEL_MUTATION_SEND, deleteLabelMutation);
    // yield takeLatest(types.DELETE_REVIEW_MUTATION_SEND, deleteReviewMutation);
    // yield takeLatest(types.FETCH_REVIEW_PAGE_SEND, getReviewPage);
    // yield takeLatest(
    //     types.FETCH_STUDY_EDITS_HISTORY_SEND,
    //     getStudyEditsHistory
    // );
    // yield takeLatest(types.FETCH_FACILITIES_PAGE_SEND, getFacilitiesPage);
    // yield takeLatest(types.FETCH_WIKI_PAGE_SEND, getWikiPage);
    yield takeLatest(types.FETCH_HASURA_WIKI_PAGE_SEND, getHasuraWikiPage);
    // yield takeLatest(
    //     types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND,
    //     wikiPageUpdateContentMutation
    // );
    yield takeLatest(
        types.WIKI_PAGE_UPDATE_HASURA_MUTATION_SEND,
        wikiPageUpdateHasuraMutation
    );
    yield takeLatest(types.FETCH_SUGGESTED_LABELS_SEND, getSuggestedLabels);
    // yield takeLatest(types.FETCH_ALL_WORKFLOWS_SEND, getAllWorkFlows);
    // yield takeLatest(types.FETCH_REACTIONS_ISLAND_SEND, getReactionsIsland);
    // yield takeLatest(types.DELETE_REACTION_SEND, deleteReaction);
    // yield takeLatest(types.FETCH_REACTION_KINDS_SEND, getReactionKinds);
    // yield takeLatest(types.FETCH_STUDY_REACTIONS_SEND, getStudyReactions);
    // yield takeLatest(types.CREATE_REACTION_SEND, createReaction);
    // yield takeLatest(types.UPDATE_WORKFLOW_PAGE_SEND, updateWorkflowPage);
    // yield takeLatest(types.FETCH_LABELS_SEND, getLabels);
    // yield takeLatest(types.FETCH_LABELS_BUCKETS_SEND, getLabelsBuckets);
    // yield takeLatest(types.BULK_LIST_UPDATE_MUTATION_SEND, bulkListUpdate);
    // yield takeLatest(types.BULK_QUERY_UPDATE_MUTATION_SEND, bulkQueryUpdate);
    // yield takeLatest(types.FETCH_REACTIONS_BY_ID_SEND, getReactionsById);
    // yield takeLatest(
    //     types.UPSERT_REVIEW_FORM_MUTATION_SEND,
    //     upsertReviewFormMutation
    // );
    // yield takeLatest(types.FETCH_EDIT_REVIEW_SEND, getEditReview);
    yield takeLatest(
        types.FETCH_SAMPLE_STUDY_HASURA_SEND,
        getHasuraSampleStudy
    );
    yield takeLatest(types.FETCH_STUDY_PAGE_HASURA_SEND, getStudyPageHasura);
    yield takeLatest(types.FETCH_STUDY_PAGE_HASURA_SEND_DIS, getDISPageHasura);
    yield takeLatest(
        types.FETCH_FACILITIES_PAGE_HASURA_SEND,
        getFacilitiesPageHasura
    );
}
