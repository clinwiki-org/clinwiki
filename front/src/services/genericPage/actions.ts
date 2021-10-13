import * as types from './types';

export const insertPageViewLog = ( userId: number, url: string ): types.GenericPageActionTypes =>({
    type: types.INSERT_PAGE_VIEW_LOG_SEND,
    userId,
    url
})
export const fetchGenericPage = ( name: any, params: any,primaryKey:any,  QUERY: any, useHasura: boolean): types.GenericPageActionTypes =>({
    type: types.FETCH_GENERIC_PAGE_SEND,
    name,
    params,
    primaryKey,
    QUERY, 
    useHasura
})
export const fetchGenericPageSuccess = (name: any,payload: any, ): types.GenericPageActionTypes =>({
    type: types.FETCH_GENERIC_PAGE_SUCCESS,
    name,
    payload,
})
export const fetchGenericPageError = ( message: string ): types.GenericPageActionTypes =>({
    type: types.FETCH_GENERIC_PAGE_ERROR,
    payload: { message },

})