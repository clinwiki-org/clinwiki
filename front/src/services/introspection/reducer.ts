import * as types from './types';


const initialState: types.IntrospectionState = {
    isFetchingHasuraIntrospection: false,
    hasuraIntrospection: undefined,
    isFetchingNodeIntrospection: false,
    nodeIntrospection: undefined,
    isFetchingIntrospection: false,
    introspection: undefined,
}

const introspectionReducer = ( state = initialState, action: types.IntrospectionActionTypes) : types.IntrospectionState => {
    switch(action.type) {
        case types.FETCH_HASURA_INTROSPECTION_SEND:
            return {
                ...state,
                isFetchingHasuraIntrospection: true
            };
        case types.FETCH_HASURA_INTROSPECTION_SUCCESS:
            return {
                ...state,
                isFetchingHasuraIntrospection: false,
                hasuraIntrospection: action.payload
            };
        case types.FETCH_HASURA_INTROSPECTION_ERROR:
            return {
                ...state,
                isFetchingHasuraIntrospection: false
            };
        case types.FETCH_NODE_INTROSPECTION_SEND:
            return {
                ...state,
                isFetchingNodeIntrospection: true
            };
        case types.FETCH_NODE_INTROSPECTION_SUCCESS:
            return {
                ...state,
                isFetchingNodeIntrospection: false,
                nodeIntrospection: action.payload
            };
        case types.FETCH_NODE_INTROSPECTION_ERROR:
            return {
                ...state,
                isFetchingNodeIntrospection: false
            };

        default:
            return {...state};
    }
}

export default introspectionReducer;