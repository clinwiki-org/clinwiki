

export const INSERT_PAGE_VIEW_LOG_SEND = 'INSERT_PAGE_VIEW_LOG_SEND';
export const INSERT_PAGE_VIEW_LOG_SUCCESS = 'INSERT_PAGE_VIEW_LOG_SUCCESS';
export const INSERT_PAGE_VIEW_LOG_ERROR = 'INSERT_PAGE_VIEW_LOG_ERROR';
export const FETCH_META_FIELDS = 'FETCH_META_FIELDS'
export const FETCH_META_FIELDS_SUCCESS = 'FETCH_META_FIELDS_SUCCESS'
export const FETCH_META_FIELDS_ERROR = 'FETCH_META_FIELDS_ERROR'


export interface GenericPageState {
    isInsertingPageViewLog: boolean;
    metaFields: object
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

export interface FetchMetaFields {
   type: typeof FETCH_META_FIELDS,
   formName: string
}

export interface FetchMetaFieldsSuccess {
    type: typeof FETCH_META_FIELDS_SUCCESS,
    payload: any;
 }

 export interface FetchMetaFieldsError {
    type: typeof FETCH_META_FIELDS_ERROR,
    message: string
 }


export type GenericPageActionTypes =
    | InsertPageViewLogSendAction
    | InsertPageViewLogSuccessAction
    | InsertPageViewLogErrorAction
    | FetchMetaFields
    | FetchMetaFieldsSuccess | FetchMetaFieldsError
    ;