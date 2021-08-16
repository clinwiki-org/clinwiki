export const REINDEX_ALL_SEND = 'REINDEX_ALL_SEND';
export const REINDEX_ALL_SUCCESS = 'REINDEX_ALL_SUCCESS';
export const REINDEX_ALL_ERROR = 'REINDEX_ALL_ERROR';

export const REINDEX_STUDY_SEND = 'REINDEX_STUDY_SEND';
export const REINDEX_STUDY_SUCCESS = 'REINDEX_STUDY_SUCCESS';
export const REINDEX_STUDY_ERROR = 'REINDEX_STUDY_ERROR';

export const REINDEX_DOCUMENT_SEND = 'REINDEX_DOCUMENT_SEND';
export const REINDEX_DOCUMENT_SUCCESS = 'REINDEX_DOCUMENT_SUCCESS';
export const REINDEX_DOCUMENT_ERROR = 'REINDEX_DOCUMENT_ERROR';

export const REINDEX_ALL_DOCUMENT_SEND = 'REINDEX_ALL_DOCUMENT_SEND';
export const REINDEX_ALL_DOCUMENT_SUCCESS = 'REINDEX_ALL_DOCUMENT_SUCCESS';
export const REINDEX_ALL_DOCUMENT_ERROR = 'REINDEX_ALL_DOCUMENT_ERROR';

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
export interface ReindexDocumentSendAction {
    type: typeof REINDEX_DOCUMENT_SEND,
    primaryKey: string,
    primaryKeyList: string,
    // query,
    indexName: string};

export interface ReindexDocumentSuccessAction {
    type: typeof REINDEX_DOCUMENT_SUCCESS
};

export interface ReindexDocumentErrorAction {
    type: typeof REINDEX_DOCUMENT_ERROR
};
export interface ReindexAllDocumentSendAction {
    type: typeof REINDEX_ALL_DOCUMENT_SEND,
    primaryKey: string,
    // query,
    indexName: string
};

export interface ReindexAllDocumentSuccessAction {
    type: typeof REINDEX_ALL_DOCUMENT_SUCCESS
};

export interface ReindexAllDocumentErrorAction {
    type: typeof REINDEX_ALL_DOCUMENT_ERROR
};

export type AdminActionTypes =
ReindexAllSendAction | ReindexAllSuccessAction | ReindexAllErrorAction |
ReindexStudySendAction | ReindexStudySuccessAction | ReindexStudyErrorAction|
ReindexDocumentSendAction | ReindexDocumentSuccessAction | ReindexDocumentErrorAction | 
ReindexAllDocumentSendAction | ReindexAllDocumentSuccessAction | ReindexAllDocumentErrorAction;
