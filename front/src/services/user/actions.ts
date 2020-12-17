import * as types from './types';
import { UserFragment } from 'types/UserFragment';

export const fetchUser = () : types.UserActionTypes => ({
    type: types.FETCH_USER_SEND
});

export const fetchUserSuccess = (payload: UserFragment) : types.UserActionTypes => ({
    type: types.FETCH_USER_SUCCESS,
    payload
});

export const fetchUserError = (message: string) : types.UserActionTypes => ({
    type: types.FETCH_USER_ERROR,
    payload: { message }
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

export const signInError = (message: string) : types.UserActionTypes => ({
    type: types.SIGN_IN_ERROR,
    payload: { message }
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

export const signUpError = (message: string) : types.UserActionTypes => ({
    type: types.SIGN_UP_ERROR,
    payload: { message }
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

export const updatePasswordError = (message: string) : types.UserActionTypes => ({
    type: types.UPDATE_PASSWORD_ERROR,
    payload: { message }
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

export const editProfileError = (message: string) : types.UserActionTypes => ({
    type: types.EDIT_PROFILE_ERROR,
    payload: { message }
});

export const logout = () : types.UserActionTypes => ({
    type: types.LOGOUT_SEND
});

export const logoutSuccess = () : types.UserActionTypes => ({
    type: types.LOGOUT_SUCCESS
});

export const logoutError = (message: string) : types.UserActionTypes => ({
    type: types.LOGOUT_ERROR,
    payload: { message }
});
