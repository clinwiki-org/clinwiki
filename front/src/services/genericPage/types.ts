

export const INSERT_PAGE_VIEW_LOG_SEND = 'INSERT_PAGE_VIEW_LOG_SEND';
export const INSERT_PAGE_VIEW_LOG_SUCCESS = 'INSERT_PAGE_VIEW_LOG_SUCCESS';
export const INSERT_PAGE_VIEW_LOG_ERROR = 'INSERT_PAGE_VIEW_LOG_ERROR';

export const FETCH_GENERIC_PAGE_SEND = 'FETCH_GENERIC_PAGE_SEND';
export const FETCH_GENERIC_PAGE_SUCCESS = 'FETCH_GENERIC_PAGE_SUCCESS';
export const FETCH_GENERIC_PAGE_ERROR = 'FETCH_GENERIC_PAGE_ERROR';

export const FETCH_MM_SCHEMAS_SEND = 'FETCH_MM_SCHEMAS_SEND';
export const FETCH_MM_SCHEMAS_SUCCESS = 'FETCH_MM_SCHEMAS_SUCCESS';
export const FETCH_MM_SCHEMAS_ERROR = 'FETCH_MM_SCHEMAS_ERROR';


export interface GenericPageState {
    isInsertingPageViewLog: boolean;
    isFetchingGenericPage: boolean;
    genericPageData: any;
    isFetchingMMSchemas: boolean;
    MMSchemas: any;
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
export interface fetchGenericPageSendAction {
    type: typeof FETCH_GENERIC_PAGE_SEND;
    name:any;
    params: any;
    primaryKey:any;
    QUERY: any;
    useHasura: boolean;
}

export interface fetchGenericPageSuccessAction {
    type: typeof FETCH_GENERIC_PAGE_SUCCESS;
    name:any;
    payload: any;
}

export interface fetchGenericPageErrorAction {
    type: typeof FETCH_GENERIC_PAGE_ERROR;
    payload: GenericPageDataError;
}
export interface fetchMMSchemasSendAction {
    type: typeof FETCH_MM_SCHEMAS_SEND;
}

export interface fetchMMSchemasSuccessAction {
    type: typeof FETCH_MM_SCHEMAS_SUCCESS;
    payload: any;
}

export interface fetchMMSchemasErrorAction {
    type: typeof FETCH_MM_SCHEMAS_ERROR;
    payload: GenericPageDataError;
}


export type GenericPageActionTypes =
    | InsertPageViewLogSendAction
    | InsertPageViewLogSuccessAction
    | InsertPageViewLogErrorAction
    | fetchGenericPageSendAction
    | fetchGenericPageSuccessAction
    | fetchGenericPageErrorAction
    | fetchMMSchemasSendAction
    | fetchMMSchemasSuccessAction
    | fetchMMSchemasErrorAction;