import * as query from './queries';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import { callGraphql } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = `http://${window.location.hostname}:3000/graphql`

export const fetchSearchPageAggs = (searchParams : any) => {
    return callGraphql(ENDPOINT,query.SEARCH_PAGE_AGGS_QUERY, searchParams);
};

export const fetchSearchStudies = (hash : any) => {
    return callGraphql(ENDPOINT,SearchPageParamsQuery, { hash });
};
