import { UserFragment } from 'services/user/model/UserFragment';

export const FETCH_USER_SEND = 'FETCH_USER_SEND';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';

export const SIGN_IN_SEND = 'SIGN_IN_SEND';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_ERROR = 'SIGN_IN_ERROR';

export const SIGN_UP_SEND = 'SIGN_UP_SEND';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_ERROR = 'SIGN_UP_ERROR';

export const UPDATE_PASSWORD_SEND = 'UPDATE_PASSWORD_SEND';
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD_ERROR = 'UPDATE_PASSWORD_ERROR';

export const EDIT_PROFILE_SEND = 'EDIT_PROFILE_SEND';
export const EDIT_PROFILE_SUCCESS = 'EDIT_PROFILE_SUCCESS';
export const EDIT_PROFILE_ERROR = 'EDIT_PROFILE_ERROR';

export const LOGOUT_SEND = 'LOGOUT_SEND';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export interface UserState {
    current: UserFragment | null,
    isLoading: boolean,
    isSigningIn: boolean,
    isSigningUp: boolean,
    isUpdatingPassword: boolean,
    isEditingProfile: boolean
}

export interface UserData {
    email: string
};

export interface UserDataError {
    message: string
};

export interface FetchUserSendAction {
    type: typeof FETCH_USER_SEND
};

export interface FetchUserSuccessAction {
    type: typeof FETCH_USER_SUCCESS,
    payload: UserFragment
};

export interface FetchUserErrorAction {
    type: typeof FETCH_USER_ERROR,
    payload: UserDataError
};

export interface SignInSendAction {
    type: typeof SIGN_IN_SEND,
    email: string,
    password: string,
    oAuthToken: string
}

export interface SignInSuccessAction {
    type: typeof SIGN_IN_SUCCESS,
    payload: UserFragment
};

export interface SignInErrorAction {
    type: typeof SIGN_IN_ERROR,
    payload: UserDataError
};

export interface SignUpSendAction {
    type: typeof SIGN_UP_SEND,
    email: string,
    password: string,
    oAuthToken: string
}

export interface SignUpSuccessAction {
    type: typeof SIGN_UP_SUCCESS,
    payload: UserData
};

export interface SignUpErrorAction {
    type: typeof SIGN_UP_ERROR,
    payload: UserDataError
};

export interface UpdatePasswordSendAction {
    type: typeof UPDATE_PASSWORD_SEND,
    resetPasswordToken: string,
    password: string,
    passwordConfirmation: string
}

export interface UpdatePasswordSuccessAction {
    type: typeof UPDATE_PASSWORD_SUCCESS,
    payload: UserData
};

export interface UpdatePasswordErrorAction {
    type: typeof UPDATE_PASSWORD_ERROR,
    payload: UserDataError
};

export interface EditProfileSendAction {
    type: typeof EDIT_PROFILE_SEND,
    firstName: string,
    lastName: string,
    defaultQueryString: string
}

export interface EditProfileSuccessAction {
    type: typeof EDIT_PROFILE_SUCCESS,
    payload: UserData
};

export interface EditProfileErrorAction {
    type: typeof EDIT_PROFILE_ERROR,
    payload: UserDataError
};

export interface LogoutSendAction {
    type: typeof LOGOUT_SEND
}

export interface LogoutSuccessAction {
    type: typeof LOGOUT_SUCCESS
};

export interface LogoutErrorAction {
    type: typeof LOGOUT_ERROR,
    payload: UserDataError
};

export type UserActionTypes = FetchUserSendAction | FetchUserSuccessAction | FetchUserErrorAction |
    SignInSendAction | SignInSuccessAction | SignInErrorAction | 
    SignUpSendAction | SignUpSuccessAction | SignUpErrorAction |
    UpdatePasswordSendAction | UpdatePasswordSuccessAction | UpdatePasswordErrorAction |
    EditProfileSendAction | EditProfileSuccessAction | EditProfileErrorAction |
    LogoutSendAction | LogoutSuccessAction | LogoutErrorAction;