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