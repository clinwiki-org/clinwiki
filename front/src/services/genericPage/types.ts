

export const INSERT_PAGE_VIEW_LOG_SEND = 'INSERT_PAGE_VIEW_LOG_SEND';
export const INSERT_PAGE_VIEW_LOG_SUCCESS = 'INSERT_PAGE_VIEW_LOG_SUCCESS';
export const INSERT_PAGE_VIEW_LOG_ERROR = 'INSERT_PAGE_VIEW_LOG_ERROR';


export interface GenericPageState {
    isInsertingPageViewLog: boolean;
}

export interface GenericPageDataError {
    message: string;
}


export interface InsertPageViewLogSendAction {
    type: typeof INSERT_PAGE_VIEW_LOG_SEND;
    userId?: number;
    url?: string;
}

export interface InsertPageViewLogSuccessAction {
    type: typeof INSERT_PAGE_VIEW_LOG_SUCCESS;
    payload: any;
}

export interface InsertPageViewLogErrorAction {
    type: typeof INSERT_PAGE_VIEW_LOG_ERROR;
    payload: GenericPageDataError;
}


export type GenericPageActionTypes =
    | InsertPageViewLogSendAction
    | InsertPageViewLogSuccessAction
    | InsertPageViewLogErrorAction;