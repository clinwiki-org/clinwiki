import { CreateStudyViewLogMutation } from './model/CreateStudyViewLogMutation';
import { CreateReaction } from './model/CreateReaction';
import { DeleteReaction } from './model/DeleteReaction';
//import { DeleteReview } from './model/DeleteReviewMutation';
import { PageViewQuery } from './model/PageView';
import { PageViewsQuery } from './model/PageViews';
import { UpdatePageViewInput } from 'services/study/model/InputTypes';
import { SearchStudyPageQuery } from './model/SearchStudyPageQuery';
import { WorkflowPageQuery } from './model/WorkflowPageQuery';
import { CrowdPageQuery } from './model/CrowdPageQuery';
import { ReviewPageQuery } from './model/ReviewPageQuery';
import { StudyEditsHistoryQuery } from './model/StudyEditsHistoryQuery';
import { FacilitiesPageQuery } from './model/FacilitiesPageQuery';
import { WikiPageQuery } from './model/WikiPageQuery';
import { WorkflowsViewProviderQuery } from './model/WorkflowsViewProviderQuery';
import { SuggestedLabelsQuery } from './model/SuggestedLabelsQuery';
import { ReactionsIslandQuery } from './model/ReactionsIslandQuery';
import { ReactionKinds } from './model/ReactionKinds';
import { StudyReactions } from './model/StudyReactions';
import { ReactionsById } from './model/ReactionsById';
import {
    ReviewFormMutation,
    ReviewFormMutationVariables,
} from './model/ReviewFormMutation';
import { EditReviewQuery } from './model/EditReviewQuery';
import { BulkLabelsQuery } from './model/BulkLabelsQuery';

export const FETCH_PAGE_VIEWS_HASURA_SEND = 'FETCH_PAGE_VIEWS_HASURA_SEND';
export const FETCH_PAGE_VIEWS_HASURA_SUCCESS =
    'FETCH_PAGE_VIEWS_HASURA_SUCCESS';
export const FETCH_PAGE_VIEWS_HASURA_ERROR = 'FETCH_PAGE_VIEWS_HASURA_ERROR';

export const FETCH_PAGE_VIEW_HASURA_SEND = 'FETCH_PAGE_VIEW_HASURA_SEND';
export const FETCH_PAGE_VIEW_HASURA_SUCCESS = 'FETCH_PAGE_VIEW_HASURA_SUCCESS';
export const FETCH_PAGE_VIEW_HASURA_ERROR = 'FETCH_PAGE_VIEW_HASURA_ERROR';

export const CREATE_PAGE_VIEW_HASURA_SEND = 'CREATE_PAGE_VIEW_HASURA_SEND';
export const CREATE_PAGE_VIEW_HASURA_SUCCESS =
    'CREATE_PAGE_VIEW_HASURA_SUCCESS';
export const CREATE_PAGE_VIEW_HASURA_ERROR = 'CREATE_PAGE_VIEW_HASURA_ERROR';

export const UPDATE_PAGE_VIEW_HASURA_SEND = 'UPDATE_PAGE_VIEW_HASURA_SEND';
export const UPDATE_PAGE_VIEW_HASURA_SUCCESS =
    'UPDATE_PAGE_VIEW_HASURA_SUCCESS';
export const UPDATE_PAGE_VIEW_HASURA_ERROR = 'UPDATE_PAGE_VIEW_HASURA_ERROR';

export const DELETE_PAGE_VIEW_HASURA_SEND = 'DELETE_PAGE_VIEW_HASURA_SEND';
export const DELETE_PAGE_VIEW_HASURA_SUCCESS =
    'DELETE_PAGE_VIEW_HASURA_SUCCESS';
export const DELETE_PAGE_VIEW_HASURA_ERROR = 'DELETE_PAGE_VIEW_HASURA_ERROR';
//HASURA

export const FETCH_FACILITIES_PAGE_HASURA_SEND =
    'FETCH_FACILITIES_PAGE_HASURA_SEND';
export const FETCH_FACILITIES_PAGE_HASURA_SUCCESS =
    'FETCH_FACILITIES_PAGE_HASURA_SUCCESS';
export const FETCH_FACILITIES_PAGE_HASURA_ERROR =
    'FETCH_FACILITIES_PAGE_HASURA_ERROR';

export const FETCH_SAMPLE_STUDY_SEND = 'FETCH_SAMPLE_STUDY_SEND';
export const FETCH_SAMPLE_STUDY_SUCCESS = 'FETCH_SAMPLE_STUDY_SUCCESS';
export const FETCH_SAMPLE_STUDY_ERROR = 'FETCH_SAMPLE_STUDY_ERROR';

export const FETCH_SAMPLE_STUDY_HASURA_SEND = 'FETCH_SAMPLE_STUDY_HASURA_SEND';
export const FETCH_SAMPLE_STUDY_HASURA_SUCCESS =
    'FETCH_SAMPLE_STUDY_HASURA_SUCCESS';
export const FETCH_SAMPLE_STUDY_HASURA_ERROR =
    'FETCH_SAMPLE_STUDY_HASURA_ERROR';

export const FETCH_STUDY_PAGE_SEND = 'FETCH_STUDY_PAGE_SEND';
export const FETCH_STUDY_PAGE_SUCCESS = 'FETCH_STUDY_PAGE_SUCCESS';
export const FETCH_STUDY_PAGE_ERROR = 'FETCH_STUDY_PAGE_ERROR';

export const FETCH_SEARCH_PAGE_MM_SEND = 'FETCH_SEARCH_PAGE_MM_SEND';
export const FETCH_SEARCH_PAGE_MM_SUCCESS = 'FETCH_SEARCH_PAGE_MM_SUCCESS';
export const FETCH_SEARCH_PAGE_MM_ERROR = 'FETCH_SEARCH_PAGE_MM_ERROR';
export const FETCH_STUDY_PAGE_HASURA_SEND = 'FETCH_STUDY_PAGE_HASURA_SEND';
export const FETCH_STUDY_PAGE_HASURA_SUCCESS =
    'FETCH_STUDY_PAGE_HASURA_SUCCESS';
export const FETCH_STUDY_PAGE_HASURA_ERROR = 'FETCH_STUDY_PAGE_HASURA_ERROR';

export const FETCH_PAGE_VIEWS_SEND = 'FETCH_PAGE_VIEWS_SEND';
export const FETCH_PAGE_VIEWS_SUCCESS = 'FETCH_PAGE_VIEWS_SUCCESS';
export const FETCH_PAGE_VIEWS_ERROR = 'FETCH_PAGE_VIEWS_ERROR';

export const FETCH_PAGE_VIEW_SEND = 'FETCH_PAGE_VIEW_SEND';
export const FETCH_PAGE_VIEW_SUCCESS = 'FETCH_PAGE_VIEW_SUCCESS';
export const FETCH_PAGE_VIEW_ERROR = 'FETCH_PAGE_VIEW_ERROR';

export const UPDATE_STUDY_VIEW_LOG_COUNT_SEND =
    'UPDATE_STUDY_VIEW_LOG_COUNT_SEND';
export const UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS =
    'UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS';
export const UPDATE_STUDY_VIEW_LOG_COUNT_ERROR =
    'UPDATE_STUDY_VIEW_LOG_COUNT_ERROR';

export const CREATE_PAGE_VIEW_SEND = 'CREATE_PAGE_VIEW_SEND';
export const CREATE_PAGE_VIEW_SUCCESS = 'CREATE_PAGE_VIEW_SUCCESS';
export const CREATE_PAGE_VIEW_ERROR = 'CREATE_PAGE_VIEW_ERROR';

export const UPDATE_PAGE_VIEW_SEND = 'UPDATE_PAGE_VIEW_SEND';
export const UPDATE_PAGE_VIEW_SUCCESS = 'UPDATE_PAGE_VIEW_SUCCESS';
export const UPDATE_PAGE_VIEW_ERROR = 'UPDATE_PAGE_VIEW_ERROR';

export const DELETE_PAGE_VIEW_SEND = 'DELETE_PAGE_VIEW_SEND';
export const DELETE_PAGE_VIEW_SUCCESS = 'DELETE_PAGE_VIEW_SUCCESS';
export const DELETE_PAGE_VIEW_ERROR = 'DELETE_PAGE_VIEW_ERROR';

export const FETCH_SEARCH_STUDY_PAGE_SEND = 'FETCH_SEARCH_STUDY_PAGE_SEND';
export const FETCH_SEARCH_STUDY_PAGE_SUCCESS =
    'FETCH_SEARCH_STUDY_PAGE_SUCCESS';
export const FETCH_SEARCH_STUDY_PAGE_ERROR = 'FETCH_SEARCH_STUDY_PAGE_ERROR';

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

export const FETCH_STUDY_EDITS_HISTORY_SEND = 'FETCH_STUDY_EDITS_HISTORY_SEND';
export const FETCH_STUDY_EDITS_HISTORY_SUCCESS =
    'FETCH_STUDY_STUDY_EDITS_HISTORY_SUCCESS';
export const FETCH_STUDY_EDITS_HISTORY_ERROR =
    'FETCH_STUDY_EDITS_HISTORY_ERROR';

export const FETCH_FACILITIES_PAGE_SEND = 'FETCH_FACILITIES_PAGE_SEND';
export const FETCH_FACILITIES_PAGE_SUCCESS = 'FETCH_FACILITIES_PAGE_SUCCESS';
export const FETCH_FACILITIES_PAGE_ERROR = 'FETCH_FACILITIES_PAGE_ERROR';

export const FETCH_WIKI_PAGE_SEND = 'FETCH_WIKI_PAGE_SEND';
export const FETCH_WIKI_PAGE_SUCCESS = 'FETCH_WIKI_PAGE_SUCCESS';
export const FETCH_WIKI_PAGE_ERROR = 'FETCH_WIKI_PAGE_ERROR';

export const FETCH_HASURA_WIKI_PAGE_SEND = 'FETCH_HASURA_WIKI_PAGE_SEND';
export const FETCH_HASURA_WIKI_PAGE_SUCCESS = 'FETCH_HASURA_WIKI_PAGE_SUCCESS';
export const FETCH_HASURA_WIKI_PAGE_ERROR = 'FETCH_HASURA_WIKI_PAGE_ERROR';

export const WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND =
    'WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND';
export const WIKI_PAGE_UPDATE_CONTENT_MUTATION_SUCCESS =
    'WIKI_PAGE_UPDATE_CONTENT_MUTATION_SUCCESS';
export const WIKI_PAGE_UPDATE_CONTENT_MUTATION_ERROR =
    'WIKI_PAGE_UPDATE_CONTENT_MUTATION_ERROR';

export const FETCH_SUGGESTED_LABELS_SEND = 'FETCH_SUGGESTED_LABELS_SEND';
export const FETCH_SUGGESTED_LABELS_SUCCESS = 'FETCH_SUGGESTED_LABELS_SUCCESS';
export const FETCH_SUGGESTED_LABELS_ERROR = 'FETCH_SUGGESTED_LABELS_ERROR';

export const FETCH_ALL_WORKFLOWS_SEND = 'FETCH_ALL_WORKFLOWS_SEND';
export const FETCH_ALL_WORKFLOWS_SUCCESS = 'FETCH_ALL_WORKFLOWS_SUCCESS';
export const FETCH_ALL_WORKFLOWS_ERROR = 'FETCH_ALL_WORKFLOWS_ERROR';

export const FETCH_REACTIONS_ISLAND_SEND = 'FETCH_REACTIONS_ISLAND_SEND';
export const FETCH_REACTIONS_ISLAND_SUCCESS = 'FETCH_REACTIONS_ISLAND_SUCCESS';
export const FETCH_REACTIONS_ISLAND_ERROR = 'FETCH_REACTIONS_ISLAND_ERROR';

export const DELETE_REACTION_SEND = 'DELETE_REACTION_SEND';
export const DELETE_REACTION_SUCCESS = 'DELETE_REACTION_SUCCESS';
export const DELETE_REACTION_ERROR = 'DELETE_REACTION_ERROR';

export const FETCH_REACTION_KINDS_SEND = 'FETCH_REACTION_KINDS_SEND';
export const FETCH_REACTION_KINDS_SUCCESS = 'FETCH_REACTION_KINDS_SUCCESS';
export const FETCH_REACTION_KINDS_ERROR = 'FETCH_REACTION_KINDS_ERROR';

export const FETCH_STUDY_REACTIONS_SEND = 'FETCH_STUDY_REACTIONS_SEND';
export const FETCH_STUDY_REACTIONS_SUCCESS = 'FETCH_STUDY_REACTIONS_SUCCESS';
export const FETCH_STUDY_REACTIONS_ERROR = 'FETCH_STUDY_REACTIONS_ERROR';

export const CREATE_REACTION_SEND = 'CREATE_REACTION';
export const CREATE_REACTION_SUCCESS = 'CREATE_REACTION_SUCCESS';
export const CREATE_REACTION_ERROR = 'CREATE_REACTION_ERROR';

export const FETCH_REACTIONS_BY_ID_SEND = 'FETCH_REACTIONS_BY_ID_SEND';
export const FETCH_REACTIONS_BY_ID_SUCCESS = 'FETCH_REACTIONS_BY_ID_SUCCESS';
export const FETCH_REACTIONS_BY_ID_ERROR = 'FETCH_REACTIONS_BY_ID_ERROR';

export const UPSERT_REVIEW_FORM_MUTATION_SEND =
    'UPSERT_REVIEW_FORM_MUTATION_SEND';
export const UPSERT_REVIEW_FORM_MUTATION_SUCCESS =
    'UPSERT_REVIEW_FORM_MUTATION_SUCCESS';
export const UPSERT_REVIEW_FORM_MUTATION_ERROR =
    'UPSERT_REVIEW_FORM_MUTATION_ERROR';

export const FETCH_EDIT_REVIEW_SEND = 'FETCH_EDIT_REVIEW_SEND';
export const FETCH_EDIT_REVIEW_SUCCESS = 'FETCH_EDIT_REVIEW_SUCCESS';
export const FETCH_EDIT_REVIEW_ERROR = 'FETCH_EDIT_REVIEW_ERROR';

export const UPDATE_WORKFLOW_PAGE_SEND = 'UPDATE_WORKFLOW_PAGE';
export const UPDATE_WORKFLOW_PAGE_SUCCESS = 'UPDATE_WORKFLOW_PAGE_SUCCESS';
export const UPDATE_WORKFLOW_PAGE_ERROR = 'UPDATE_WORKFLOW_PAGE_ERROR';

export const FETCH_LABELS_SEND = 'FETCH_LABELS';
export const FETCH_LABELS_SUCCESS = 'FETCH_LABELS_SUCCESS';
export const FETCH_LABELS_ERROR = 'FETCH_LABELS_ERROR';

export const FETCH_LABELS_BUCKETS_SEND = 'FETCH_LABELS_BUCKETS';
export const FETCH_LABELS_BUCKETS_SUCCESS = 'FETCH_LABELS_BUCKETS_SUCCESS';
export const FETCH_LABELS_BUCKETS_ERROR = 'FETCH_LABELS_BUCKETS_ERROR';

export const SET_SHOW_LOGIN_MODAL = 'SET_SHOW_LOGIN_MODAL';

export const BULK_QUERY_UPDATE_MUTATION_SEND = 'BULK_QUERY_UPDATE_MUTATION';
export const BULK_QUERY_UPDATE_MUTATION_SUCCESS =
    'BULK_QUERY_UPDATE_MUTATION_SUCCESS';
export const BULK_QUERY_UPDATE_MUTATION_ERROR =
    'BULK_QUERY_UPDATE_MUTATION_ERROR';

export const BULK_LIST_UPDATE_MUTATION_SEND = 'BULK_LIST_UPDATE_MUTATION';
export const BULK_LIST_UPDATE_MUTATION_SUCCESS =
    'BULK_LIST_UPDATE_MUTATION_SUCCESS';
export const BULK_LIST_UPDATE_MUTATION_ERROR =
    'BULK_LIST_UPDATE_MUTATION_ERROR';
export interface StudyState {
    isFetchingPageViewsHasura: boolean;
    pageViewsHasura: any | PageViewsQuery | undefined;
    isFetchingPageViewHasura: boolean;
    pageViewHasura: PageViewQuery | undefined;
    isCreatingPageViewHasura: boolean;
    isDeletingPageViewHasura: boolean;
    isUpdatingPageViewHasura: boolean;
    isFetchingFacilitiesPageHasura: boolean;
    facilitiesPageHasura: any | undefined;
    studyPageHasura: any | undefined;
    isFetchingStudyPageHasura: any;
    isFetchingSampleStudy: boolean;
    sampleStudy: any | undefined;
    isFetchingSampleStudyHasura: boolean;
    hasuraSampleStudy: any | undefined;
    isFetchingStudy: boolean;
    studyPage: any | undefined;
    isFetchingPageViews: boolean;
    pageViews: any | PageViewsQuery | undefined;
    isFetchingPageView: boolean;
    pageView: PageViewQuery | undefined;
    isFetchingSearchStudyPage: boolean;
    searchStudyPage: SearchStudyPageQuery | undefined;
    isUpdatingStudyViewLogCount: boolean;
    isCreatingPageView: boolean;
    isDeletingPageView: boolean;
    isUpdatingPageView: boolean;
    isFetchingWorkflow: boolean;
    workflowPage: WorkflowPageQuery | undefined;
    isUpsertingLabel: boolean;
    isDeletingLabel: boolean;
    isFetchingCrowdPage: boolean;
    crowdPage: CrowdPageQuery | undefined;
    isDeletingReview: boolean;
    isFetchingReviewPage: boolean;
    reviewPage: ReviewPageQuery | undefined;
    isFetchingStudyEditsHistory: boolean;
    StudyEditsHistory: StudyEditsHistoryQuery | undefined;
    isFetchingFacilitiesPage: boolean;
    facilitiesPage: FacilitiesPageQuery | undefined;
    isFetchingWikiPage: boolean;
    isWikiPageUpdatingContentMutation: boolean;
    wikiPage: WikiPageQuery | undefined;
    isFetchingHasuraWikiPage: boolean;
    hasuraWikiPage: WikiPageQuery | undefined;
    isFetchingSuggestedLabels: boolean;
    suggestedLabels: SuggestedLabelsQuery | undefined;
    isFetchingAllWorkFlows: boolean;
    allWorkFlows: WorkflowsViewProviderQuery | undefined;
    isFetchingReactionsIsland: boolean;
    reactionsIsland: ReactionsIslandQuery | undefined;
    isDeletingReaction: boolean;
    isFetchingReactionKinds: boolean;
    reactionKinds: ReactionKinds | undefined;
    isFetchingStudyReactions: boolean;
    studyReactions: StudyReactions | undefined;
    isCreatingReaction: boolean;
    isFetchingReactionsById: boolean;
    reactionsById: ReactionsById | undefined;
    isUpsertingReviewForm: boolean;
    isFetchingEditReview: boolean;
    editReview: EditReviewQuery | undefined;
    isUpdatingWorkFlows: boolean;
    isFetchingLabels: boolean;
    workflowLabels: BulkLabelsQuery | undefined;
    isFetchingLabelsBuckets: boolean;
    workflowLabelsBuckets: any | undefined;
    isBulkQueryUpdating: boolean;
    bulkQueryUpdate: any;
    isBulkListUpdating: boolean;
    showLoginModal: boolean;
}

export interface StudyDataError {
    message: string;
}

export interface fetchPageViewsHasuraSendAction {
    type: typeof FETCH_PAGE_VIEWS_HASURA_SEND;
    siteId: any;
}

export interface fetchPageViewsHasuraSuccessAction {
    type: typeof FETCH_PAGE_VIEWS_HASURA_SUCCESS;
    payload: PageViewsQuery;
}

export interface fetchPageViewsHasuraErrorAction {
    type: typeof FETCH_PAGE_VIEWS_HASURA_ERROR;
    payload: StudyDataError;
}
export interface fetchPageViewHasuraSendAction {
    type: typeof FETCH_PAGE_VIEW_HASURA_SEND;
    id: any;
    url: any;
}

export interface fetchPageViewHasuraSuccessAction {
    type: typeof FETCH_PAGE_VIEW_HASURA_SUCCESS;
    payload: PageViewQuery;
}

export interface fetchPageViewHasuraErrorAction {
    type: typeof FETCH_PAGE_VIEW_HASURA_ERROR;
    payload: StudyDataError;
}

export interface CreatePageViewHasuraSendAction {
    type: typeof CREATE_PAGE_VIEW_HASURA_SEND;
    url: string;
    siteId: number;
}

export interface CreatePageViewHasuraSuccessAction {
    type: typeof CREATE_PAGE_VIEW_HASURA_SUCCESS;
    payload: PageViewsQuery;
}

export interface CreatePageViewHasuraErrorAction {
    type: typeof CREATE_PAGE_VIEW_HASURA_ERROR;
    payload: StudyDataError;
}

export interface DeletePageViewHasuraSendAction {
    type: typeof DELETE_PAGE_VIEW_HASURA_SEND;
    id: number;
}

export interface DeletePageViewHasuraSuccessAction {
    type: typeof DELETE_PAGE_VIEW_HASURA_SUCCESS;
    payload: PageViewsQuery;
}

export interface DeletePageViewHasuraErrorAction {
    type: typeof DELETE_PAGE_VIEW_HASURA_ERROR;
    payload: StudyDataError;
}

export interface UpdatePageViewHasuraSendAction {
    type: typeof UPDATE_PAGE_VIEW_HASURA_SEND;
    id?: number;
    input: UpdatePageViewInput;
}

export interface UpdatePageViewHasuraSuccessAction {
    type: typeof UPDATE_PAGE_VIEW_HASURA_SUCCESS;
    payload: PageViewsQuery;
}

export interface UpdatePageViewHasuraErrorAction {
    type: typeof UPDATE_PAGE_VIEW_HASURA_ERROR;
    payload: any;
}
export interface fetchFacilitiesPageHasuraSendAction {
    type: typeof FETCH_FACILITIES_PAGE_HASURA_SEND;
    nctId: any;
}

export interface fetchFacilitiesPageHasuraSuccessAction {
    type: typeof FETCH_FACILITIES_PAGE_HASURA_SUCCESS;
    payload: any;
}

export interface fetchFacilitiesPageHasuraErrorAction {
    type: typeof FETCH_FACILITIES_PAGE_HASURA_ERROR;
    payload: StudyDataError;
}

export interface FetchSampleStudySendAction {
    type: typeof FETCH_SAMPLE_STUDY_SEND;
    nctId: any;
    QUERY: any;
}
export interface FetchSampleStudySuccessAction {
    type: typeof FETCH_SAMPLE_STUDY_SUCCESS;
    payload: any;
}
export interface FetchSampleStudyErrorAction {
    type: typeof FETCH_SAMPLE_STUDY_ERROR;
    payload: StudyDataError;
}
export interface FetchSampleStudyHasuraSendAction {
    type: typeof FETCH_SAMPLE_STUDY_HASURA_SEND;
    nctId: any;
    QUERY: any;
}
export interface FetchSampleStudyHasuraSuccessAction {
    type: typeof FETCH_SAMPLE_STUDY_HASURA_SUCCESS;
    payload: any;
}
export interface FetchSampleStudyHasuraErrorAction {
    type: typeof FETCH_SAMPLE_STUDY_HASURA_ERROR;
    payload: StudyDataError;
}
export interface fetchStudyPageSendAction {
    type: typeof FETCH_STUDY_PAGE_SEND;
    nctId: any;
    QUERY: any;
}

export interface fetchStudyPageSuccessAction {
    type: typeof FETCH_STUDY_PAGE_SUCCESS;
    payload: SearchStudyPageQuery;
}
export interface fetchStudyPageErrorAction {
    type: typeof FETCH_STUDY_PAGE_ERROR;
    payload: StudyDataError;
}
export interface fetchSearchPageMMSendAction {
    type: typeof FETCH_SEARCH_PAGE_MM_SEND;
    params: any;
    QUERY: any;
}

export interface fetchSearchPageMMSuccessAction {
    type: typeof FETCH_SEARCH_PAGE_MM_SUCCESS;
    payload: SearchStudyPageQuery;
}
export interface fetchSearchPageMMErrorAction {
    type: typeof FETCH_SEARCH_PAGE_MM_ERROR;
    payload: StudyDataError;
}

export interface fetchStudyPageHasuraSendAction {
    type: typeof FETCH_STUDY_PAGE_HASURA_SEND;
    nctId: any;
    HASURA_STUDY_QUERY: any;
}

export interface fetchStudyPageHasuraSuccessAction {
    type: typeof FETCH_STUDY_PAGE_HASURA_SUCCESS;
    payload: SearchStudyPageQuery;
}
export interface fetchStudyPageHasuraErrorAction {
    type: typeof FETCH_STUDY_PAGE_HASURA_ERROR;
    payload: StudyDataError;
}

export interface fetchPageViewsSendAction {
    type: typeof FETCH_PAGE_VIEWS_SEND;
    siteId: any;
}

export interface fetchPageViewsSuccessAction {
    type: typeof FETCH_PAGE_VIEWS_SUCCESS;
    payload: PageViewsQuery;
}

export interface fetchPageViewsErrorAction {
    type: typeof FETCH_PAGE_VIEWS_ERROR;
    payload: StudyDataError;
}
export interface fetchPageViewSendAction {
    type: typeof FETCH_PAGE_VIEW_SEND;
    id: any;
    url: any;
}

export interface fetchPageViewSuccessAction {
    type: typeof FETCH_PAGE_VIEW_SUCCESS;
    payload: PageViewQuery;
}

export interface fetchPageViewErrorAction {
    type: typeof FETCH_PAGE_VIEW_ERROR;
    payload: StudyDataError;
}

export interface updateStudyViewLogCountSendAction {
    type: typeof UPDATE_STUDY_VIEW_LOG_COUNT_SEND;
    nctId: any;
}

export interface updateStudyViewLogCountSuccessAction {
    type: typeof UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS;
}

export interface updateStudyViewLogCountErrorAction {
    type: typeof UPDATE_STUDY_VIEW_LOG_COUNT_ERROR;
    payload: StudyDataError;
}

export interface CreatePageViewSendAction {
    type: typeof CREATE_PAGE_VIEW_SEND;
    url: string;
    siteId: number;
}

export interface CreatePageViewSuccessAction {
    type: typeof CREATE_PAGE_VIEW_SUCCESS;
    payload: PageViewsQuery;
}

export interface CreatePageViewErrorAction {
    type: typeof CREATE_PAGE_VIEW_ERROR;
    payload: StudyDataError;
}

export interface DeletePageViewSendAction {
    type: typeof DELETE_PAGE_VIEW_SEND;
    id: number;
}

export interface DeletePageViewSuccessAction {
    type: typeof DELETE_PAGE_VIEW_SUCCESS;
    payload: PageViewsQuery;
}

export interface DeletePageViewErrorAction {
    type: typeof DELETE_PAGE_VIEW_ERROR;
    payload: StudyDataError;
}

export interface UpdatePageViewSendAction {
    type: typeof UPDATE_PAGE_VIEW_SEND;
    id?: number;
    input: UpdatePageViewInput;
}

export interface UpdatePageViewSuccessAction {
    type: typeof UPDATE_PAGE_VIEW_SUCCESS;
    payload: PageViewsQuery;
}

export interface UpdatePageViewErrorAction {
    type: typeof UPDATE_PAGE_VIEW_ERROR;
    payload: StudyDataError;
}
export interface fetchWorkFlowPageSendAction {
    type: typeof FETCH_WORKFLOW_PAGE_SEND;
    nctId: any;
}

export interface fetchWorkFlowPageSuccessAction {
    type: typeof FETCH_WORKFLOW_PAGE_SUCCESS;
    payload: any;
}

export interface fetchWorkFlowPageErrorAction {
    type: typeof FETCH_WORKFLOW_PAGE_ERROR;
    payload: StudyDataError;
}
export interface upsertLabelMutationSendAction {
    type: typeof UPSERT_LABEL_MUTATION_SEND;
    nctId: any;
    key: any;
    value: any;
    studyQuery?: any;
}

export interface upsertLabelMutationSuccessAction {
    type: typeof UPSERT_LABEL_MUTATION_SUCCESS;
    payload: any;
}

export interface upsertLabelMutationErrorAction {
    type: typeof UPSERT_LABEL_MUTATION_ERROR;
    payload: StudyDataError;
}

export interface deleteLabelMutationSendAction {
    type: typeof DELETE_LABEL_MUTATION_SEND;
    nctId: any;
    key: any;
    studyQuery?: any;
}

export interface deleteLabelMutationSuccessAction {
    type: typeof DELETE_LABEL_MUTATION_SUCCESS;
    payload: any;
}

export interface deleteLabelMutationErrorAction {
    type: typeof DELETE_LABEL_MUTATION_ERROR;
    payload: StudyDataError;
}
export interface fetchCrowdPageSendAction {
    type: typeof FETCH_CROWD_PAGE_SEND;
    nctId: any;
}

export interface fetchCrowdPageSuccessAction {
    type: typeof FETCH_CROWD_PAGE_SUCCESS;
    payload: any;
}

export interface fetchCrowdPageErrorAction {
    type: typeof FETCH_CROWD_PAGE_ERROR;
    payload: StudyDataError;
}

export interface deleteReviewMutationSendAction {
    type: typeof DELETE_REVIEW_MUTATION_SEND;
    id: any;
    nctId: any;
}

export interface deleteReviewMutationSuccessAction {
    type: typeof DELETE_REVIEW_MUTATION_SUCCESS;
    payload: any;
}

export interface deleteReviewMutationErrorAction {
    type: typeof DELETE_REVIEW_MUTATION_ERROR;
    payload: StudyDataError;
}
export interface fetchReviewPageSendAction {
    type: typeof FETCH_REVIEW_PAGE_SEND;
    nctId: any;
}

export interface fetchReviewPageSuccessAction {
    type: typeof FETCH_REVIEW_PAGE_SUCCESS;
    payload: any;
}

export interface fetchReviewPageErrorAction {
    type: typeof FETCH_REVIEW_PAGE_ERROR;
    payload: StudyDataError;
}

export interface fetchSearchStudyPageSendAction {
    type: typeof FETCH_SEARCH_STUDY_PAGE_SEND;
    hash: any;
    id: any;
}

export interface fetchSearchStudyPageSuccessAction {
    type: typeof FETCH_SEARCH_STUDY_PAGE_SUCCESS;
    payload: any;
}
export interface fetchSearchStudyPageErrorAction {
    type: typeof FETCH_SEARCH_STUDY_PAGE_ERROR;
    payload: StudyDataError;
}
export interface fetchStudyEditsHistorySendAction {
    type: typeof FETCH_STUDY_EDITS_HISTORY_SEND;
    nctId: string;
}
export interface fetchStudyEditsHistorySuccessAction {
    type: typeof FETCH_STUDY_EDITS_HISTORY_SUCCESS;
    payload: any;
}
export interface fetchStudyEditsHistoryErrorAction {
    type: typeof FETCH_STUDY_EDITS_HISTORY_ERROR;
    payload: StudyDataError;
}

export interface FetchFacilitiesPageSendAction {
    type: typeof FETCH_FACILITIES_PAGE_SEND;
    nctId: any;
}

export interface FetchFacilitiesPageSuccessAction {
    type: typeof FETCH_FACILITIES_PAGE_SUCCESS;
    payload: FacilitiesPageQuery;
}

export interface FetchFacilitiesPageErrorAction {
    type: typeof FETCH_FACILITIES_PAGE_ERROR;
    payload: StudyDataError;
}

export interface fetchWikiPageSendAction {
    type: typeof FETCH_WIKI_PAGE_SEND;
    nctId: any;
}

export interface fetchWikiPageSuccessAction {
    type: typeof FETCH_WIKI_PAGE_SUCCESS;
    payload: any;
}

export interface fetchWikiPageErrorAction {
    type: typeof FETCH_WIKI_PAGE_ERROR;
    payload: StudyDataError;
}

export interface fetchHasuraWikiPageSendAction {
    type: typeof FETCH_HASURA_WIKI_PAGE_SEND;
    nctId: any;
}

export interface fetchHasuraWikiPageSuccessAction {
    type: typeof FETCH_HASURA_WIKI_PAGE_SUCCESS;
    payload: any;
}

export interface fetchHasuraWikiPageErrorAction {
    type: typeof FETCH_HASURA_WIKI_PAGE_ERROR;
    payload: StudyDataError;
}

export interface wikiPageUpdateContentMutationSendAction {
    type: typeof WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND;
    nctId: any;
    content: any;
}

export interface wikiPageUpdateContentMutationSuccessAction {
    type: typeof WIKI_PAGE_UPDATE_CONTENT_MUTATION_SUCCESS;
}

export interface wikiPageUpdateContentMutationErrorAction {
    type: typeof WIKI_PAGE_UPDATE_CONTENT_MUTATION_ERROR;
    payload: StudyDataError;
}

export interface fetchSuggestedLabelsSendAction {
    type: typeof FETCH_SUGGESTED_LABELS_SEND;
    nctId: any;
    // crowdBucketsWanted: any;
}

export interface fetchSuggestedLabelsSuccessAction {
    type: typeof FETCH_SUGGESTED_LABELS_SUCCESS;
    payload: SuggestedLabelsQuery;
}

export interface fetchSuggestedLabelsErrorAction {
    type: typeof FETCH_SUGGESTED_LABELS_ERROR;
    payload: StudyDataError;
}
export interface fetchAllWorkFlowsSendAction {
    type: typeof FETCH_ALL_WORKFLOWS_SEND;
}

export interface fetchAllWorkFlowsSuccessAction {
    type: typeof FETCH_ALL_WORKFLOWS_SUCCESS;
    payload: any;
}

export interface fetchAllWorkFlowsErrorAction {
    type: typeof FETCH_ALL_WORKFLOWS_ERROR;
    payload: StudyDataError;
}
export interface fetchReactionsIslandSendAction {
    type: typeof FETCH_REACTIONS_ISLAND_SEND;
    nctId: any;
}

export interface fetchReactionsIslandSuccessAction {
    type: typeof FETCH_REACTIONS_ISLAND_SUCCESS;
    payload: any;
}

export interface fetchReactionsIslandErrorAction {
    type: typeof FETCH_REACTIONS_ISLAND_ERROR;
    payload: StudyDataError;
}
export interface deleteReactionSendAction {
    type: typeof DELETE_REACTION_SEND;
    id: any;
    studyQuery;
    nctId;
}

export interface deleteReactionSuccessAction {
    type: typeof DELETE_REACTION_SUCCESS;
    payload: any;
}

export interface deleteReactionErrorAction {
    type: typeof DELETE_REACTION_ERROR;
    payload: StudyDataError;
}

export interface fetchReactionKindsSendAction {
    type: typeof FETCH_REACTION_KINDS_SEND;
}

export interface fetchReactionKindsSuccessAction {
    type: typeof FETCH_REACTION_KINDS_SUCCESS;
    payload: any;
}

export interface fetchReactionKindsErrorAction {
    type: typeof FETCH_REACTION_KINDS_ERROR;
    payload: StudyDataError;
}

export interface fetchStudyReactionsSendAction {
    type: typeof FETCH_STUDY_REACTIONS_SEND;
    nctId: any;
}

export interface fetchStudyReactionsSuccessAction {
    type: typeof FETCH_STUDY_REACTIONS_SUCCESS;
    payload: any;
}

export interface fetchStudyReactionsErrorAction {
    type: typeof FETCH_STUDY_REACTIONS_ERROR;
    payload: StudyDataError;
}
export interface createReactionSendAction {
    type: typeof CREATE_REACTION_SEND;
    nctId: any;
    reactionKindId: any;
    studyQuery: any;
}

export interface createReactionSuccessAction {
    type: typeof CREATE_REACTION_SUCCESS;
}

export interface createReactionErrorAction {
    type: typeof CREATE_REACTION_ERROR;
    payload: StudyDataError;
}

export interface FetchReactionsByIdSendAction {
    type: typeof FETCH_REACTIONS_BY_ID_SEND;
    reactionKindId: any;
}
export interface FetchReactionsByIdSuccessAction {
    type: typeof FETCH_REACTIONS_BY_ID_SUCCESS;
    payload: any;
}
export interface FetchReactionsByIdErrorAction {
    type: typeof FETCH_REACTIONS_BY_ID_ERROR;
    payload: StudyDataError;
}

export interface upsertReviewFormMutationSendAction {
    type: typeof UPSERT_REVIEW_FORM_MUTATION_SEND;
    id: any;
    nctId: any;
    meta: any;
    content: any;
}

export interface upsertReviewFormMutationSuccessAction {
    type: typeof UPSERT_REVIEW_FORM_MUTATION_SUCCESS;
    payload: any;
}

export interface upsertReviewFormMutationErrorAction {
    type: typeof UPSERT_REVIEW_FORM_MUTATION_ERROR;
    payload: StudyDataError;
}
export interface FetchEditReviewSendAction {
    type: typeof FETCH_EDIT_REVIEW_SEND;
    nctId: any;
}
export interface FetchEditReviewSuccessAction {
    type: typeof FETCH_EDIT_REVIEW_SUCCESS;
    payload: any;
}
export interface FetchEditReviewErrorAction {
    type: typeof FETCH_EDIT_REVIEW_ERROR;
    payload: StudyDataError;
}
export interface updateWorkflowPageSendAction {
    type: typeof UPDATE_WORKFLOW_PAGE_SEND;
    input: any;
}

export interface updateWorkflowPageSuccessAction {
    type: typeof UPDATE_WORKFLOW_PAGE_SUCCESS;
}

export interface updateWorkflowPageErrorAction {
    type: typeof UPDATE_WORKFLOW_PAGE_ERROR;
    payload: StudyDataError;
}
export interface fetchLabelsSendAction {
    type: typeof FETCH_LABELS_SEND;
    variables: any;
}

export interface fetchLabelsSuccessAction {
    type: typeof FETCH_LABELS_SUCCESS;
    payload: any;
}
export interface fetchLabelsErrorAction {
    type: typeof FETCH_LABELS_ERROR;
    payload: StudyDataError;
}
export interface fetchLabelsBucketsSendAction {
    type: typeof FETCH_LABELS_BUCKETS_SEND;
    variables: any;
    QUERY: any;
}

export interface fetchLabelsBucketsSuccessAction {
    type: typeof FETCH_LABELS_BUCKETS_SUCCESS;
    payload: any;
}
export interface fetchLabelsBucketsErrorAction {
    type: typeof FETCH_LABELS_BUCKETS_ERROR;
    payload: StudyDataError;
}
export interface bulkQueryUpdateSendAction {
    type: typeof BULK_QUERY_UPDATE_MUTATION_SEND;
    input: any;
}

export interface bulkQueryUpdateSuccessAction {
    type: typeof BULK_QUERY_UPDATE_MUTATION_SUCCESS;
    payload: any;
}

export interface bulkQueryUpdateErrorAction {
    type: typeof BULK_QUERY_UPDATE_MUTATION_ERROR;
    payload: StudyDataError;
}

export interface bulkListUpdateSendAction {
    type: typeof BULK_LIST_UPDATE_MUTATION_SEND;
    input: any;
}

export interface bulkListUpdateSuccessAction {
    type: typeof BULK_LIST_UPDATE_MUTATION_SUCCESS;
}

export interface bulkListUpdateErrorAction {
    type: typeof BULK_LIST_UPDATE_MUTATION_ERROR;
    payload: StudyDataError;
}
export interface setShowLoginModalSendAction {
    type: typeof SET_SHOW_LOGIN_MODAL;
    input: any;
}

export type StudyActionTypes =
    | fetchPageViewHasuraSendAction
    | fetchPageViewHasuraSuccessAction
    | fetchPageViewHasuraErrorAction
    | fetchPageViewsHasuraSendAction
    | fetchPageViewsHasuraSuccessAction
    | fetchPageViewsHasuraErrorAction
    | CreatePageViewHasuraSendAction
    | CreatePageViewHasuraSuccessAction
    | CreatePageViewHasuraErrorAction
    | DeletePageViewHasuraSendAction
    | DeletePageViewHasuraSuccessAction
    | DeletePageViewHasuraErrorAction
    | UpdatePageViewHasuraSendAction
    | UpdatePageViewHasuraSuccessAction
    | UpdatePageViewHasuraErrorAction
    | fetchStudyPageSendAction
    | fetchStudyPageSuccessAction
    | fetchStudyPageErrorAction
    | fetchSearchPageMMSendAction
    | fetchSearchPageMMSuccessAction
    | fetchSearchPageMMErrorAction
    | fetchFacilitiesPageHasuraSendAction
    | fetchFacilitiesPageHasuraSuccessAction
    | fetchFacilitiesPageHasuraErrorAction
    | fetchStudyPageSendAction
    | fetchStudyPageSuccessAction
    | fetchStudyPageErrorAction
    | fetchPageViewSendAction
    | fetchPageViewSuccessAction
    | fetchPageViewErrorAction
    | fetchPageViewsSendAction
    | fetchPageViewsSuccessAction
    | fetchPageViewsErrorAction
    | updateStudyViewLogCountSendAction
    | updateStudyViewLogCountSuccessAction
    | updateStudyViewLogCountErrorAction
    | fetchWorkFlowPageSendAction
    | fetchWorkFlowPageSuccessAction
    | fetchWorkFlowPageErrorAction
    | upsertLabelMutationSendAction
    | upsertLabelMutationSuccessAction
    | upsertLabelMutationErrorAction
    | deleteLabelMutationSendAction
    | deleteLabelMutationSuccessAction
    | deleteLabelMutationErrorAction
    | fetchCrowdPageSendAction
    | fetchCrowdPageSuccessAction
    | fetchCrowdPageErrorAction
    | deleteReviewMutationSendAction
    | deleteReviewMutationSuccessAction
    | deleteReviewMutationErrorAction
    | fetchReviewPageSendAction
    | fetchReviewPageSuccessAction
    | fetchReviewPageErrorAction
    | updateStudyViewLogCountSendAction
    | updateStudyViewLogCountSuccessAction
    | updateStudyViewLogCountErrorAction
    | fetchSearchStudyPageSendAction
    | fetchSearchStudyPageSuccessAction
    | fetchSearchStudyPageErrorAction
    | updateStudyViewLogCountSendAction
    | updateStudyViewLogCountSuccessAction
    | updateStudyViewLogCountErrorAction
    | fetchStudyEditsHistorySendAction
    | fetchStudyEditsHistorySuccessAction
    | fetchStudyEditsHistoryErrorAction
    | FetchFacilitiesPageSendAction
    | FetchFacilitiesPageSuccessAction
    | FetchFacilitiesPageErrorAction
    | fetchWikiPageSendAction
    | fetchWikiPageSuccessAction
    | fetchWikiPageErrorAction
    | fetchHasuraWikiPageSendAction
    | fetchHasuraWikiPageSuccessAction
    | fetchHasuraWikiPageErrorAction
    | wikiPageUpdateContentMutationSendAction
    | wikiPageUpdateContentMutationSuccessAction
    | wikiPageUpdateContentMutationErrorAction
    | fetchAllWorkFlowsSendAction
    | fetchAllWorkFlowsSuccessAction
    | fetchAllWorkFlowsErrorAction
    | fetchSuggestedLabelsSendAction
    | fetchSuggestedLabelsSuccessAction
    | fetchSuggestedLabelsErrorAction
    | fetchReactionsIslandSendAction
    | fetchReactionsIslandSuccessAction
    | fetchReactionsIslandErrorAction
    | deleteReactionSendAction
    | deleteReactionSuccessAction
    | deleteReactionErrorAction
    | fetchReactionKindsSendAction
    | fetchReactionKindsSuccessAction
    | fetchReactionKindsErrorAction
    | fetchStudyReactionsSendAction
    | fetchStudyReactionsSuccessAction
    | fetchStudyReactionsErrorAction
    | createReactionSendAction
    | createReactionSuccessAction
    | createReactionErrorAction
    | updateWorkflowPageSendAction
    | updateWorkflowPageSuccessAction
    | updateWorkflowPageErrorAction
    | fetchLabelsSendAction
    | fetchLabelsSuccessAction
    | fetchLabelsErrorAction
    | fetchLabelsBucketsSendAction
    | fetchLabelsBucketsSuccessAction
    | fetchLabelsBucketsErrorAction
    | bulkListUpdateSendAction
    | bulkListUpdateSuccessAction
    | bulkListUpdateErrorAction
    | bulkQueryUpdateSendAction
    | bulkQueryUpdateSuccessAction
    | bulkQueryUpdateErrorAction
    | FetchSampleStudySendAction
    | FetchSampleStudySuccessAction
    | FetchSampleStudyErrorAction
    | updateStudyViewLogCountSendAction
    | updateStudyViewLogCountSuccessAction
    | updateStudyViewLogCountErrorAction
    | CreatePageViewSendAction
    | CreatePageViewSuccessAction
    | CreatePageViewErrorAction
    | DeletePageViewSendAction
    | DeletePageViewSuccessAction
    | DeletePageViewErrorAction
    | UpdatePageViewSendAction
    | UpdatePageViewSuccessAction
    | UpdatePageViewErrorAction
    | FetchReactionsByIdSendAction
    | FetchReactionsByIdSuccessAction
    | FetchReactionsByIdErrorAction
    | upsertReviewFormMutationSendAction
    | upsertReviewFormMutationSuccessAction
    | upsertReviewFormMutationErrorAction
    | FetchEditReviewSendAction
    | FetchEditReviewSuccessAction
    | FetchEditReviewErrorAction
    | FetchSampleStudyHasuraSendAction
    | FetchSampleStudyHasuraSuccessAction
    | FetchSampleStudyHasuraErrorAction
    | fetchStudyPageHasuraSendAction
    | fetchStudyPageHasuraSuccessAction
    | fetchStudyPageHasuraErrorAction
    | setShowLoginModalSendAction;
