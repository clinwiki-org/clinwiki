import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';
import { UpdatePageViewInput, } from 'services/study/model/InputTypes';


export const FETCH_SAMPLE_STUDY_SEND = 'FETCH_SAMPLE_STUDY_SEND';
export const FETCH_SAMPLE_STUDY_SUCCESS = 'FETCH_SAMPLE_STUDY_SUCCESS';
export const FETCH_SAMPLE_STUDY_ERROR = 'FETCH_SAMPLE_STUDY_ERROR';

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

export const CREATE_PAGE_VIEW_SEND = 'CREATE_PAGE_VIEW_SEND';
export const CREATE_PAGE_VIEW_SUCCESS = 'CREATE_PAGE_VIEW_SUCCESS';
export const CREATE_PAGE_VIEW_ERROR = 'CREATE_PAGE_VIEW_ERROR';

export const UPDATE_PAGE_VIEW_SEND = 'UPDATE_PAGE_VIEW_SEND';
export const UPDATE_PAGE_VIEW_SUCCESS = 'UPDATE_PAGE_VIEW_SUCCESS';
export const UPDATE_PAGE_VIEW_ERROR = 'UPDATE_PAGE_VIEW_ERROR';

export const DELETE_PAGE_VIEW_SEND = 'DELETE_PAGE_VIEW_SEND';
export const DELETE_PAGE_VIEW_SUCCESS = 'DELETE_PAGE_VIEW_SUCCESS';
export const DELETE_PAGE_VIEW_ERROR = 'DELETE_PAGE_VIEW_ERROR';

export interface StudyState {
    isFetchingSampleStudy: boolean,
    sampleStudy: any | undefined,
    isFetchingStudy: boolean,
    studyPage: any | undefined,
    isFetchingPageViews: boolean,
    pageViews: any |PageViewsQuery |undefined,
    isFetchingPageView: boolean,
    pageView: PageViewQuery |undefined,
    isUpdatingStudyViewLogCount: boolean,
    isCreatingPageView: boolean,
    isDeletingPageView: boolean,
    isUpdatingPageView: boolean,
}

export interface StudyDataError {
    message: string
};

export interface FetchSampleStudySendAction {
    type: typeof FETCH_SAMPLE_STUDY_SEND
    nctId: any,
}
export interface FetchSampleStudySuccessAction {
    type: typeof FETCH_SAMPLE_STUDY_SUCCESS,
    payload: any
};
export interface FetchSampleStudyErrorAction {
    type: typeof FETCH_SAMPLE_STUDY_ERROR,
    payload: StudyDataError
};
export interface FetchStudyPageSendAction {
    type: typeof FETCH_STUDY_PAGE_SEND
    nctId: any,
    QUERY: any
}
export interface FetchStudyPageSuccessAction {
    type: typeof FETCH_STUDY_PAGE_SUCCESS,
    payload: any
};
export interface FetchStudyPageErrorAction {
    type: typeof FETCH_STUDY_PAGE_ERROR,
    payload: StudyDataError
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
    payload: StudyDataError
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
    payload: StudyDataError
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
    payload: StudyDataError
};


export interface CreatePageViewSendAction {
    type: typeof CREATE_PAGE_VIEW_SEND,
    url: string,
    siteId: number,
}

export interface CreatePageViewSuccessAction {
    type: typeof CREATE_PAGE_VIEW_SUCCESS,
    payload: PageViewsQuery
};

export interface CreatePageViewErrorAction {
    type: typeof CREATE_PAGE_VIEW_ERROR,
    payload: StudyDataError
};

export interface DeletePageViewSendAction {
    type: typeof DELETE_PAGE_VIEW_SEND,
    id: number,
}

export interface DeletePageViewSuccessAction {
    type: typeof DELETE_PAGE_VIEW_SUCCESS,
    payload: PageViewsQuery
    };

export interface DeletePageViewErrorAction {
    type: typeof DELETE_PAGE_VIEW_ERROR,
    payload: StudyDataError
};

export interface UpdatePageViewSendAction {
    type: typeof UPDATE_PAGE_VIEW_SEND,
    id?: number,
    input: UpdatePageViewInput,
}

export interface UpdatePageViewSuccessAction {
    type: typeof UPDATE_PAGE_VIEW_SUCCESS,
    payload: PageViewsQuery
    };

export interface UpdatePageViewErrorAction {
    type: typeof UPDATE_PAGE_VIEW_ERROR,
    payload: StudyDataError
};

export type StudyActionTypes = 
FetchSampleStudySendAction | FetchSampleStudySuccessAction | FetchSampleStudyErrorAction |
FetchStudyPageSendAction | FetchStudyPageSuccessAction | FetchStudyPageErrorAction |
FetchPageViewSendAction | FetchPageViewSuccessAction | FetchPageViewErrorAction |
FetchPageViewsSendAction | FetchPageViewsSuccessAction | FetchPageViewsErrorAction |
updateStudyViewLogCountSendAction | updateStudyViewLogCountSuccessAction | updateStudyViewLogCountErrorAction |
CreatePageViewSendAction | CreatePageViewSuccessAction  | CreatePageViewErrorAction  | 
DeletePageViewSendAction | DeletePageViewSuccessAction | DeletePageViewErrorAction | 
UpdatePageViewSendAction | UpdatePageViewSuccessAction | UpdatePageViewErrorAction
;