import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';
import * as types from './types';
import { UpdatePageViewInput, } from 'services/study/model/InputTypes';



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
