import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';
import * as types from './types';


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
export const updateStudyViewLogCountSuccess= (payload: CreateStudyViewLogMutation) : types.StudyActionTypes => ({
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS,
    
});
export const updateStudyViewLogCountError= (message: string) : types.StudyActionTypes => ({
    type: types.UPDATE_STUDY_VIEW_LOG_COUNT_ERROR,
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
export const deleteReviewMutation= ( nctId: any ) : types.StudyActionTypes => ({
    type: types.DELETE_REVIEW_MUTATION_SEND,
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

export const fetchReviewPage= ( nctId: string) : types.StudyActionTypes => ({
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
