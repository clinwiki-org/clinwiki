import { push } from 'connected-react-router'
import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './types';
import * as actions from './actions';
import * as api from './api';
import { updateSearchParamsSuccess } from './../search/actions';

const getCurrentPageViews = (state) => state.study.pageViews.data.site.pageViews; //TODO CHeck path to redux store pageViews


function* getSampleStudy(action) {
    try {
        let response = yield call(() => api.fetchSampleStudy(action.nctId, action.QUERY));
        if (response) {
            yield put(actions.fetchSampleStudySuccess(response));
        }
        else {
            yield put(actions.fetchSampleStudyError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchSampleStudyError(err.message));
    }
}

function* getStudyPage(action) {
    console.log(action);
    try {
        let response = yield call(() => api.fetchStudyPage(action.nctId, action.QUERY));
        console.log(response)
        if (response) {
            yield put(actions.fetchStudyPageSuccess(response));
            yield call(() => api.updateStudyViewLogCount(action.nctId));
        }
        else {
            yield put(actions.fetchStudyPageError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchStudyPageError(err.message));
    }
}
function* getPageViews(action) {
    try {
        let response = yield call(() => api.fetchPageViews(action));
        if (response) {
            yield put(actions.fetchPageViewsSuccess(response));
            return response;
        }
        else {
            yield put(actions.fetchPageViewsError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchPageViewsError(err.message));
    }
}
function* getPageView(action) {
    try {
        let response = yield call(() => api.fetchPageView(action));
        if (response) {
            yield put(actions.fetchPageViewSuccess(response));
        }
        else {
            yield put(actions.fetchPageViewError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchPageViewError(err.message));
    }
}
function* updateStudyViewLogCount(action) {
    try {
        let response = yield call(() => api.updateStudyViewLogCount(action.input));
        if (response) {
            yield put(actions.updateStudyViewLogCountSuccess(response.data));
        }
        else {
            yield put(actions.updateStudyViewLogCountError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.updateStudyViewLogCountError(err.message));
    }
}
function* getSearchStudyPage(action) {
    try {
        let response = yield call(() => api.fetchSearchStudyPage(action.hash, action.id));
        if (response) {
            yield put(actions.fetchSearchStudyPageSuccess(response));
        }
        else {
            yield put(actions.fetchSearchStudyPageError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchSearchStudyPageError(err.message));
    }
}


function* getStudyEditsHistory(action) {
    try {
        let response = yield call(() => api.fetchStudyEditsHistory(action.nctId));
        if (response) {
            yield put(actions.fetchStudyEditsHistorySuccess(response));
        }
        else {
            yield put(actions.fetchStudyEditsHistoryError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchStudyEditsHistoryError(err.message));
    }
}
function* getWorkFlowPage(action) {
    try {
        let response = yield call(() => api.fetchWorkFlowPage(action.nctId));
        if (response) {
            yield put(actions.fetchWorkFlowPageSuccess(response));
            return response
        }
        else {
            yield put(actions.fetchWorkFlowPageError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchWorkFlowPageError(err.message));
    }
}
function* upsertLabelMutation(action) {
    try {
        console.log(action)
        let response = yield call(() => api.upsertLabelMutation(action.nctId, action.key, action.value));
        if (!response.data.upsertWikiLabel.errors) {
            let response2 = yield getWorkFlowPage(action);
            let response3 = yield getSuggestedLabels(action);
            let response4 = yield getAllWorkFlows(action);
            yield put(actions.upsertLabelMutationSuccess(response2));
        }
        else {
            yield put(actions.upsertLabelMutationError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.upsertLabelMutationError(err.message));
    }
}
function* deleteLabelMutation(action) {
    try {
        let response = yield call(() => api.deleteLabelMutation(action.nctId, action.key, action.value));
        if (response) {
            let response2 = yield getWorkFlowPage(action);
            let response3 = yield getSuggestedLabels(action);

            yield put(actions.deleteLabelMutationSuccess(response));
        }
        else {
            yield put(actions.deleteLabelMutationError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.deleteLabelMutationError(err.message));
    }
}
function* deleteReviewMutation(action) {
    try {
        console.log(action)
        let response = yield call(() => api.deleteReviewMutation(action.id, action.nctId));
        if (response) {
            yield put(actions.deleteReviewMutationSuccess(response.id));
            //yield call(()=> api.fetchReviewPage(action.nctId));
            console.log(action.nctId);
            let response2 = yield getReviewPage(action);
        }
        else {
            yield put(actions.deleteReviewMutationError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.deleteReviewMutationError(err.message));
    }
}
function* getSuggestedLabels(action) {
    try {
        let response = yield call(() => api.fetchSuggestedLabels(action.nctId, action.crowdBucketsWanted));
        if (response) {
            yield put(actions.fetchSuggestedLabelsSuccess(response));
        }
        else {
            yield put(actions.fetchSuggestedLabelsError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchSuggestedLabelsError(err.message));
    }
}
function* getReviewPage(action) {
    try {
        //console.log(action)
        let response = yield call(() => api.fetchReviewPage(action.nctId));
        if (response) {
            yield put(actions.fetchReviewPageSuccess(response));
        }
        else {
            yield put(actions.fetchReviewPageError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchReviewPageError(err.message));
    }
}
function* getFacilitiesPage(action) {
    try {
        let response = yield call(() => api.fetchFacilitiesPage(action.nctId));
        if (response) {
            yield put(actions.fetchFacilitiesPageSuccess(response));
        }
        else {
            yield put(actions.fetchFacilitiesPageError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchFacilitiesPageError(err.message));
    }
}
function* getWikiPage(action) {
    try {
        let response = yield call(() => api.fetchWikiPage(action.nctId));
        if (response) {
            yield put(actions.fetchWikiPageSuccess(response));
        }
        else {
            yield put(actions.fetchWikiPageError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchWikiPageError(err.message));
    }
}
function* wikiPageUpdateContentMutation(action) {
    //console.log("SAGA WIKI EDIT", action)
    try {
        console.log(action)
        let response = yield call(() => api.wikiPageUpdateContentMutation(action.nctId, action.content));
        if (response) {
            yield put(actions.wikiPageUpdateContentMutationSuccess(response));
        }
        else {
            yield put(actions.wikiPageUpdateContentMutationError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.wikiPageUpdateContentMutationError(err.message));
    }
}
function* getAllWorkFlows(action) {
    try {
        let response = yield call(() => api.fetchAllWorkFlows());
        if (response) {
            yield put(actions.fetchAllWorkFlowsSuccess(response));
        }
        else {
            yield put(actions.fetchAllWorkFlowsError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchAllWorkFlowsError(err.message));
    }
}
function* getReactionsIsland(action) {
    try {
        console.log(action);
        let response = yield call(() => api.fetchReactionsIsland(action.nctId));
        console.log(response);
        if (response) {
            yield put(actions.fetchReactionsIslandSuccess(response));
        }
        else {
            yield put(actions.fetchReactionsIslandError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchReactionsIslandError(err.message));
    }
}
function* deleteReaction(action) {
    try {
        console.log(action.nctId);
        let response = yield call(() => api.deleteReaction(action.id, action.studyQuery, action.nctId));
        if (response) {
            yield put(actions.deleteReactionSuccess(response.id));
            console.log(action);
            yield getReactionsIsland(action);
            yield getStudyReactions(action);
            yield put (actions.fetchStudyPage(action.nctId ?? "", action.studyQuery));
        }
        else {
            yield put(actions.deleteReactionError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.deleteReactionError(err.message));
    }
}
function* getReactionKinds(action) {
    try {
        let response = yield call(() => api.fetchReactionKinds());
        if (response) {
            yield put(actions.fetchReactionKindsSuccess(response));
        }
        else {
            yield put(actions.fetchReactionKindsError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchReactionKindsError(err.message));
    }
}
function* getStudyReactions(action) {
    try {
        let response = yield call(() => api.fetchStudyReactions(action.nctId));
        if (response) {
            yield put(actions.fetchStudyReactionsSuccess(response.data));
        }
        else {
            yield put(actions.fetchStudyReactionsError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchStudyReactionsError(err.message));
    }
}
function* createReaction(action) {
    try {
        let response = yield call(() => api.createReaction(action.nctId, action.reactionKindId));
        if (response) {
            yield put(actions.createReactionSuccess(response.data));
            yield getReactionsById(action.reactionKindId);
            console.log(action);
            yield getStudyReactions(action);
            yield put (actions.fetchStudyPage(action.nctId ?? "", action.studyQuery));
            console.log(action.nctId);
            yield getReactionsIsland(action);
        }
        else {
            yield put(actions.createReactionError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.createReactionError(err.message));
    }
}
function* getLabels(action) {
    try {
        let response = yield call(() => api.fetchLabels(action.variables));
        if (response) {
            yield put(actions.fetchLabelsSuccess(response));
        }
        else {
            yield put(actions.fetchLabelsError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchLabelsError(err.message));
    }
}
function* getLabelsBuckets(action) {
    try {
        let response = yield call(() => api.fetchLabelsBuckets(action.variables, action.QUERY));
        if (response) {
            yield put(actions.fetchLabelsBucketsSuccess(response));
        }
        else {
            yield put(actions.fetchLabelsBucketsError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchLabelsBucketsError(err.message));
    }
}
function* bulkListUpdate(action) {
    try {
        let response = yield call(() => api.bulkListUpdate(action.input));
        if (response) {
            yield put(actions.bulkListUpdateSuccess(response.data));
        }
        else {
            yield put(actions.bulkListUpdateError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.bulkListUpdateError(err.message));
    }
}
function* bulkQueryUpdate(action) {
    try {
        let response = yield call(() => api.bulkQueryUpdate(action.input));
        if (response) {
            yield put(actions.bulkQueryUpdateSuccess(response.data));
        }
        else {
            yield put(actions.bulkQueryUpdateError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.bulkQueryUpdateError(err.message));
    }
}
//PAGE VIEW SAGAS

function* createPageView(action) {
    try {
        // console.log("SAGA CREATING PAGE VIEW", action);
        let createResponse = yield call(() => api.createPageView(action.url, action.siteId));
        if (createResponse.data.createPageView.errors === null) {
            let response = yield getPageViews(action);
            yield put(actions.createPageViewSuccess(response));
        }
        else {
            yield put(actions.createPageViewError(createResponse.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.createPageViewError(err.message));
    }
}
function* updatePageView(action) {
    try {
        // console.log("SAGA Updating PAGE VIEW", action);
        let updateResponse = yield call(() => api.updatePageView(action.input));
        if (updateResponse.data.updatePageView.errors === null) {
            let response = yield getPageViews(action);
            yield put(actions.updatePageViewSuccess(response));
        }
        else {
            yield put(actions.updatePageViewError(updateResponse.message));

        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.updatePageViewError(err.message));
    }
}
function* deletePageView(action) {
    const currentPageViews = yield select(getCurrentPageViews)
    try {
        //console.log("SAGA DELETE PAGE VIEW", action);
        let response = yield call(() => api.deletePageView(action.id));
        const { id } = response.data.deletePageView.pageView
        if (id === action.id) {
            let newPageViews = currentPageViews.filter(pv => pv.id !== id)
            //console.log("🚀 ~  ~ newPageViews", newPageViews);
            yield put(actions.deletePageViewSuccess(newPageViews));
        }
        else {
            yield put(actions.deletePageViewError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.deletePageViewError(err.message));
    }
}
function* updateWorkflowPage(action) {
    try {
        let response = yield call(() => api.updateWorkflowPage(action.input));
        if (response) {
            yield put(actions.updateWorkflowPageSuccess(response.data));
        }
        else {
            yield put(actions.updateWorkflowPageError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.updateWorkflowPageError(err.message));
        yield put(actions.fetchEditReviewError(err.message));
    }
}
function* getReactionsById(action) {
    try {
        //console.log(action)
        let response = yield call(() => api.fetchReactionsById(action.toString()));
        console.log(response);
        if (response) {
            yield put(actions.fetchReactionsByIdSuccess(response));
        }
        else {
            yield put(actions.fetchReactionsByIdError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchReactionsByIdError(err.message));
    }
}
function* upsertReviewFormMutation(action) {
    try {
       //console.log(action);
        let response = yield call(() => api.upsertReviewFormMutation(action.id, action.nctId, action.meta, action.content));
        if (response) {
            yield put(actions.upsertReviewFormMutationSuccess(response));
            let response2 = yield getReviewPage(action);
           // let location = yield select((state) => state.router.location);
            //let path = location.pathname.slice(0, -4);
           // yield put(push(`${path}?hash=${location.query.hash}&sv=${location.query.sv}&pv=${location.query.pv}`));
        }
        else {
            yield put(actions.upsertReviewFormMutationError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.upsertReviewFormMutationError(err.message));
    }
}
function* getEditReview(action) {
    try {
        let response = yield call(() => api.fetchEditReview(action.nctId));
        if (response) {
            yield put(actions.fetchEditReviewSuccess(action.nctId));
        }
        else {
            yield put(actions.fetchEditReviewError(response.message));
        }
    }
    catch (err) {
        console.log(err);
        yield put(actions.fetchEditReviewError(err.message));
    }
}
export default function* userSagas() {
    yield takeLatest(types.FETCH_SAMPLE_STUDY_SEND, getSampleStudy);
    yield takeLatest(types.FETCH_STUDY_PAGE_SEND, getStudyPage);
    yield takeLatest(types.FETCH_PAGE_VIEWS_SEND, getPageViews);
    yield takeLatest(types.FETCH_PAGE_VIEW_SEND, getPageView);
    yield takeLatest(types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND, updateStudyViewLogCount);
    yield takeLatest(types.CREATE_PAGE_VIEW_SEND, createPageView)
    yield takeLatest(types.DELETE_PAGE_VIEW_SEND, deletePageView);
    yield takeLatest(types.UPDATE_PAGE_VIEW_SEND, updatePageView);
    yield takeLatest(types.FETCH_SEARCH_STUDY_PAGE_SEND, getSearchStudyPage);
    yield takeLatest(types.FETCH_WORKFLOW_PAGE_SEND, getWorkFlowPage);
    yield takeLatest(types.UPSERT_LABEL_MUTATION_SEND, upsertLabelMutation);
    yield takeLatest(types.DELETE_LABEL_MUTATION_SEND, deleteLabelMutation);
    yield takeLatest(types.DELETE_REVIEW_MUTATION_SEND, deleteReviewMutation);
    yield takeLatest(types.FETCH_REVIEW_PAGE_SEND, getReviewPage);
    yield takeLatest(types.FETCH_STUDY_EDITS_HISTORY_SEND, getStudyEditsHistory);
    yield takeLatest(types.FETCH_FACILITIES_PAGE_SEND, getFacilitiesPage);
    yield takeLatest(types.FETCH_WIKI_PAGE_SEND, getWikiPage);
    yield takeLatest(types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND, wikiPageUpdateContentMutation);
    yield takeLatest(types.FETCH_SUGGESTED_LABELS_SEND, getSuggestedLabels);
    yield takeLatest(types.FETCH_ALL_WORKFLOWS_SEND, getAllWorkFlows);
    yield takeLatest(types.FETCH_REACTIONS_ISLAND_SEND, getReactionsIsland);
    yield takeLatest(types.DELETE_REACTION_SEND, deleteReaction);
    yield takeLatest(types.FETCH_REACTION_KINDS_SEND, getReactionKinds);
    yield takeLatest(types.FETCH_STUDY_REACTIONS_SEND, getStudyReactions);
    yield takeLatest(types.CREATE_REACTION_SEND, createReaction);
    yield takeLatest(types.UPDATE_WORKFLOW_PAGE_SEND, updateWorkflowPage);
    yield takeLatest(types.FETCH_LABELS_SEND, getLabels);
    yield takeLatest(types.FETCH_LABELS_BUCKETS_SEND, getLabelsBuckets);
    yield takeLatest(types.BULK_LIST_UPDATE_MUTATION_SEND, bulkListUpdate);
    yield takeLatest(types.BULK_QUERY_UPDATE_MUTATION_SEND, bulkQueryUpdate);
    yield takeLatest(types.FETCH_REACTIONS_BY_ID_SEND, getReactionsById);
    yield takeLatest(types.UPSERT_REVIEW_FORM_MUTATION_SEND, upsertReviewFormMutation);
    yield takeLatest(types.FETCH_EDIT_REVIEW_SEND, getEditReview);
}
