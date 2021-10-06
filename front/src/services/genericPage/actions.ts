import * as types from './types';

export const insertPageViewLog = ( userId: number, url: string ): types.GenericPageActionTypes =>({
    type: types.INSERT_PAGE_VIEW_LOG_SEND,
    userId,
    url
})