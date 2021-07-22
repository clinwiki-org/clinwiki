import * as types from './types';

export const reindexAll = () => ({
    type: types.REINDEX_ALL_SEND
});

export const reindexAllSuccess = (payload: String) => ({
    type: types.REINDEX_ALL_SUCCESS
});

export const reindexAllError = (errors: Array<string>) => ({
    type: types.REINDEX_ALL_ERROR,
    payload: errors
});

export const reindexStudy = (nctId : String) => ({
    type: types.REINDEX_STUDY_SEND,
    nctId
});

export const reindexStudySuccess = (payload: String) => ({
    type: types.REINDEX_STUDY_SUCCESS
});

export const reindexStudyError = (errors: Array<string>) => ({
    type: types.REINDEX_STUDY_ERROR,
    payload: errors
});

export const reindexDocument = (                       
    primaryKey,
    primaryKeyList,
    // query,
    indexName 
    ) => ({
    type: types.REINDEX_DOCUMENT_SEND,
    primaryKey,
    primaryKeyList,
    // query,
    indexName
});

export const reindexDocumentSuccess = (payload: String) => ({
    type: types.REINDEX_DOCUMENT_SUCCESS
});

export const reindexDocumentError = (errors: Array<string>) => ({
    type: types.REINDEX_DOCUMENT_ERROR,
    payload: errors
});