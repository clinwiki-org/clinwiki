import * as types from './types';

const initialState: types.StudyState = {
    isFetchingStudy: false,
    studyPage: undefined,
    isFetchingPageViews: false,
    pageViews: undefined,
    isFetchingPageView: false,
    pageView: undefined,
    isUpdatingStudyViewLogCount: false,
    isCreatingPageView: false,
    isUpdatingPageView: false,
    isDeletingPageView: false,
};

const studyReducer = ( state = initialState, action: types.StudyActionTypes) : types.StudyState => {
    switch(action.type) {
        case types.FETCH_PAGE_VIEWS_SEND:
            return {
                ...state,
                isFetchingStudy: true
            };
        case types.FETCH_STUDY_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingStudy: false,
                studyPage: action.payload
            };
        case types.FETCH_STUDY_PAGE_ERROR:
            return {
                ...state,
                isFetchingStudy: false
            };
        case types.FETCH_PAGE_VIEWS_SEND:
            return {
                ...state,
                isFetchingPageViews: true
            };
        case types.FETCH_PAGE_VIEWS_SUCCESS:
            return {
                ...state,
                isFetchingPageViews: false,
                pageViews: action.payload
            };
        case types.FETCH_PAGE_VIEWS_ERROR:
            return {
                ...state,
                isFetchingPageViews: false
            };
        case types.FETCH_PAGE_VIEW_SEND:
            return {
                ...state,
                isFetchingPageView: true
            };
        case types.FETCH_PAGE_VIEW_SUCCESS:
            return {
                ...state,
                isFetchingPageViews: false,
                pageView: action.payload
            };
        case types.FETCH_PAGE_VIEW_ERROR:
            return {
                ...state,
                isFetchingPageView: false
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND:
            return {
                ...state,
                isUpdatingStudyViewLogCount: true
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS:
            return {
                ...state,
                isUpdatingStudyViewLogCount: false,
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_ERROR:
            return {
                ...state,
                isUpdatingStudyViewLogCount: false
            };
            
        case types.CREATE_PAGE_VIEW_SEND:
            return {
                ...state,
                isCreatingPageView: true
            };
        case types.CREATE_PAGE_VIEW_SUCCESS:
            return {
                ...state,
                isCreatingPageView: false,
                pageViews: action.payload
            };
        case types.CREATE_PAGE_VIEW_ERROR:
            return {
                ...state,
                isCreatingPageView: false
            };

        case types.DELETE_PAGE_VIEW_SEND:
            return {
                ...state,
                isDeletingPageView: true
            };
        case types.DELETE_PAGE_VIEW_SUCCESS:
            return {
                ...state,
                isDeletingPageView: false,
                pageViews: {               
                    ...state.pageViews,
                    data: {
                        ...state.pageViews.data,
                        site: { 
                            ...state.pageViews.data.site,
                            pageViews: action.payload
                        }
                    }              
                }   
            };
        case types.DELETE_PAGE_VIEW_ERROR:
            return {
                ...state,
                isDeletingPageView: false
            };

        case types.UPDATE_PAGE_VIEW_SEND:
            return {
                ...state,
                isUpdatingPageView: true
            };
        case types.UPDATE_PAGE_VIEW_SUCCESS:            
            return {
                ...state,
                isUpdatingPageView: false,
                pageViews: action.payload
            };
        case types.UPDATE_PAGE_VIEW_ERROR:
            return {
                ...state,
                isUpdatingPageView: false
            };

                
        default:
            return {...state};
    }
}

export default studyReducer;