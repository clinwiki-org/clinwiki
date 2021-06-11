export const REINDEX_ALL_SEND = 'REINDEX_ALL_SEND';
export const REINDEX_ALL_SUCCESS = 'REINDEX_ALL_SUCCESS';
export const REINDEX_ALL_ERROR = 'REINDEX_ALL_ERROR';

export const REINDEX_STUDY_SEND = 'REINDEX_STUDY_SEND';
export const REINDEX_STUDY_SUCCESS = 'REINDEX_STUDY_SUCCESS';
export const REINDEX_STUDY_ERROR = 'REINDEX_STUDY_ERROR';

export interface AdminState {
    isReindexing: boolean,
    reIndexingErrors: Array<string>
}

export interface ReindexAllSendAction {
    type: typeof REINDEX_ALL_SEND
};

export interface ReindexAllSuccessAction {
    type: typeof REINDEX_ALL_SUCCESS
};

export interface ReindexAllErrorAction {
    type: typeof REINDEX_ALL_ERROR
};

export interface ReindexStudySendAction {
    type: typeof REINDEX_STUDY_SEND,
    nctId: String
};

export interface ReindexStudySuccessAction {
    type: typeof REINDEX_STUDY_SUCCESS
};

export interface ReindexStudyErrorAction {
    type: typeof REINDEX_STUDY_ERROR
};

export type AdminActionTypes =
ReindexAllSendAction | ReindexAllSuccessAction | ReindexAllErrorAction |
ReindexStudySendAction | ReindexStudySuccessAction | ReindexStudyErrorAction;
