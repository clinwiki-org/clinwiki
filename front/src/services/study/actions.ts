//import { QUERY } from 'queries/SearchStudyPageQuery';
import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';
import { SearchStudyPageQuery } from './model/SearchStudyPageQuery';
import { StudyEditsHistoryQuery } from './model/StudyEditsHistoryQuery';
import { StudyReactions } from './model/StudyReactions';
import * as types from './types';
import { UpdatePageViewInput, } from 'services/study/model/InputTypes';
import { WikiPageUpdateContentMutation } from './model/WikiPageUpdateContentMutation';



export const fetchSampleStudy= ( nctId: string, QUERY: any) : types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_SEND,
    nctId,
    QUERY
});
export const fetchSampleStudySuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_SUCCESS,
    payload
});
export const fetchSampleStudyError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_SAMPLE_STUDY_ERROR,
    payload: {message}
});

export const fetchStudyPage= ( nctId: string, QUERY: any) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_SEND,
    nctId,
    QUERY
});
export const fetchStudyPageSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_SUCCESS,
    payload
});
export const fetchStudyPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_ERROR,
    payload: {message}
});
export const fetchPageViews= ( siteId: any) : types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_SEND,
    siteId
});
export const fetchPageViewsSuccess= (payload: PageViewsQuery) : types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_SUCCESS,
    payload
});
export const fetchPageViewsError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEWS_ERROR,
    payload: {message}
});
export const fetchPageView= ( url: string) : types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_SEND,
    url
});
export const fetchPageViewSuccess= (payload: PageViewQuery) : types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_SUCCESS,
    payload
});
export const fetchPageViewError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_PAGE_VIEW_ERROR,
    payload: {message}
});
export const updateStudyViewLogCount= ( nctId: string,) : types.StudyActionTypes => ({
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND,
    nctId,
});
export const updateStudyViewLogCountSuccess= (payload: CreateStudyViewLogMutation) : types.StudyActionTypes => ({  //! TODO Check this payload
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS,
    
});
export const updateStudyViewLogCountError= (message: string) : types.StudyActionTypes => ({
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_ERROR,
    payload: {message}
});


export const createPageView = ( url: string, siteId: number,) : types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_SEND,
    url,
    siteId
});

export const createPageViewSuccess = (payload: any) : types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_SUCCESS,
    payload
});

export const createPageViewError = (message: string) : types.StudyActionTypes => ({
    type: types.CREATE_PAGE_VIEW_ERROR,
    payload: { message }
});

export const deletePageView = (id: number) : types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_SEND,
    id
});

export const deletePageViewSuccess = (payload: any) : types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_SUCCESS,
    payload
});

export const deletePageViewError = (message: string) : types.StudyActionTypes => ({
    type: types.DELETE_PAGE_VIEW_ERROR,
    payload: { message }
});

export const updatePageView = ( input: UpdatePageViewInput ) : types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_SEND,
   // id,
    input
});

export const updatePageViewSuccess = (payload: any) : types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_SUCCESS,
    payload
});

export const updatePageViewError = (message: string) : types.StudyActionTypes => ({
    type: types.UPDATE_PAGE_VIEW_ERROR,
    payload: { message }
});
export const fetchSearchStudyPage= ( hash: string, id: string) : types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_STUDY_PAGE_SEND,
    hash,
    id,
});
export const fetchSearchStudyPageSuccess= (payload: SearchStudyPageQuery) : types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_STUDY_PAGE_SUCCESS,
    payload
});
export const fetchSearchStudyPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_SEARCH_STUDY_PAGE_ERROR,
    payload: {message}
});
export const fetchWorkFlowPage= ( nctId: string ) : types.StudyActionTypes => ({
    type: types.FETCH_WORKFLOW_PAGE_SEND,
    nctId
});
export const fetchWorkFlowPageSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_WORKFLOW_PAGE_SUCCESS,
    payload
});
export const fetchWorkFlowPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_WORKFLOW_PAGE_ERROR,
    payload: {message}
});
export const fetchAllWorkFlows= () : types.StudyActionTypes => ({
    type: types.FETCH_ALL_WORKFLOWS_SEND,
});
export const fetchAllWorkFlowsSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_ALL_WORKFLOWS_SUCCESS,
    payload
});
export const fetchAllWorkFlowsError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_ALL_WORKFLOWS_ERROR,
    payload: {message}
});
export const upsertLabelMutation= ( nctId: any, key: any, value: any) : types.StudyActionTypes => ({
    type: types.UPSERT_LABEL_MUTATION_SEND,
    nctId,
    key,
    value
});
export const upsertLabelMutationSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.UPSERT_LABEL_MUTATION_SUCCESS,
    payload
});
export const upsertLabelMutationError= (message: string) : types.StudyActionTypes => ({
    type: types.UPSERT_LABEL_MUTATION_ERROR,
    payload: {message}
});
export const deleteLabelMutation= ( nctId: any, key: any, value:any ) : types.StudyActionTypes => ({
    type: types.DELETE_LABEL_MUTATION_SEND,
    nctId,
    key,
    value
});
export const deleteLabelMutationSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.DELETE_LABEL_MUTATION_SUCCESS,
    payload
});
export const deleteLabelMutationError= (message: string) : types.StudyActionTypes => ({
    type: types.DELETE_LABEL_MUTATION_ERROR,
    payload: {message}
});

export const fetchCrowdPage= ( nctId: string) : types.StudyActionTypes => ({
    type: types.FETCH_CROWD_PAGE_SEND,
    nctId,
});
export const fetchCrowdPageSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_CROWD_PAGE_SUCCESS,
    payload
});
export const fetchCrowdPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_CROWD_PAGE_ERROR,
    payload: {message}
});
export const deleteReviewMutation= ( id: any, nctId: any ) : types.StudyActionTypes => ({
    type: types.DELETE_REVIEW_MUTATION_SEND,
    id,
    nctId,
});
export const deleteReviewMutationSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.DELETE_REVIEW_MUTATION_SUCCESS,
    payload
});
export const deleteReviewMutationError= (message: string) : types.StudyActionTypes => ({
    type: types.DELETE_REVIEW_MUTATION_ERROR,
    payload: {message}
});

export const fetchReviewPage= ( nctId: string) : types.StudyActionTypes => (console.log(nctId),{
    type: types.FETCH_REVIEW_PAGE_SEND,
    nctId,
});
export const fetchReviewPageSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_REVIEW_PAGE_SUCCESS,
    payload
});
export const fetchReviewPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_REVIEW_PAGE_ERROR,
    payload: {message}
});
export const fetchStudyEditsHistory = ( nctId: string ) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_EDITS_HISTORY_SEND,
    nctId,
});
export const fetchStudyEditsHistorySuccess= (payload: StudyEditsHistoryQuery) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_EDITS_HISTORY_SUCCESS,
    payload
});
export const fetchStudyEditsHistoryError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_EDITS_HISTORY_ERROR,
    payload: {message}
});
export const fetchFacilitiesPage= ( nctId: string) : types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_SEND,
    nctId,
});
export const fetchFacilitiesPageSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_SUCCESS,
    payload
});
export const fetchFacilitiesPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_FACILITIES_PAGE_ERROR,
    payload: {message}
});
export const fetchWikiPage= ( nctId: string) : types.StudyActionTypes => ({
    type: types.FETCH_WIKI_PAGE_SEND,
    nctId,
});
export const fetchWikiPageSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_WIKI_PAGE_SUCCESS,
    payload
});
export const fetchWikiPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_WIKI_PAGE_ERROR,
    payload: {message}
});
export const wikiPageUpdateContentMutation= ( nctId: any, content: string) : types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND,
    nctId,
    content 
});
export const wikiPageUpdateContentMutationSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SUCCESS,
});
export const wikiPageUpdateContentMutationError= (message: string) : types.StudyActionTypes => ({
    type: types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_ERROR,
    payload: {message}
});
export const fetchSuggestedLabels= ( nctId: string, crowdBucketsWanted: string[]) : types.StudyActionTypes => ({
    type: types.FETCH_SUGGESTED_LABELS_SEND,
    nctId,
    crowdBucketsWanted
});
export const fetchSuggestedLabelsSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_SUGGESTED_LABELS_SUCCESS,
    payload
});
export const fetchSuggestedLabelsError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_SUGGESTED_LABELS_ERROR,
    payload: {message}
});
export const fetchReactionsIsland= ( nctId: string) : types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_ISLAND_SEND,
    nctId,
});
export const fetchReactionsIslandSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_ISLAND_SUCCESS,
    payload
});
export const fetchReactionsIslandError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_REACTIONS_ISLAND_ERROR,
    payload: {message}
});
export const deleteReaction= ( id: any ) : types.StudyActionTypes => ({
    type: types.DELETE_REACTION_SEND,
    id,
});
export const deleteReactionSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.DELETE_REACTION_SUCCESS,
    payload
});
export const deleteReactionError= (message: string) : types.StudyActionTypes => ({
    type: types.DELETE_REACTION_ERROR,
    payload: {message}
});

export const fetchReactionKinds= () : types.StudyActionTypes => ({
    type: types.FETCH_REACTION_KINDS_SEND,
});
export const fetchReactionKindsSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_REACTION_KINDS_SUCCESS,
    payload
});
export const fetchReactionKindsError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_REACTION_KINDS_ERROR,
    payload: {message}
});
export const fetchStudyReactions= (nctId: string) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_REACTIONS_SEND,
    nctId,
});
export const fetchStudyReactionsSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_REACTIONS_SUCCESS,
    payload
});
export const fetchStudyReactionsError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_REACTIONS_ERROR,
    payload: {message}
});
export const createReaction= ( nctId: string, reactionKindId: any) : types.StudyActionTypes => ({
    type: types.CREATE_REACTION_SEND,
    nctId,
    reactionKindId,
});
export const createReactionSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.CREATE_REACTION_SUCCESS,

});
export const createReactionError= (message: string) : types.StudyActionTypes => ({
    type: types.CREATE_REACTION_ERROR,
    payload: {message}
});
export const upsertReviewFormMutation= ( id: any, nctId: any, meta: any, content: any) : types.StudyActionTypes => ({
    type: types.UPSERT_REVIEW_FORM_MUTATION_SEND,
    id,
    nctId,
    meta,
    content
});
export const upsertReviewFormMutationSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.UPSERT_REVIEW_FORM_MUTATION_SUCCESS,
    payload
});
export const upsertReviewFormMutationError= (message: string) : types.StudyActionTypes => ({
    type: types.UPSERT_REVIEW_FORM_MUTATION_ERROR,
    payload: {message}
});
export const fetchEditReview= (nctId: string) : types.StudyActionTypes => ({
    type: types.FETCH_EDIT_REVIEW_SEND,
    nctId,
});
export const fetchEditReviewSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_EDIT_REVIEW_SUCCESS,
    payload
});
export const fetchEditReviewError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_EDIT_REVIEW_ERROR,
    payload: {message}
});
