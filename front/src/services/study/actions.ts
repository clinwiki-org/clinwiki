//import { QUERY } from 'queries/SearchStudyPageQuery';
import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';
import { SearchStudyPageQuery } from './model/SearchStudyPageQuery';
import { StudyEditsHistoryQuery } from './model/StudyEditsHistoryQuery';
import * as types from './types';
import { UpdatePageViewInput } from 'services/study/model/InputTypes';

export const fetchPageViewsHasura = (siteId: any): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_HASURA_SEND,
    siteId,
});
export const fetchPageViewsHasuraSuccess = (
    payload: PageViewsQuery
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_HASURA_SUCCESS,
    payload,
});
export const fetchPageViewsHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_HASURA_ERROR,
    payload: { message },
});
export const fetchPageViewHasura = (
    id: string,
    url: string
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_HASURA_SEND,
    id,
    url,
});
export const fetchPageViewHasuraSuccess = (
    payload: PageViewQuery
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_HASURA_SUCCESS,
    payload,
});
export const fetchPageViewHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_HASURA_ERROR,
    payload: { message },
});

export const createPageViewHasura = (
    url: string,
    siteId: number
): types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_HASURA_SEND,
    url,
    siteId,
});
export const createPageViewHasuraSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_HASURA_SUCCESS,
    payload,
});
export const createPageViewHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_HASURA_ERROR,
    payload: { message },
});
export const deletePageViewHasura = (id: number): types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_HASURA_SEND,
    id,
});
export const deletePageViewHasuraSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_HASURA_SUCCESS,
    payload,
});
export const deletePageViewHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_HASURA_ERROR,
    payload: { message },
});
export const updatePageViewHasura = (
    id: any,
    input: any
): types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_HASURA_SEND,
    id,
    input,
});
export const updatePageViewHasuraSuccess = (
    payload: any,
    updatePageViewSuccessMessage: string
): types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_HASURA_SUCCESS,
    payload,
    updatePageViewSuccessMessage
});
export const updatePageViewHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_HASURA_ERROR,
    payload: { message },
});

export const fetchFacilitiesHasuraPage = (
    nctId: string
): types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_HASURA_SEND,
    nctId,
});
export const fetchFacilitiesPageHasuraSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_HASURA_SUCCESS,
    payload,
});
export const fetchFacilitiesPageHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_HASURA_ERROR,
    payload: { message },
});

export const fetchSampleStudy = (
    params: any,
    QUERY: any
): types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_SEND,
    params,
    QUERY,
});
export const fetchSampleStudySuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_SUCCESS,
    payload,
});
export const fetchSampleStudyError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_ERROR,
    payload: { message },
});
export const fetchSampleStudyHasura = (
    nctId: string,
    QUERY: any
): types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_HASURA_SEND,
    nctId,
    QUERY,
});
export const fetchSampleStudyHasuraSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_HASURA_SUCCESS,
    payload,
});
export const fetchSampleStudyHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_HASURA_ERROR,
    payload: { message },
});
export const fetchStudyPage = (
    nctId: string,
    QUERY: any
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_SEND,
    nctId,
    QUERY,
});
export const fetchStudyPageSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_SUCCESS,
    payload,
});
export const fetchStudyPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_ERROR,
    payload: { message },
});
export const fetchSearchPageMM = (
    params: any,
    QUERY: any
): types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_MM_SEND,
    params,
    QUERY,
});
export const fetchSearchPageMMSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_MM_SUCCESS,
    payload,
});
export const fetchSearchPageMMError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_PAGE_MM_ERROR,
    payload: { message },
});
export const fetchStudyPageHasura = (
    nctId: string,
    HASURA_STUDY_QUERY: any
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_HASURA_SEND,
    nctId,
    HASURA_STUDY_QUERY,
});
export const fetchStudyPageHasuraDIS = (
    conditionId: string,
    HASURA_STUDY_QUERY: any
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_HASURA_SEND_DIS,
    conditionId,
    HASURA_STUDY_QUERY,
});
export const fetchStudyPageHasuraSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_HASURA_SUCCESS,
    payload,
});
export const fetchStudyPageHasuraError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_HASURA_ERROR,
    payload: { message },
});
export const fetchPageViews = (siteId: any): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_SEND,
    siteId,
});
export const fetchPageViewsSuccess = (
    payload: PageViewsQuery
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_SUCCESS,
    payload,
});
export const fetchPageViewsError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_ERROR,
    payload: { message },
});
export const fetchPageView = (
    id: string,
    url: string
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_SEND,
    id,
    url,
});
export const fetchPageViewSuccess = (
    payload: PageViewQuery
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_SUCCESS,
    payload,
});
export const fetchPageViewError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_ERROR,
    payload: { message },
});
export const updateStudyViewLogCount = (
    nctId: string
): types.StudyActionTypes => ({
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND,
    nctId,
});
export const updateStudyViewLogCountSuccess = (
    payload: CreateStudyViewLogMutation
): types.StudyActionTypes => ({
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS,
});
export const updateStudyViewLogCountError = (
    message: string
): types.StudyActionTypes => ({
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_ERROR,
    payload: { message },
});
export const createPageView = (
    url: string,
    siteId: number
): types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_SEND,
    url,
    siteId,
});
export const createPageViewSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_SUCCESS,
    payload,
});
export const createPageViewError = (
    message: string
): types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_ERROR,
    payload: { message },
});
export const deletePageView = (id: number): types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_SEND,
    id,
});
export const deletePageViewSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_SUCCESS,
    payload,
});
export const deletePageViewError = (
    message: string
): types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_ERROR,
    payload: { message },
});
export const updatePageView = (
    id: any,
    input: UpdatePageViewInput
): types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_SEND,
    id,
    input,
});
export const updatePageViewSuccess = (
    payload: any,
    updatePageViewSuccessMessage: string
): types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_SUCCESS,
    payload,
    updatePageViewSuccessMessage
});
export const updatePageViewError = (
    message: string
): types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_ERROR,
    payload: { message },
});
export const fetchSearchStudyPage = (
    hash: string,
    id: string
): types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_STUDY_PAGE_SEND,
    hash,
    id,
});
export const fetchSearchStudyPageSuccess = (
    payload: SearchStudyPageQuery
): types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_STUDY_PAGE_SUCCESS,
    payload,
});
export const fetchSearchStudyPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_STUDY_PAGE_ERROR,
    payload: { message },
});
export const fetchWorkFlowPage = (nctId: string): types.StudyActionTypes => ({
    type: types.FETCH_WORKFLOW_PAGE_SEND,
    nctId,
});
export const fetchWorkFlowPageSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_WORKFLOW_PAGE_SUCCESS,
    payload,
});
export const fetchWorkFlowPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_WORKFLOW_PAGE_ERROR,
    payload: { message },
});
export const fetchAllWorkFlows = (): types.StudyActionTypes => ({
    type: types.FETCH_ALL_WORKFLOWS_SEND,
});
export const fetchAllWorkFlowsSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_ALL_WORKFLOWS_SUCCESS,
    payload,
});
export const fetchAllWorkFlowsError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_ALL_WORKFLOWS_ERROR,
    payload: { message },
});
export const upsertLabelMutation = (
    nctId: any,
    key: any,
    value: any,
    studyQuery?: any
): types.StudyActionTypes => ({
    type: types.UPSERT_LABEL_MUTATION_SEND,
    nctId,
    key,
    value,
    studyQuery,
});
export const upsertLabelMutationSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.UPSERT_LABEL_MUTATION_SUCCESS,
    payload,
});
export const upsertLabelMutationError = (
    message: string
): types.StudyActionTypes => ({
    type: types.UPSERT_LABEL_MUTATION_ERROR,
    payload: { message },
});
export const deleteLabelMutation = (
    nctId: any,
    key: any,
    studyQuery?: any
): types.StudyActionTypes => ({
    type: types.DELETE_LABEL_MUTATION_SEND,
    nctId,
    key,
    studyQuery,
});
export const deleteLabelMutationSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.DELETE_LABEL_MUTATION_SUCCESS,
    payload,
});
export const deleteLabelMutationError = (
    message: string
): types.StudyActionTypes => ({
    type: types.DELETE_LABEL_MUTATION_ERROR,
    payload: { message },
});
export const fetchCrowdPage = (nctId: string): types.StudyActionTypes => ({
    type: types.FETCH_CROWD_PAGE_SEND,
    nctId,
});
export const fetchCrowdPageSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_CROWD_PAGE_SUCCESS,
    payload,
});
export const fetchCrowdPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_CROWD_PAGE_ERROR,
    payload: { message },
});
export const deleteReviewMutation = (
    id: any,
    nctId: any
): types.StudyActionTypes => ({
    type: types.DELETE_REVIEW_MUTATION_SEND,
    id,
    nctId,
});
export const deleteReviewMutationSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.DELETE_REVIEW_MUTATION_SUCCESS,
    payload,
});
export const deleteReviewMutationError = (
    message: string
): types.StudyActionTypes => ({
    type: types.DELETE_REVIEW_MUTATION_ERROR,
    payload: { message },
});
export const fetchReviewPage = (nctId: string): types.StudyActionTypes =>
    //console.log(nctId),
    ({
        type: types.FETCH_REVIEW_PAGE_SEND,
        nctId,
    });
export const fetchReviewPageSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_REVIEW_PAGE_SUCCESS,
    payload,
});
export const fetchReviewPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_REVIEW_PAGE_ERROR,
    payload: { message },
});
export const fetchStudyEditsHistory = (
    nctId: string
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_EDITS_HISTORY_SEND,
    nctId,
});
export const fetchStudyEditsHistorySuccess = (
    payload: StudyEditsHistoryQuery
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_EDITS_HISTORY_SUCCESS,
    payload,
});
export const fetchStudyEditsHistoryError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_EDITS_HISTORY_ERROR,
    payload: { message },
});
export const fetchFacilitiesPage = (nctId: string): types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_SEND,
    nctId,
});
export const fetchFacilitiesPageSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_SUCCESS,
    payload,
});
export const fetchFacilitiesPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_ERROR,
    payload: { message },
});

export const fetchWikiPage = (nctId: string): types.StudyActionTypes => ({
    type: types.FETCH_WIKI_PAGE_SEND,
    nctId,
});
export const fetchWikiPageSuccess = (payload: any): types.StudyActionTypes => ({
    type: types.FETCH_WIKI_PAGE_SUCCESS,
    payload,
});
export const fetchWikiPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_WIKI_PAGE_ERROR,
    payload: { message },
});

export const fetchHasuraWikiPage = (nctId: string): types.StudyActionTypes => ({
    type: types.FETCH_HASURA_WIKI_PAGE_SEND,
    nctId,
});
export const fetchHasuraWikiPageSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_HASURA_WIKI_PAGE_SUCCESS,
    payload,
});
export const fetchHasuraWikiPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_HASURA_WIKI_PAGE_ERROR,
    payload: { message },
});

export const wikiPageUpdateContentMutation = (
    nctId: any,
    content: string
): types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND,
    nctId,
    content,
});
export const wikiPageUpdateContentMutationSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SUCCESS,
});
export const wikiPageUpdateContentMutationError = (
    message: string
): types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_ERROR,
    payload: { message },
});

export const wikiPageUpdateHasuraMutation = (
    nctId: any,
    text: string,
    isWikiContent: boolean
): types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_HASURA_MUTATION_SEND,
    nctId,
    text,
    isWikiContent,
});
export const wikiPageUpdateHasuraMutationSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_HASURA_MUTATION_SUCCESS,
});
export const wikiPageUpdateHasuraMutationError = (
    message: string
): types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_HASURA_MUTATION_ERROR,
    payload: { message },
});

export const fetchSuggestedLabels = (
    nctId: string,
    crowdKeyArray: any[]
): types.StudyActionTypes => ({
    type: types.FETCH_SUGGESTED_LABELS_SEND,
    nctId,
    crowdKeyArray,
});
export const fetchSuggestedLabelsSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_SUGGESTED_LABELS_SUCCESS,
    payload,
});
export const fetchSuggestedLabelsError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_SUGGESTED_LABELS_ERROR,
    payload: { message },
});
export const fetchReactionsIsland = (
    nctId: string
): types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_ISLAND_SEND,
    nctId,
});
export const fetchReactionsIslandSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_ISLAND_SUCCESS,
    payload,
});
export const fetchReactionsIslandError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_ISLAND_ERROR,
    payload: { message },
});
export const deleteReaction = (
    id: any,
    studyQuery?: any,
    nctId?: any
): types.StudyActionTypes => ({
    type: types.DELETE_REACTION_SEND,
    id,
    studyQuery,
    nctId,
});
export const deleteReactionSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.DELETE_REACTION_SUCCESS,
    payload,
});
export const deleteReactionError = (
    message: string
): types.StudyActionTypes => ({
    type: types.DELETE_REACTION_ERROR,
    payload: { message },
});
export const fetchReactionKinds = (): types.StudyActionTypes => ({
    type: types.FETCH_REACTION_KINDS_SEND,
});
export const fetchReactionKindsSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_REACTION_KINDS_SUCCESS,
    payload,
});
export const fetchReactionKindsError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_REACTION_KINDS_ERROR,
    payload: { message },
});
export const fetchStudyReactions = (nctId: string): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_REACTIONS_SEND,
    nctId,
});
export const fetchStudyReactionsSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_REACTIONS_SUCCESS,
    payload,
});
export const fetchStudyReactionsError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_STUDY_REACTIONS_ERROR,
    payload: { message },
});
export const createReaction = (
    nctId: string,
    reactionKindId: any,
    studyQuery?: any
): types.StudyActionTypes => ({
    type: types.CREATE_REACTION_SEND,
    nctId,
    reactionKindId,
    studyQuery,
});
export const createReactionSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.CREATE_REACTION_SUCCESS,
});
export const createReactionError = (
    message: string
): types.StudyActionTypes => ({
    type: types.CREATE_REACTION_ERROR,
    payload: { message },
});
export const fetchReactionsById = (
    reactionKindId: any
): types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_BY_ID_SEND,
    reactionKindId,
});
export const fetchReactionsByIdSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_BY_ID_SUCCESS,
    payload,
});
export const fetchReactionsByIdError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_BY_ID_ERROR,
    payload: { message },
});
export const upsertReviewFormMutation = (
    id: any,
    nctId: any,
    meta: any,
    content: any
): types.StudyActionTypes => ({
    type: types.UPSERT_REVIEW_FORM_MUTATION_SEND,
    id,
    nctId,
    meta,
    content,
});
export const upsertReviewFormMutationSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.UPSERT_REVIEW_FORM_MUTATION_SUCCESS,
    payload,
});
export const upsertReviewFormMutationError = (
    message: string
): types.StudyActionTypes => ({
    type: types.UPSERT_REVIEW_FORM_MUTATION_ERROR,
    payload: { message },
});
export const fetchEditReview = (nctId: string): types.StudyActionTypes => ({
    type: types.FETCH_EDIT_REVIEW_SEND,
    nctId,
});
export const fetchEditReviewSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_EDIT_REVIEW_SUCCESS,
    payload,
});
export const fetchEditReviewError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_EDIT_REVIEW_ERROR,
    payload: { message },
});
export const updateWorkflowPage = (input: any): types.StudyActionTypes => ({
    type: types.UPDATE_WORKFLOW_PAGE_SEND,
    input,
});
export const updateWorkflowPageSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.UPDATE_WORKFLOW_PAGE_SUCCESS,
});
export const updateWorkflowPageError = (
    message: string
): types.StudyActionTypes => ({
    type: types.UPDATE_WORKFLOW_PAGE_ERROR,
    payload: { message },
});
export const fetchLabels = (variables: string): types.StudyActionTypes => ({
    type: types.FETCH_LABELS_SEND,
    variables,
});
export const fetchLabelsSuccess = (payload: any): types.StudyActionTypes => ({
    type: types.FETCH_LABELS_SUCCESS,
    payload,
});
export const fetchLabelsError = (message: string): types.StudyActionTypes => ({
    type: types.FETCH_LABELS_ERROR,
    payload: { message },
});
export const fetchLabelsBuckets = (
    variables: string,
    QUERY: any
): types.StudyActionTypes => ({
    type: types.FETCH_LABELS_BUCKETS_SEND,
    variables,
    QUERY,
});
export const fetchLabelsBucketsSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.FETCH_LABELS_BUCKETS_SUCCESS,
    payload,
});
export const fetchLabelsBucketsError = (
    message: string
): types.StudyActionTypes => ({
    type: types.FETCH_LABELS_BUCKETS_ERROR,
    payload: { message },
});
export const bulkQueryUpdate = (input: any): types.StudyActionTypes => ({
    type: types.BULK_QUERY_UPDATE_MUTATION_SEND,
    input,
});
export const bulkQueryUpdateSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.BULK_QUERY_UPDATE_MUTATION_SUCCESS,
    payload,
});
export const bulkQueryUpdateError = (
    message: string
): types.StudyActionTypes => ({
    type: types.BULK_QUERY_UPDATE_MUTATION_ERROR,
    payload: { message },
});
export const bulkListUpdate = (input: any): types.StudyActionTypes => ({
    type: types.BULK_LIST_UPDATE_MUTATION_SEND,
    input,
});
export const bulkListUpdateSuccess = (
    payload: any
): types.StudyActionTypes => ({
    type: types.BULK_LIST_UPDATE_MUTATION_SUCCESS,
});
export const bulkListUpdateError = (
    message: string
): types.StudyActionTypes => ({
    type: types.BULK_LIST_UPDATE_MUTATION_ERROR,
    payload: { message },
});
export const setShowLoginModal = (input: any): types.StudyActionTypes => ({
    type: types.SET_SHOW_LOGIN_MODAL,
    input,
});
