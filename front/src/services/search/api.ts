import * as query from './queries';
import * as mutate from './mutations'
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery';
import { callGraphql, get_gql_url } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = get_gql_url()

export const fetchSearchPageAggs = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_AGGS_QUERY, searchParams);
};

export const fetchSearchPageAggBuckets = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_AGG_BUCKETS_QUERY, searchParams);           //TODO CHeck params
};
export const fetchSearchPageCrowdAggBuckets = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_CROWD_AGG_BUCKETS_QUERY, searchParams);     //TODO CHeck params
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
    return callGraphql(ENDPOINT,AUTOSUGGEST_QUERY, searchParams);             //TODO Check this Query, import location
};
