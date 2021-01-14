import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';

export const FETCH_STUDY_PAGE_SEND = 'FETCH_STUDY_PAGE_SEND';
export const FETCH_STUDY_PAGE_SUCCESS = 'FETCH_STUDY_PAGE_SUCCESS';
export const FETCH_STUDY_PAGE_ERROR = 'FETCH_STUDY_PAGE_ERROR';

export const FETCH_PAGE_VIEWS_SEND = 'FETCH_PAGE_VIEWS_SEND';
export const FETCH_PAGE_VIEWS_SUCCESS = 'FETCH_PAGE_VIEWS_SUCCESS';
export const FETCH_PAGE_VIEWS_ERROR = 'FETCH_PAGE_VIEWS_ERROR';

export const FETCH_PAGE_VIEW_SEND = 'FETCH_PAGE_VIEW_SEND';
export const FETCH_PAGE_VIEW_SUCCESS = 'FETCH_PAGE_VIEW_SUCCESS';
export const FETCH_PAGE_VIEW_ERROR = 'FETCH_PAGE_VIEW_ERROR';

export const UPDATE_STUDY_VIEW_LOG_COUNT_SEND = 'UPDATE_STUDY_VIEW_LOG_COUNT_SEND';
export const UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS = 'UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS';
export const UPDATE_STUDY_VIEW_LOG_COUNT_ERROR = 'UPDATE_STUDY_VIEW_LOG_COUNT_ERROR';

export interface StudyState {
    isFetchingStudy: boolean,
    studyPage: any | undefined,
    isFetchingPageViews: boolean,
    pageViews: PageViewsQuery |undefined,
    isFetchingPageView: boolean,
    pageView: PageViewQuery |undefined,
    isUpdatingStudyViewLogCount: boolean,
    

}

export interface SiteDataError {
    message: string
};

export interface FetchStudyPageSendAction {
    type: typeof FETCH_STUDY_PAGE_SEND
    nctId: any,
    QUERY: any
};

export interface FetchStudyPageSuccessAction {
    type: typeof FETCH_STUDY_PAGE_SUCCESS,
    payload: any
};

export interface FetchStudyPageErrorAction {
    type: typeof FETCH_STUDY_PAGE_ERROR,
    payload: SiteDataError
};
export interface FetchPageViewsSendAction {
    type: typeof FETCH_PAGE_VIEWS_SEND
    siteId: any
};

export interface FetchPageViewsSuccessAction {
    type: typeof FETCH_PAGE_VIEWS_SUCCESS,
    payload: PageViewsQuery
};

export interface FetchPageViewsErrorAction {
    type: typeof FETCH_PAGE_VIEWS_ERROR,
    payload: SiteDataError
};
export interface FetchPageViewSendAction {
    type: typeof FETCH_PAGE_VIEW_SEND
    url: any
};

export interface FetchPageViewSuccessAction {
    type: typeof FETCH_PAGE_VIEW_SUCCESS,
    payload: PageViewQuery
};

export interface FetchPageViewErrorAction {
    type: typeof FETCH_PAGE_VIEW_ERROR,
    payload: SiteDataError
};

export interface updateStudyViewLogCountSendAction {
    type: typeof UPDATE_STUDY_VIEW_LOG_COUNT_SEND
    nctId: any,
};

export interface updateStudyViewLogCountSuccessAction {
    type: typeof UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS,
};

export interface updateStudyViewLogCountErrorAction {
    type: typeof UPDATE_STUDY_VIEW_LOG_COUNT_ERROR,
    payload: SiteDataError
};

export type StudyActionTypes = FetchStudyPageSendAction | FetchStudyPageSuccessAction | FetchStudyPageErrorAction |
FetchPageViewSendAction | FetchPageViewSuccessAction | FetchPageViewErrorAction |
FetchPageViewsSendAction | FetchPageViewsSuccessAction | FetchPageViewsErrorAction |
updateStudyViewLogCountSendAction | updateStudyViewLogCountSuccessAction | updateStudyViewLogCountErrorAction;