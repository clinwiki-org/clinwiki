import * as types from './types';


const initialState: types.IntrospectionState = {
    isFetchingIntrospection: false,
    introspection: undefined,
}

const introspectionReducer = ( state = initialState, action: types.IntrospectionActionTypes) : types.IntrospectionState => {
    switch(action.type) {
        case types.FETCH_INTROSPECTION_SEND:
            return {
                ...state,
                isFetchingIntrospection: true
            };
        case types.FETCH_INTROSPECTION_SUCCESS:
            return {
                ...state,
                isFetchingIntrospection: false,
                introspection: action.payload
            };
        case types.FETCH_INTROSPECTION_ERROR:
            return {
                ...state,
                isFetchingIntrospection: false
            };

        default:
            return {...state};
    }
}

export default introspectionReducer;