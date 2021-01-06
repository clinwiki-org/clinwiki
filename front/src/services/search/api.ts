import * as query from './queries';
import { callGraphql } from 'utils/graphqlUtil';
import { queries } from '@testing-library/react';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = 'http://localhost:3000/graphql'

export const fetchSearchPageAggs = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_AGGS_QUERY, searchParams);
};

export const fetchSearchParams = (hash : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_PARAMS_QUERY, { hash });
};
export const fetchSearchStudies = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_SEARCH_QUERY, searchParams);
};
