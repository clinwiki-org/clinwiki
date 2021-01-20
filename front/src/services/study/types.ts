import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';
import { WorkflowPageQuery } from './model/WorkflowPageQuery';
import { CrowdPageQuery } from './model/CrowdPageQuery';
import { ReviewPageQuery } from './model/ReviewPageQuery';

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

export const FETCH_WORKFLOW_PAGE_SEND = 'FETCH_WORKFLOW_PAGE_SEND';
export const FETCH_WORKFLOW_PAGE_SUCCESS = 'FETCH_WORKFLOW_PAGE_SUCCESS';
export const FETCH_WORKFLOW_PAGE_ERROR = 'FETCH_WORKFLOW_PAGE_ERROR';

export const UPSERT_LABEL_MUTATION_SEND = 'UPSERT_LABEL_MUTATION_SEND';
export const UPSERT_LABEL_MUTATION_SUCCESS = 'UPSERT_LABEL_MUTATION_SUCCESS';
export const UPSERT_LABEL_MUTATION_ERROR = 'UPSERT_LABEL_MUTATION_ERROR';

export const DELETE_LABEL_MUTATION_SEND = 'DELETE_LABEL_MUTATION_SEND';
export const DELETE_LABEL_MUTATION_SUCCESS = 'DELETE_LABEL_MUTATION_SUCCESS';
export const DELETE_LABEL_MUTATION_ERROR = 'DELETE_LABEL_MUTATION_ERROR';

export const FETCH_CROWD_PAGE_SEND = 'FETCH_CROWD_PAGE_SEND';
export const FETCH_CROWD_PAGE_SUCCESS = 'FETCH_CROWD_PAGE_SUCCESS';
export const FETCH_CROWD_PAGE_ERROR = 'FETCH_CROWD_PAGE_ERROR';

export const DELETE_REVIEW_MUTATION_SEND = 'DELETE_REVIEW_MUTATION_SEND';
export const DELETE_REVIEW_MUTATION_SUCCESS = 'DELETE_REVIEW_MUTATION_SUCCESS';
export const DELETE_REVIEW_MUTATION_ERROR = 'DELETE_REVIEW_MUTATION_ERROR';

export const FETCH_REVIEW_PAGE_SEND = 'FETCH_REVIEW_PAGE_SEND';
export const FETCH_REVIEW_PAGE_SUCCESS = 'FETCH_REVIEW_PAGE_SUCCESS';
export const FETCH_REVIEW_PAGE_ERROR = 'FETCH_REVIEW_PAGE_ERROR';

export interface StudyState {
    isFetchingStudy: boolean,
    studyPage: any | undefined,
    isFetchingPageViews: boolean,
    pageViews: PageViewsQuery |undefined,
    isFetchingPageView: boolean,
    pageView: PageViewQuery |undefined,
    isUpdatingStudyViewLogCount: boolean,
    isFetchingWorkflow: boolean,
    workflowPage: WorkflowPageQuery | undefined,
    isUpsertingLabel: boolean,
    isDeletingLabel: boolean,
    isFetchingCrowdPage: boolean,
    crowdPage: CrowdPageQuery | undefined,
    isDeletingReview: boolean,
    isFetchingReviewPage: boolean,
    reviewPage: ReviewPageQuery | undefined,
}

export interface SiteDataError {
    message: string
};

export interface fetchStudyPageSendAction {
    type: typeof FETCH_STUDY_PAGE_SEND
    nctId: any,
    QUERY: any
};

export interface fetchStudyPageSuccessAction {
    type: typeof FETCH_STUDY_PAGE_SUCCESS,
    payload: any
};

export interface fetchStudyPageErrorAction {
    type: typeof FETCH_STUDY_PAGE_ERROR,
    payload: SiteDataError
};
export interface fetchPageViewsSendAction {
    type: typeof FETCH_PAGE_VIEWS_SEND
    siteId: any
};

export interface fetchPageViewsSuccessAction {
    type: typeof FETCH_PAGE_VIEWS_SUCCESS,
    payload: PageViewsQuery
};

export interface fetchPageViewsErrorAction {
    type: typeof FETCH_PAGE_VIEWS_ERROR,
    payload: SiteDataError
};
export interface fetchPageViewSendAction {
    type: typeof FETCH_PAGE_VIEW_SEND
    url: any
};

export interface fetchPageViewSuccessAction {
    type: typeof FETCH_PAGE_VIEW_SUCCESS,
    payload: PageViewQuery
};

export interface fetchPageViewErrorAction {
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
export interface fetchWorkFlowPageSendAction {
    type: typeof FETCH_WORKFLOW_PAGE_SEND
    nctId: any,
};

export interface fetchWorkFlowPageSuccessAction {
    type: typeof FETCH_WORKFLOW_PAGE_SUCCESS,
    payload: any
};

export interface fetchWorkFlowPageErrorAction {
    type: typeof FETCH_WORKFLOW_PAGE_ERROR,
    payload: SiteDataError
};
export interface upsertLabelMutationSendAction {
    type: typeof UPSERT_LABEL_MUTATION_SEND
    nctId: any,
    key: any,
    value: any;
};

export interface upsertLabelMutationSuccessAction {
    type: typeof UPSERT_LABEL_MUTATION_SUCCESS,
    payload: any
};

export interface upsertLabelMutationErrorAction {
    type: typeof UPSERT_LABEL_MUTATION_ERROR,
    payload: SiteDataError
};

export interface deleteLabelMutationSendAction {
    type: typeof DELETE_LABEL_MUTATION_SEND
    nctId: any,
    key: any,
    value: any;
};

export interface deleteLabelMutationSuccessAction {
    type: typeof DELETE_LABEL_MUTATION_SUCCESS,
    payload: any
};

export interface deleteLabelMutationErrorAction {
    type: typeof DELETE_LABEL_MUTATION_ERROR,
    payload: SiteDataError
};
export interface fetchCrowdPageSendAction {
    type: typeof FETCH_CROWD_PAGE_SEND
    nctId: any
};

export interface fetchCrowdPageSuccessAction {
    type: typeof FETCH_CROWD_PAGE_SUCCESS,
    payload: any
};

export interface fetchCrowdPageErrorAction {
    type: typeof FETCH_CROWD_PAGE_ERROR,
    payload: SiteDataError
};

export interface deleteReviewMutationSendAction {
    type: typeof DELETE_REVIEW_MUTATION_SEND
    nctId: any,
};

export interface deleteReviewMutationSuccessAction {
    type: typeof DELETE_REVIEW_MUTATION_SUCCESS,
    payload: any
};

export interface deleteReviewMutationErrorAction {
    type: typeof DELETE_REVIEW_MUTATION_ERROR,
    payload: SiteDataError
};
export interface fetchReviewPageSendAction {
    type: typeof FETCH_REVIEW_PAGE_SEND
    nctId: any,
};

export interface fetchReviewPageSuccessAction {
    type: typeof FETCH_REVIEW_PAGE_SUCCESS,
    payload: any
};

export interface fetchReviewPageErrorAction {
    type: typeof FETCH_REVIEW_PAGE_ERROR,
    payload: SiteDataError
};

export type StudyActionTypes = fetchStudyPageSendAction | fetchStudyPageSuccessAction | fetchStudyPageErrorAction |
fetchPageViewSendAction | fetchPageViewSuccessAction | fetchPageViewErrorAction |
fetchPageViewsSendAction | fetchPageViewsSuccessAction | fetchPageViewsErrorAction |
updateStudyViewLogCountSendAction | updateStudyViewLogCountSuccessAction | updateStudyViewLogCountErrorAction |
fetchWorkFlowPageSendAction | fetchWorkFlowPageSuccessAction | fetchWorkFlowPageErrorAction |
upsertLabelMutationSendAction | upsertLabelMutationSuccessAction | upsertLabelMutationErrorAction |
deleteLabelMutationSendAction | deleteLabelMutationSuccessAction | deleteLabelMutationErrorAction |
fetchCrowdPageSendAction | fetchCrowdPageSuccessAction | fetchCrowdPageErrorAction | deleteReviewMutationSendAction | deleteReviewMutationSuccessAction |
deleteReviewMutationErrorAction | fetchReviewPageSendAction | fetchReviewPageSuccessAction | fetchReviewPageErrorAction;

