import * as types from './types';


export const fetchStudyPage= ( any: any) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_SEND,
    any
});
export const fetchStudyPageSuccess= (payload: any) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_SUCCESS,
    payload
});
export const fetchStudyPageError= (message: string) : types.StudyActionTypes => ({
    type: types.FETCH_STUDY_PAGE_ERROR,
    payload: {message}
});
