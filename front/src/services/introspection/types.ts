import { IntrospectionQuery } from 'graphql';

export const FETCH_INTROSPECTION_SEND = 'FETCH_INTROSPECTION_SEND';
export const FETCH_INTROSPECTION_SUCCESS = 'FETCH_INTROSPECTION_SUCCESS';
export const FETCH_INTROSPECTION_ERROR = 'FETCH_INTROSPECTION_ERROR';


export const FETCH_HASURA_INTROSPECTION_SEND = 'FETCH_HASURA_INTROSPECTION_SEND';
export const FETCH_HASURA_INTROSPECTION_SUCCESS = 'FETCH_HASURA_INTROSPECTION_SUCCESS';
export const FETCH_HASURA_INTROSPECTION_ERROR = 'FETCH_HASURA_INTROSPECTION_ERROR';

export const FETCH_NODE_INTROSPECTION_SEND = 'FETCH_NODE_INTROSPECTION_SEND';
export const FETCH_NODE_INTROSPECTION_SUCCESS = 'FETCH_NODE_INTROSPECTION_SUCCESS';
export const FETCH_NODE_INTROSPECTION_ERROR = 'FETCH_NODE_INTROSPECTION_ERROR';


export interface IntrospectionState {
    isFetchingHasuraIntrospection: boolean,
    hasuraIntrospection: IntrospectionQuery | undefined,
    isFetchingNodeIntrospection: boolean,
    nodeIntrospection: IntrospectionQuery | undefined,
    isFetchingIntrospection: boolean,
    introspection: IntrospectionQuery | undefined
}

export interface IntrospectionError {
    message: string
};

export interface FetchIntrospectionSendAction {
    type: typeof FETCH_INTROSPECTION_SEND
    QUERY: any
};

export interface FetchIntrospectionSuccessAction {
    type: typeof FETCH_INTROSPECTION_SUCCESS,
    payload: IntrospectionQuery
};

export interface FetchIntrospectionErrorAction {
    type: typeof FETCH_INTROSPECTION_ERROR,
    payload: IntrospectionError
};


export interface FetchHasuraIntrospectionSendAction {
    type: typeof FETCH_HASURA_INTROSPECTION_SEND
    QUERY: any
};

export interface FetchHasuraIntrospectionSuccessAction {
    type: typeof FETCH_HASURA_INTROSPECTION_SUCCESS,
    payload: IntrospectionQuery
};

export interface FetchHasuraIntrospectionErrorAction {
    type: typeof FETCH_HASURA_INTROSPECTION_ERROR,
    payload: IntrospectionError
};
export interface FetchNodeIntrospectionSendAction {
    type: typeof FETCH_NODE_INTROSPECTION_SEND
    QUERY: any
};

export interface FetchNodeIntrospectionSuccessAction {
    type: typeof FETCH_NODE_INTROSPECTION_SUCCESS,
    payload: IntrospectionQuery
};

export interface FetchNodeIntrospectionErrorAction {
    type: typeof FETCH_NODE_INTROSPECTION_ERROR,
    payload: IntrospectionError
};


export type IntrospectionActionTypes =
FetchIntrospectionSendAction |
FetchIntrospectionSuccessAction |
FetchIntrospectionErrorAction  |
FetchHasuraIntrospectionSendAction |
FetchHasuraIntrospectionSuccessAction |
FetchHasuraIntrospectionErrorAction |
FetchNodeIntrospectionSendAction |
FetchNodeIntrospectionSuccessAction |
FetchNodeIntrospectionErrorAction ;
