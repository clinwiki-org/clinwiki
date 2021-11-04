import * as types from './types';

export const insertPageViewLog = ( userId: number, url: string ): types.GenericPageActionTypes =>({
    type: types.INSERT_PAGE_VIEW_LOG_SEND,
    userId,
    url
})


export const getMetaFields = ( formName: string ): types.GenericPageActionTypes =>({
    type: types.FETCH_META_FIELDS,
    formName
})

export const getMetaFieldsSuccess = ( payload: any ): types.GenericPageActionTypes =>({
    type: types.FETCH_META_FIELDS_SUCCESS,
    payload
})

export const getMetaFieldsError = ( message: any ): types.GenericPageActionTypes =>({
    type: types.FETCH_META_FIELDS_ERROR,
    message
})