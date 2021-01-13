export const FETCH_STUDY_PAGE_SEND = 'FETCH_STUDY_PAGE_SEND';
export const FETCH_STUDY_PAGE_SUCCESS = 'FETCH_STUDY_PAGE_SUCCESS';
export const FETCH_STUDY_PAGE_ERROR = 'FETCH_STUDY_PAGE_ERROR';



export interface StudyState {
    isFetchingStudy: boolean,
    studyPage:  | undefined,

}

export interface SiteDataError {
    message: string
};

export interface FetchStudyPageSendAction {
    type: typeof FETCH_STUDY_PAGE_SEND
};

export interface FetchStudyPageSuccessAction {
    type: typeof FETCH_STUDY_PAGE_SUCCESS,
    payload: any
};

export interface FetchStudyPageErrorAction {
    type: typeof FETCH_STUDY_PAGE_ERROR,
    payload: SiteDataError
};




export type StudyActionTypes = FetchStudyPageSendAction | FetchStudyPageSuccessAction | FetchStudyPageErrorAction;