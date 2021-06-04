import * as types from './types';
import { IntrospectionQuery } from 'graphql';

    
export const fetchIntrospection = ( QUERY: any ) : types.IntrospectionActionTypes => ({
    type: types.FETCH_INTROSPECTION_SEND,
    QUERY
});

export const fetchIntrospectionSuccess = (payload: IntrospectionQuery) : types.IntrospectionActionTypes => ({
    type: types.FETCH_INTROSPECTION_SUCCESS,
    payload
});

export const fetchIntrospectionError = (message: string) : types.IntrospectionActionTypes => ({
    type: types.FETCH_INTROSPECTION_ERROR,
    payload: { message }
});  


    
export const fetchHasuraIntrospection = ( QUERY: any ) : types.IntrospectionActionTypes => ({
    type: types.FETCH_HASURA_INTROSPECTION_SEND,
    QUERY
});

export const fetchHasuraIntrospectionSuccess = (payload: IntrospectionQuery) : types.IntrospectionActionTypes => ({
    type: types.FETCH_HASURA_INTROSPECTION_SUCCESS,
    payload
});

export const fetchHasuraIntrospectionError = (message: string) : types.IntrospectionActionTypes => ({
    type: types.FETCH_HASURA_INTROSPECTION_ERROR,
    payload: { message }
});  
export const fetchNodeIntrospection = ( QUERY: any ) : types.IntrospectionActionTypes => ({
    type: types.FETCH_NODE_INTROSPECTION_SEND,
    QUERY
});

export const fetchNodeIntrospectionSuccess = (payload: IntrospectionQuery) : types.IntrospectionActionTypes => ({
    type: types.FETCH_NODE_INTROSPECTION_SUCCESS,
    payload
});

export const fetchNodeIntrospectionError = (message: string) : types.IntrospectionActionTypes => ({
    type: types.FETCH_NODE_INTROSPECTION_ERROR,
    payload: { message }
});  