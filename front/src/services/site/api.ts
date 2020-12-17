import * as query from './queries';
import { getLocalJwt } from 'utils/localStorage';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = 'http://localhost:3000/graphql'

export const fetchAdminSiteView = () => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : query.ADMIN_SITE_VIEW_QUERY,
            variables: { }
        })
    }).then(r => r.json());
};
