import * as query from './queries';
import { callGraphql, get_gql_url, getGraphQLMigrationURL } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = get_gql_url();
const NODE_ENDPOINT = getGraphQLMigrationURL();

export const fetchUser = ( userId: number ) => {
    console.log("fetchUser called");
    return callGraphql(ENDPOINT,query.USER_QUERY, { userId: userId});
};

export const fetchCurrentUser = () => {
    console.log("fetchCurrentUser called");
    return callGraphql(NODE_ENDPOINT,query.FETCH_CURRENT_USER_QUERY, {},'CurrentUserQuery');
};

export const signIn = (email,password,oAuthToken) => {
    return callGraphql(NODE_ENDPOINT,query.SIGN_IN_MUTATION, { input: { email, password, oAuthToken} });
};

export const signUp = (email,password,oAuthToken) => {
    console.log("signUp called");
    return callGraphql(ENDPOINT,query.SIGN_UP_MUTATION, { input: { email, password, oAuthToken} });
};

export const updatePassword = (resetPasswordToken,password,passwordConfirmation) => {
    return callGraphql(ENDPOINT,query.UPDATE_PASSWORD_MUTATION, 
        { input: { resetPasswordToken, password, passwordConfirmation} });
};

export const resetPassword = (email) => {
    return callGraphql(ENDPOINT,query.RESET_PASSWORD_MUTATION, 
        { input: { email } });
};

export const editProfile = (firstName, lastName, defaultQueryString) => {
    return callGraphql(ENDPOINT,query.EDIT_PROFILE_MUTATION, 
        { input: { firstName, lastName, defaultQueryString } });
};
