import * as query from './queries';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import { getLocalJwt } from 'utils/localStorage';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = 'http://localhost:3000/graphql'

export const fetchSearchPageAggs = (searchParams : any) => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : query.SEARCH_PAGE_AGGS_QUERY,
            variables: searchParams
        })
    }).then(r => r.json());
};

export const fetchSearchStudies = (hash : any) => {
    return fetch(ENDPOINT,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query : SearchPageParamsQuery,
            variables: { hash }
        })
    }).then(r => r.json());
};
