import * as types from './types';

export const insertPageViewLog = ( userId: number, url: string ): types.GenericPageActionTypes =>({
    type: types.INSERT_PAGE_VIEW_LOG_SEND,
    userId,
    url
})
export const fetchGenericPage = ( params: any,primaryKey:any,  QUERY: any, useHasura: boolean): types.GenericPageActionTypes =>({
    type: types.FETCH_GENERIC_PAGE_SEND,
    params,
    primaryKey,
    QUERY, 
    useHasura
})
export const fetchGenericPageSuccess = (payload: any): types.GenericPageActionTypes =>({
    type: types.FETCH_GENERIC_PAGE_SUCCESS,
    payload,
})
export const fetchGenericPageError = ( message: string ): types.GenericPageActionTypes =>({
    type: types.FETCH_GENERIC_PAGE_ERROR,
    payload: { message },

})