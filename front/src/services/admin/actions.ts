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
