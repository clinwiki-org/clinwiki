import * as query from './queries';
import * as mutate from './mutations'
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery';
import { callGraphql } from 'utils/graphqlUtil';
import { queries } from '@testing-library/react';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = `http://${window.location.hostname}:3000/graphql`

export const fetchSearchPageAggs = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_AGGS_QUERY, searchParams);
};

export const fetchSearchParams = (hash : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_PARAMS_QUERY, { hash });
};
export const fetchSearchStudies = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_SEARCH_QUERY, searchParams);
};
export const updateSearchParams = ( searchParams ) =>{
    return callGraphql(ENDPOINT, mutate.SEARCH_PAGE_HASH_MUTATION,
        searchParams.searchParams )
}

export const fetchSearchAutoSuggest = (searchParams : any) => {
    return callGraphql(ENDPOINT,AUTOSUGGEST_QUERY, searchParams);
};
