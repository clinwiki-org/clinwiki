import * as query from './queries';
import { getLocalJwt } from 'utils/localStorage';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = 'http://localhost:3000/graphql'

export const fetchCurrentUser = () => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : query.FETCH_CURRENT_USER_QUERY,
            variables: { }
        })
    }).then(r => r.json());
};

export const signIn = (email,password,oAuthToken) => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : query.SIGN_IN_MUTATION,
            variables: { input: { email, password, oAuthToken} }
        })
    }).then(r => r.json());
};

export const signUp = (email,password,oAuthToken) => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : query.SIGN_UP_MUTATION,
            variables: { input: { email, password, oAuthToken} }
        })
    }).then(r => r.json());
};

export const updatePassword = (resetPasswordToken,password,passwordConfirmation) => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : query.UPDATE_PASSWORD_MUTATION,
            variables: { input: { resetPasswordToken, password, passwordConfirmation} }
        })
    }).then(r => r.json());
};

export const editProfile = (firstName, lastName, defaultQueryString) => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : query.EDIT_PROFILE_MUTATION,
            variables: { input: { firstName, lastName, defaultQueryString } }
        })
    }).then(r => r.json());
};
