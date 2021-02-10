import * as types from './types';
import { UserFragment } from 'services/user/model/UserFragment';

export const fetchUser = (userId: number) : types.UserActionTypes => ({
    type: types.FETCH_USER_SEND,
    userId
});

export const fetchUserSuccess = (payload: any) : types.UserActionTypes => ({
    type: types.FETCH_USER_SUCCESS,
    payload
});

export const fetchUserError = (errors: Array<string>) : types.UserActionTypes => ({
    type: types.FETCH_USER_ERROR,
    payload: { errors }
});

export const fetchCurrentUser = () : types.UserActionTypes => ({
    type: types.FETCH_CURRENT_USER_SEND
});

export const fetchCurrentUserSuccess = (payload: UserFragment) : types.UserActionTypes => ({
    type: types.FETCH_CURRENT_USER_SUCCESS,
    payload
});

export const fetchCurrentUserError = (errors: Array<string>) : types.UserActionTypes => ({
    type: types.FETCH_CURRENT_USER_ERROR,
    payload: { errors }
});

export const signIn = (email: string, password: string, oAuthToken: string) : types.UserActionTypes => ({
    type: types.SIGN_IN_SEND,
    email,
    password,
    oAuthToken
});

export const signInSuccess = (payload: UserFragment) : types.UserActionTypes => ({
    type: types.SIGN_IN_SUCCESS,
    payload
});

export const signInError = (errors: Array<string>) : types.UserActionTypes => ({
    type: types.SIGN_IN_ERROR,
    payload: errors
});

export const signUp = (email: string, password: string, oAuthToken: string) : types.UserActionTypes => ({
    type: types.SIGN_UP_SEND,
    email,
    password,
    oAuthToken
});

export const signUpSuccess = (payload: types.UserData) : types.UserActionTypes => ({
    type: types.SIGN_UP_SUCCESS,
    payload
});

export const signUpError = (errors: Array<string>) : types.UserActionTypes => ({
    type: types.SIGN_UP_ERROR,
    payload: errors
});

export const updatePassword = (resetPasswordToken: string, password: string, passwordConfirmation: string) : types.UserActionTypes => ({
    type: types.UPDATE_PASSWORD_SEND,
    resetPasswordToken,
    password,
    passwordConfirmation
});

export const updatePasswordSuccess = (payload: types.UserData) : types.UserActionTypes => ({
    type: types.UPDATE_PASSWORD_SUCCESS,
    payload
});

export const updatePasswordError = (errors: Array<string>) : types.UserActionTypes => ({
    type: types.UPDATE_PASSWORD_ERROR,
    payload: errors
});

export const editProfile = (firstName: string, lastName: string, defaultQueryString: string) : types.UserActionTypes => ({
    type: types.EDIT_PROFILE_SEND,
    firstName,
    lastName,
    defaultQueryString
});

export const editProfileSuccess = (payload: types.UserData) : types.UserActionTypes => ({
    type: types.EDIT_PROFILE_SUCCESS,
    payload
});

export const editProfileError = (errors: Array<string>) : types.UserActionTypes => ({
    type: types.EDIT_PROFILE_ERROR,
    payload: errors
});

export const logout = () : types.UserActionTypes => ({
    type: types.LOGOUT_SEND
});

export const logoutSuccess = () : types.UserActionTypes => ({
    type: types.LOGOUT_SUCCESS
});

export const logoutError = (errors: Array<string>) : types.UserActionTypes => ({
    type: types.LOGOUT_ERROR,
    payload: errors
});
