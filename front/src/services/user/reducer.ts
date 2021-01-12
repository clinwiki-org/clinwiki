import * as types from './types';

const initialState: types.UserState = {
    current: null,
    isLoading: false,
    isSigningIn: false,
    signInErrors: [],
    isSigningUp: false,
    signUpErrors: [],
    isUpdatingPassword: false,
    isEditingProfile: false
};

const userReducer = ( state = initialState, action: types.UserActionTypes) : types.UserState => {
    switch(action.type) {
        case types.FETCH_USER_SEND:
            return {
                ...state,
                isLoading: true
            };
        case types.FETCH_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                current: action.payload
            };
        case types.FETCH_USER_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case types.SIGN_IN_SEND:
            return {
                ...state,
                isSigningIn: true,
                signInErrors: [],
            };
        case types.SIGN_IN_SUCCESS:
            return {
                ...state,
                isSigningIn: false,
                current: action.payload
            };
        case types.SIGN_IN_ERROR:
            console.log('SIGN_IN_ERROR action',action)
            return {
                ...state,
                isSigningIn: false,
                signInErrors: action.payload
            };
        case types.SIGN_UP_SEND:
            return {
                ...state,
                isSigningUp: true
            };
        case types.SIGN_UP_SUCCESS:
            return {
                ...state,
                isSigningUp: false
            };
        case types.SIGN_UP_ERROR:
            return {
                ...state,
                isSigningUp: false
            };
        case types.UPDATE_PASSWORD_SEND:
            return {
                ...state,
                isUpdatingPassword: true
            };
        case types.UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                isUpdatingPassword: false
            };
        case types.UPDATE_PASSWORD_ERROR:
            return {
                ...state,
                isUpdatingPassword: false
            };
        case types.EDIT_PROFILE_SEND:
            return {
                ...state,
                isEditingProfile: true
            };
        case types.EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                isEditingProfile: false
            };
        case types.EDIT_PROFILE_ERROR:
            return {
                ...state,
                isEditingProfile: false
            };
        case types.LOGOUT_SEND:
            return {
                ...state,
                current: null
            };
                
        default:
            return {...state};
    }
}

export default userReducer;