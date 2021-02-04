import { IntrospectionQuery } from 'graphql';

export const FETCH_INTROSPECTION_SEND = 'FETCH_INTROSPECTION_SEND';
export const FETCH_INTROSPECTION_SUCCESS = 'FETCH_INTROSPECTION_SUCCESS';
export const FETCH_INTROSPECTION_ERROR = 'FETCH_INTROSPECTION_ERROR';


export interface IntrospectionState {
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


export type IntrospectionActionTypes =
    FetchIntrospectionSendAction |
    FetchIntrospectionSuccessAction |
    FetchIntrospectionErrorAction ;
