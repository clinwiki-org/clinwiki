import * as types from './types';

const initialState: types.StudyState = {
    studyPageHasura: undefined,
    isFetchingStudyPageHasura: false,
    isFetchingSampleStudy: false,
    sampleStudy: undefined,
    isFetchingSampleStudyHasura: false,
    hasuraSampleStudy: undefined,
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
    isFetchingSearchStudyPage: false,
    searchStudyPage: undefined,
    isFetchingWorkflow: false,
    workflowPage: undefined,
    isUpsertingLabel: false,
    isDeletingLabel: false,
    isFetchingCrowdPage: false,
    crowdPage: undefined,
    isDeletingReview: false,
    isFetchingReviewPage: false,
    reviewPage: undefined,
    isFetchingStudyEditsHistory: false,
    StudyEditsHistory: undefined,
    isFetchingFacilitiesPage: false,
    facilitiesPage: undefined,
    isFetchingWikiPage: false,
    wikiPage: undefined,
    isWikiPageUpdatingContentMutation: false,
    isFetchingSuggestedLabels: false,
    suggestedLabels: undefined,
    isFetchingAllWorkFlows: false,
    allWorkFlows: undefined,
    isFetchingReactionsIsland: false,
    reactionsIsland: undefined,
    isDeletingReaction: false,
    isFetchingReactionKinds: false,
    reactionKinds: undefined,
    isFetchingStudyReactions: false,
    studyReactions: undefined,
    isCreatingReaction: false,
    isUpdatingWorkFlows: false,
    isFetchingLabels: false,
    workflowLabels: undefined,
    isFetchingLabelsBuckets: false,
    workflowLabelsBuckets: undefined,
    isBulkQueryUpdating: false,
    bulkQueryUpdate: undefined,
    isBulkListUpdating: false,
    isFetchingReactionsById: false,
    reactionsById: undefined,
    isUpsertingReviewForm: false,
    isFetchingEditReview: false,
    editReview: undefined,
};

const studyReducer = (
    state = initialState,
    action: types.StudyActionTypes
): types.StudyState => {
    switch (action.type) {
        case types.FETCH_SAMPLE_STUDY_HASURA_SEND:
            return {
                ...state,
                isFetchingSampleStudyHasura: true,
            };
        case types.FETCH_SAMPLE_STUDY_HASURA_SUCCESS:
            return {
                ...state,
                isFetchingSampleStudyHasura: false,
                hasuraSampleStudy: action.payload,
            };
        case types.FETCH_SAMPLE_STUDY_HASURA_ERROR:
            return {
                ...state,
                isFetchingSampleStudyHasura: false,
            };
        case types.FETCH_SAMPLE_STUDY_SEND:
            return {
                ...state,
                isFetchingSampleStudy: true,
            };
        case types.FETCH_SAMPLE_STUDY_SUCCESS:
            return {
                ...state,
                isFetchingSampleStudy: false,
                sampleStudy: action.payload,
            };
        case types.FETCH_SAMPLE_STUDY_ERROR:
            return {
                ...state,
                isFetchingSampleStudy: false,
            };
        case types.FETCH_STUDY_PAGE_SEND:
            return {
                ...state,
                isFetchingStudy: true,
            };
        case types.FETCH_STUDY_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingStudy: false,
                studyPage: action.payload,
            };
        case types.FETCH_STUDY_PAGE_ERROR:
            return {
                ...state,
                isFetchingStudy: false,
            };

        case types.FETCH_STUDY_PAGE_HASURA_SEND:
            return {
                ...state,
                isFetchingStudy: true,
            };
        case types.FETCH_STUDY_PAGE_HASURA_SUCCESS:
            return {
                ...state,
                isFetchingStudy: false,
                studyPageHasura: action.payload,
            };
        case types.FETCH_STUDY_PAGE_HASURA_ERROR:
            return {
                ...state,
                isFetchingStudy: false,
            };
        case types.FETCH_STUDY_PAGE_HASH_SEND:
            return {
                ...state,
                isFetchingStudy: true,
            };
        case types.FETCH_STUDY_PAGE_HASH_SUCCESS:
            return {
                ...state,
                isFetchingStudy: false,
                studyPage: action.payload,
            };
        case types.FETCH_STUDY_PAGE_HASH_ERROR:
            return {
                ...state,
                isFetchingStudy: false
            };
        case types.FETCH_PAGE_VIEWS_SEND:
            return {
                ...state,
                isFetchingPageViews: true,
            };
        case types.FETCH_PAGE_VIEWS_SUCCESS:
            return {
                ...state,
                isFetchingPageViews: false,
                pageViews: action.payload,
            };
        case types.FETCH_PAGE_VIEWS_ERROR:
            return {
                ...state,
                isFetchingPageViews: false,
            };
        case types.FETCH_PAGE_VIEW_SEND:
            return {
                ...state,
                isFetchingPageView: true,
            };
        case types.FETCH_PAGE_VIEW_SUCCESS:
            return {
                ...state,
                isFetchingPageView: false,
                pageView: action.payload,
            };
        case types.FETCH_PAGE_VIEW_ERROR:
            return {
                ...state,
                isFetchingPageView: false,
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_SEND:
            return {
                ...state,
                isUpdatingStudyViewLogCount: true,
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_SUCCESS:
            return {
                ...state,
                isUpdatingStudyViewLogCount: false,
            };
        case types.UPDATE_STUDY_VIEW_LOG_COUNT_ERROR:
            return {
                ...state,
                isUpdatingStudyViewLogCount: false,
            };

        case types.CREATE_PAGE_VIEW_SEND:
            return {
                ...state,
                isCreatingPageView: true,
            };
        case types.CREATE_PAGE_VIEW_SUCCESS:
            return {
                ...state,
                isCreatingPageView: false,
                pageViews: action.payload,
            };
        case types.CREATE_PAGE_VIEW_ERROR:
            return {
                ...state,
                isCreatingPageView: false,
            };

        case types.DELETE_PAGE_VIEW_SEND:
            return {
                ...state,
                isDeletingPageView: true,
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
                            pageViews: action.payload,
                        },
                    },
                },
            };
        case types.DELETE_PAGE_VIEW_ERROR:
            return {
                ...state,
                isDeletingPageView: false,
            };

        case types.UPDATE_PAGE_VIEW_SEND:
            return {
                ...state,
                isUpdatingPageView: true,
            };
        case types.UPDATE_PAGE_VIEW_SUCCESS:
            return {
                ...state,
                isUpdatingPageView: false,
            };
        case types.UPDATE_PAGE_VIEW_ERROR:
            return {
                ...state,
                isUpdatingPageView: false,
            };

        case types.FETCH_SEARCH_STUDY_PAGE_SEND:
            return {
                ...state,
                isFetchingSearchStudyPage: true,
            };
        case types.FETCH_SEARCH_STUDY_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingSearchStudyPage: false,
                searchStudyPage: action.payload,
            };
        case types.FETCH_SEARCH_STUDY_PAGE_ERROR:
            return {
                ...state,
                isFetchingSearchStudyPage: false,
            };
        case types.FETCH_WORKFLOW_PAGE_SEND:
            return {
                ...state,
                isFetchingWorkflow: true,
            };
        case types.FETCH_WORKFLOW_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingWorkflow: false,
                workflowPage: action.payload,
            };
        case types.FETCH_WORKFLOW_PAGE_ERROR:
            return {
                ...state,
                isFetchingWorkflow: false,
            };
        case types.FETCH_CROWD_PAGE_SEND:
            return {
                ...state,
                isFetchingCrowdPage: true,
            };
        case types.FETCH_CROWD_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingCrowdPage: false,
                crowdPage: action.payload,
            };
        case types.FETCH_CROWD_PAGE_ERROR:
            return {
                ...state,
                isFetchingCrowdPage: false,
            };
        case types.FETCH_REVIEW_PAGE_SEND:
            return {
                ...state,
                isFetchingReviewPage: true,
            };
        case types.FETCH_REVIEW_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingReviewPage: false,
                reviewPage: action.payload,
            };
        case types.FETCH_REVIEW_PAGE_ERROR:
            return {
                ...state,
                isFetchingReviewPage: false,
            };
        case types.FETCH_STUDY_EDITS_HISTORY_SEND:
            return {
                ...state,
                isFetchingStudyEditsHistory: true,
            };
        case types.FETCH_STUDY_EDITS_HISTORY_SUCCESS:
            return {
                ...state,
                isFetchingStudyEditsHistory: false,
                StudyEditsHistory: action.payload,
            };
        case types.FETCH_STUDY_EDITS_HISTORY_ERROR:
            return {
                ...state,
                isFetchingStudyEditsHistory: false,
            };
        case types.FETCH_FACILITIES_PAGE_SEND:
            return {
                ...state,
                isFetchingFacilitiesPage: true,
            };
        case types.FETCH_FACILITIES_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingFacilitiesPage: false,
                facilitiesPage: action.payload,
            };
        case types.FETCH_FACILITIES_PAGE_ERROR:
            return {
                ...state,
                isFetchingFacilitiesPage: false,
            };
        case types.FETCH_WIKI_PAGE_SEND:
            return {
                ...state,
                isFetchingWikiPage: true,
            };
        case types.FETCH_WIKI_PAGE_SUCCESS:
            return {
                ...state,
                isFetchingWikiPage: false,
                wikiPage: action.payload,
            };
        case types.FETCH_WIKI_PAGE_ERROR:
            return {
                ...state,
                isFetchingWikiPage: false,
            };

        case types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SEND:
            return {
                ...state,
                isWikiPageUpdatingContentMutation: true,
            };
        case types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_SUCCESS:
            return {
                ...state,
                isWikiPageUpdatingContentMutation: false,
            };
        case types.WIKI_PAGE_UPDATE_CONTENT_MUTATION_ERROR:
            return {
                ...state,
                isWikiPageUpdatingContentMutation: false,
            };
        case types.FETCH_SUGGESTED_LABELS_SEND:
            return {
                ...state,
                isFetchingSuggestedLabels: true,
            };
        case types.FETCH_SUGGESTED_LABELS_SUCCESS:
            return {
                ...state,
                isFetchingSuggestedLabels: false,
                suggestedLabels: action.payload,
            };
        case types.FETCH_SUGGESTED_LABELS_ERROR:
            return {
                ...state,
                isFetchingSuggestedLabels: false,
            };
        case types.FETCH_ALL_WORKFLOWS_SEND:
            return {
                ...state,
                isFetchingAllWorkFlows: true,
            };
        case types.FETCH_ALL_WORKFLOWS_SUCCESS:
            return {
                ...state,
                isFetchingAllWorkFlows: false,
                allWorkFlows: action.payload,
            };
        case types.FETCH_ALL_WORKFLOWS_ERROR:
            return {
                ...state,
                isFetchingAllWorkFlows: false,
            };
        case types.FETCH_REACTIONS_ISLAND_SEND:
            return {
                ...state,
                isFetchingReactionsIsland: true,
            };
        case types.FETCH_REACTIONS_ISLAND_SUCCESS:
            //console.log(action.payload);
            return {
                ...state,
                isFetchingReactionsIsland: false,
                reactionsIsland: action.payload,
            };
        case types.FETCH_REACTIONS_ISLAND_ERROR:
            return {
                ...state,
                isFetchingReactionsIsland: false,
            };
        case types.FETCH_REACTION_KINDS_SEND:
            return {
                ...state,
                isFetchingReactionKinds: true,
            };
        case types.FETCH_REACTION_KINDS_SUCCESS:
            return {
                ...state,
                isFetchingReactionKinds: false,
                reactionKinds: action.payload,
            };
        case types.FETCH_REACTION_KINDS_ERROR:
            return {
                ...state,
                isFetchingReactionKinds: false,
            };
        case types.FETCH_STUDY_REACTIONS_SEND:
            return {
                ...state,
                isFetchingStudyReactions: true,
            };
        case types.FETCH_STUDY_REACTIONS_SUCCESS:
            return {
                ...state,
                isFetchingStudyReactions: false,
                studyReactions: action.payload,
            };
        case types.FETCH_STUDY_REACTIONS_ERROR:
            return {
                ...state,
                isFetchingStudyReactions: false,
            };
        case types.UPSERT_LABEL_MUTATION_SEND:
            return {
                ...state,
                isUpsertingLabel: true,
            };
        case types.UPSERT_LABEL_MUTATION_SUCCESS:
            return {
                ...state,
                isUpsertingLabel: false,
            };
        case types.UPSERT_LABEL_MUTATION_ERROR:
            return {
                ...state,
                isUpsertingLabel: false,
            };
        case types.DELETE_LABEL_MUTATION_SEND:
            return {
                ...state,
                isDeletingLabel: true,
            };
        case types.DELETE_LABEL_MUTATION_SUCCESS:
            return {
                ...state,
                isDeletingLabel: false,
            };
        case types.DELETE_LABEL_MUTATION_ERROR:
            return {
                ...state,
                isDeletingLabel: false,
            };
        case types.DELETE_REVIEW_MUTATION_SEND:
            return {
                ...state,
                isDeletingReview: true,
            };
        case types.DELETE_REVIEW_MUTATION_SUCCESS:
            return {
                ...state,
                isDeletingReview: false,
            };
        case types.DELETE_REVIEW_MUTATION_ERROR:
            return {
                ...state,
                isDeletingReview: false,
            };
        case types.DELETE_REACTION_SEND:
            return {
                ...state,
                isDeletingReaction: true,
            };
        case types.DELETE_REACTION_SUCCESS:
            return {
                ...state,
                isDeletingReaction: false,
            };
        case types.DELETE_REACTION_ERROR:
            return {
                ...state,
                isDeletingReaction: false,
            };
        case types.CREATE_REACTION_SEND:
            return {
                ...state,
                isCreatingReaction: true,
            };
        case types.CREATE_REACTION_SUCCESS:
            return {
                ...state,
                isCreatingReaction: false,
            };
        case types.CREATE_REACTION_ERROR:
            return {
                ...state,
                isCreatingReaction: false,
            };

        case types.FETCH_REACTIONS_BY_ID_SEND:
            return {
                ...state,
                isFetchingReactionsById: true,
            };
        case types.FETCH_REACTIONS_BY_ID_SUCCESS:
            //console.log(action.payload);
            return {
                ...state,
                isFetchingReactionsById: false,
                reactionsById: action.payload,
            };
        case types.FETCH_REACTIONS_BY_ID_ERROR:
            return {
                ...state,
                isFetchingReactionsById: false,
            };
        case types.UPSERT_REVIEW_FORM_MUTATION_SEND:
            return {
                ...state,
                isUpsertingReviewForm: true,
            };
        case types.UPSERT_REVIEW_FORM_MUTATION_SUCCESS:
            return {
                ...state,
                isUpsertingReviewForm: false,
            };
        case types.UPSERT_REVIEW_FORM_MUTATION_ERROR:
            return {
                ...state,
                isUpsertingReviewForm: false,
            };
        case types.FETCH_EDIT_REVIEW_SEND:
            return {
                ...state,
                isFetchingEditReview: true,
            };
        case types.FETCH_EDIT_REVIEW_SUCCESS:
            return {
                ...state,
                isFetchingEditReview: false,
                editReview: action.payload,
            };
        case types.FETCH_EDIT_REVIEW_ERROR:
            return {
                ...state,
                isFetchingEditReview: false,
            };
        case types.UPDATE_WORKFLOW_PAGE_SEND:
            return {
                ...state,
                isUpdatingWorkFlows: true,
            };
        case types.UPDATE_WORKFLOW_PAGE_SUCCESS:
            return {
                ...state,
                isUpdatingWorkFlows: false,
            };
        case types.UPDATE_WORKFLOW_PAGE_ERROR:
            return {
                ...state,
                isUpdatingWorkFlows: false,
            };
        case types.FETCH_LABELS_SEND:
            return {
                ...state,
                isFetchingLabels: true,
            };
        case types.FETCH_LABELS_SUCCESS:
            return {
                ...state,
                isFetchingLabels: false,
                workflowLabels: action.payload,
            };
        case types.FETCH_LABELS_ERROR:
            return {
                ...state,
                isFetchingLabels: false,
            };
        case types.FETCH_LABELS_BUCKETS_SEND:
            return {
                ...state,
                isFetchingLabelsBuckets: true,
            };
        case types.FETCH_LABELS_BUCKETS_SUCCESS:
            return {
                ...state,
                isFetchingLabelsBuckets: false,
                workflowLabelsBuckets: action.payload,
            };
        case types.FETCH_LABELS_BUCKETS_ERROR:
            return {
                ...state,
                isFetchingLabelsBuckets: false,
            };
        case types.BULK_QUERY_UPDATE_MUTATION_SEND:
            return {
                ...state,
                isBulkQueryUpdating: true,
            };
        case types.BULK_QUERY_UPDATE_MUTATION_SUCCESS:
            return {
                ...state,
                isBulkQueryUpdating: false,
                bulkQueryUpdate: action.payload,
            };
        case types.BULK_QUERY_UPDATE_MUTATION_ERROR:
            return {
                ...state,
                isBulkQueryUpdating: false,
            };
        case types.BULK_LIST_UPDATE_MUTATION_SEND:
            return {
                ...state,
                isBulkListUpdating: true,
            };
        case types.BULK_LIST_UPDATE_MUTATION_SUCCESS:
            return {
                ...state,
                isBulkListUpdating: false,
            };
        case types.BULK_LIST_UPDATE_MUTATION_ERROR:
            return {
                ...state,
                isBulkListUpdating: false,
            };
        default:
            return { ...state };
    }
};

export default studyReducer;
