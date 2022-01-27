import { UserFragment } from 'services/user/model/UserFragment';

export const FETCH_CURRENT_USER_SEND = 'FETCH_CURRENT_USER_SEND';
export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_CURRENT_USER_ERROR = 'FETCH_CURRENT_USER_ERROR';

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

export const RESET_PASSWORD_SEND = 'RESET_PASSWORD_SEND';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR';

export const EDIT_PROFILE_SEND = 'EDIT_PROFILE_SEND';
export const EDIT_PROFILE_SUCCESS = 'EDIT_PROFILE_SUCCESS';
export const EDIT_PROFILE_ERROR = 'EDIT_PROFILE_ERROR';

export const LOGOUT_SEND = 'LOGOUT_SEND';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export interface UserState {
    user: any | undefined,
    message: any | undefined,
    isFetchingUser: boolean,
    current: UserFragment | null,
    isLoading: boolean,
    isSigningIn: boolean,
    signInErrors: Array<string>,
    isSigningUp: boolean,
    signUpErrors: Array<string>,
    isUpdatingPassword: boolean,
    isEditingProfile: boolean,
    isResettingPassword: boolean
}

export interface UserData {
    email: string
};

export interface UserDataError {
    errors: Array<string>
};

export interface FetchUserSendAction {
    type: typeof FETCH_USER_SEND
    userId: number
};

export interface FetchUserSuccessAction {
    type: typeof FETCH_USER_SUCCESS,
    payload: any
};

export interface FetchUserErrorAction {
    type: typeof FETCH_USER_ERROR,
    payload: UserDataError
};

export interface FetchCurrentUserSendAction {
    type: typeof FETCH_CURRENT_USER_SEND
};

export interface FetchCurrentUserSuccessAction {
    type: typeof FETCH_CURRENT_USER_SUCCESS,
    payload: UserFragment
};

export interface FetchCurrentUserErrorAction {
    type: typeof FETCH_CURRENT_USER_ERROR,
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
    payload: Array<string>
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
    payload: any
};

export interface ResetPasswordSendAction {
    type: typeof RESET_PASSWORD_SEND,
    email: string,
}

export interface ResetPasswordSuccessAction {
    type: typeof RESET_PASSWORD_SUCCESS,
    payload: any
};

export interface ResetPasswordErrorAction {
    type: typeof RESET_PASSWORD_ERROR,
    payload: any
};

export interface UpdatePasswordSendAction {
    type: typeof UPDATE_PASSWORD_SEND,
    resetPasswordToken: string,
    password: string,
    passwordConfirmation: string
}

export interface UpdatePasswordSuccessAction {
    type: typeof UPDATE_PASSWORD_SUCCESS,
    payload: any
};

export interface UpdatePasswordErrorAction {
    type: typeof UPDATE_PASSWORD_ERROR,
    payload: any
};

export interface EditProfileSendAction {
    type: typeof EDIT_PROFILE_SEND,
    first_name: string,
    last_name: string,
    default_query_string: string,
    email: string
}

export interface EditProfileSuccessAction {
    type: typeof EDIT_PROFILE_SUCCESS,
    payload: UserData
};

export interface EditProfileErrorAction {
    type: typeof EDIT_PROFILE_ERROR,
    payload: Array<string>
};

export interface LogoutSendAction {
    type: typeof LOGOUT_SEND
}

export interface LogoutSuccessAction {
    type: typeof LOGOUT_SUCCESS
};

export interface LogoutErrorAction {
    type: typeof LOGOUT_ERROR,
    payload: Array<string>
};

export type UserActionTypes =
    FetchCurrentUserSendAction | FetchCurrentUserSuccessAction | FetchCurrentUserErrorAction |
    FetchUserSendAction | FetchUserSuccessAction | FetchUserErrorAction |
    SignInSendAction | SignInSuccessAction | SignInErrorAction | 
    SignUpSendAction | SignUpSuccessAction | SignUpErrorAction |
    UpdatePasswordSendAction | UpdatePasswordSuccessAction | UpdatePasswordErrorAction |
    ResetPasswordSendAction | ResetPasswordSuccessAction | ResetPasswordErrorAction |
    EditProfileSendAction | EditProfileSuccessAction | EditProfileErrorAction |
    LogoutSendAction | LogoutSuccessAction | LogoutErrorAction;