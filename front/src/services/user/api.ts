import * as query from './queries';
import { callGraphql, get_gql_url  } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = get_gql_url()

export const fetchCurrentUser = () => {
    return callGraphql(ENDPOINT,query.FETCH_CURRENT_USER_QUERY, {},'CurrentUserQuery');
};

export const signIn = (email,password,oAuthToken) => {
    return callGraphql(ENDPOINT,query.SIGN_IN_MUTATION, { input: { email, password, oAuthToken} });
};

export const signUp = (email,password,oAuthToken) => {
    return callGraphql(ENDPOINT,query.SIGN_UP_MUTATION, { input: { email, password, oAuthToken} });
};

export const updatePassword = (resetPasswordToken,password,passwordConfirmation) => {
    return callGraphql(ENDPOINT,query.UPDATE_PASSWORD_MUTATION, 
        { input: { resetPasswordToken, password, passwordConfirmation} });
};

export const editProfile = (firstName, lastName, defaultQueryString) => {
    return callGraphql(ENDPOINT,query.EDIT_PROFILE_MUTATION, 
        { input: { firstName, lastName, defaultQueryString } });
};
