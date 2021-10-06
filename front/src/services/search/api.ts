import * as query from './queries';
import * as mutate from './mutations';
// import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
// import AUTOSUGGEST_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery';
import {
    callGraphql,
    get_gql_url,
    getGraphQLMigrationURL,
    getHasuraClinwikiURL,
    callHasuraClinwiki,
} from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = get_gql_url();
const NODE_ENDPOINT = getGraphQLMigrationURL();
const HASURA_CW = getHasuraClinwikiURL();

export const fetchSearchPageAggs = (searchParams: any) => {
    return callGraphql(
        NODE_ENDPOINT,
        query.SEARCH_PAGE_AGGS_QUERY,
        searchParams
    );
};

export const fetchSearchPageAggBuckets = (searchParams: any, aggId?: any) => {
    return callGraphql(
        NODE_ENDPOINT,
        query.SEARCH_PAGE_AGG_BUCKETS_QUERY,
        searchParams,
    ); //TODO CHeck params
};
export const fetchSearchPageCrowdAggBuckets = (searchParams: any) => {
    return callGraphql(
        NODE_ENDPOINT,
        query.SEARCH_PAGE_CROWD_AGG_BUCKETS_QUERY,
        searchParams
    ); //TODO CHeck params
};
export const fetchSearchPageOpenAggBuckets = (searchParams: any) => {
    return callGraphql(
        NODE_ENDPOINT,
        query.SEARCH_PAGE_OPEN_AGG_BUCKETS_QUERY,
        searchParams
    ); //TODO CHeck params
};
export const fetchSearchPageOpenCrowdAggBuckets = (searchParams: any) => {
    return callGraphql(
        NODE_ENDPOINT,
        query.SEARCH_PAGE_OPEN_CROWD_AGG_BUCKETS_QUERY,
        searchParams
    ); //TODO CHeck params
};

export const fetchSearchParams = (hash: any) => {
    return callGraphql(NODE_ENDPOINT, query.SEARCH_PAGE_PARAMS_QUERY, { hash });
};
export const fetchSearchStudies = (searchParams: any) => {
    return callGraphql(
        NODE_ENDPOINT,
        query.SEARCH_PAGE_SEARCH_QUERY,
        searchParams
    );
};
export const updateSearchParams = searchParams => {
    return callGraphql(
        NODE_ENDPOINT,
        mutate.SEARCH_PAGE_HASH_MUTATION,
        searchParams.searchParams
    );
};
export const fetchSearchAutoSuggest = (searchParams: any) => {
    return callGraphql(ENDPOINT, query.AUTOSUGGEST_QUERY, searchParams);
};

export const fetchSavedSearches = (userId: any) => {
    return callHasuraClinwiki(HASURA_CW, query.HASURA_SAVED_SEARCHES_QUERY, {
        userId: userId,
    });
};

export const findShortLinkId = (searchHash: string) => {
    return callHasuraClinwiki(HASURA_CW, query.FIND_SHORT_LINK, {
        searchHash: searchHash,
    });
};

export const createSavedSearch = (
    searchHash: string,
    url: string,
    userId: number,
    nameLabel: string,
    shortLinkId: number
) => {
    return callHasuraClinwiki(HASURA_CW, mutate.HASURA_CREATE_SAVED_SEARCH, {
        searchHash: searchHash,
        url: url,
        userId: userId,
        nameLabel: nameLabel,
        shortLinkId: shortLinkId,
    });
};

export const deleteSavedSearch = id => {
    return callHasuraClinwiki(HASURA_CW, mutate.HASURA_DELETE_SAVED_SEARCH, {
        id: id,
    });
};

export const fetchIslandConfig = (idList) => {
    return callHasuraClinwiki(HASURA_CW, query.ISLAND_CONFIG_QUERY, {
        idList: idList
    });
};

export const updateFacetConfig = input => {
    return callGraphql(ENDPOINT, mutate.UPDATE_FACET_CONFIG, {
        input: input.input,
    });
};
export const searchExport = (searchExportId: number) => {
    return callGraphql(ENDPOINT, query.SEARCH_EXPORT_QUERY, {
        searchExportId: searchExportId,
    });
};

export const exportToCsv = (searchHash: string, siteViewId: number) => {
    return callGraphql(ENDPOINT, mutate.EXPORT_TO_CSV_MUTATION, {
        searchHash: searchHash,
        siteViewId: siteViewId,
    });
};
