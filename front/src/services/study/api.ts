import { callHasuraDIS, getHasuraClinwikiURL, getHasuraDISURL } from './../../utils/graphqlUtil';
import * as query from './queries';
import * as mutate from './mutations';
import {
    callGraphql,
    // callHasuraAACT,
    callHasuraClinwiki,
    //getHasuraURLAACT,
    // get_gql_url,
    getGraphQLMigrationURL,
} from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

//const HASURA_AACT = getHasuraURLAACT();
const NODE_ENDPOINT = getGraphQLMigrationURL();
const HASURA_CW = getHasuraClinwikiURL();
const HASURA_CW_DIS = getHasuraDISURL();

export const fetchPageViewsHasura = (siteId: any) => {
    return callHasuraClinwiki(HASURA_CW, query.PAGE_VIEWS_HASURA_QUERY, {
        id: siteId.siteId,
    });
};
export const fetchPageViewHasura = (id: any, url: any) => {
    return callHasuraClinwiki(HASURA_CW, query.PAGE_VIEW_HASURA_QUERY, {
        id: id,
        url: url,
    });
};

export const createPageViewHasura = (url, siteId) => {
    return callHasuraClinwiki(
        HASURA_CW,
        mutate.CREATE_PAGE_VIEW_HASURA_MUTATION,
        {
            url: url,
            siteId: siteId,
        }
    );
};
export const updatePageViewHasura = (id, input) => {
    return callHasuraClinwiki(
        HASURA_CW,
        mutate.UPDATE_PAGE_VIEW_HASURA_MUTATION,
        {
            siteId: id,
            title: input.title,
            url: input.url,
            template: input.template,
            default: input.default,
            pageType: input.pageType,
        }
    );
};
export const deletePageViewHasura = id => {
    return callHasuraClinwiki(
        HASURA_CW,
        mutate.DELETE_PAGE_VIEW_HASURA_MUTATION,
        { id: id }
    );
};

export const fetchFacilitiesPageHasura = (nctId: any) => {
    return callHasuraClinwiki(HASURA_CW, query.HASURA_FACILITY_ISLAND_QUERY, {
        nctId,
    });
};

export const fetchSampleStudy = (params: any, QUERY: any) => {
    return callGraphql(NODE_ENDPOINT, QUERY, { params });
};

export const fetchSearchPageMM = (params: any, QUERY: any) => {
    return callGraphql(NODE_ENDPOINT, QUERY, { params: params });
};

export const fetchSearchPageNearby = (params: any, QUERY: any) => {
    return callGraphql(NODE_ENDPOINT, QUERY, { params: params });
};

export const fetchSearchPageStudy = (params: any, QUERY: any) => {
    return callGraphql(NODE_ENDPOINT, QUERY, { params: params });
};

export const fetchHasuraSampleStudy = (nctId: any, QUERY: any) => {
    return callHasuraClinwiki(HASURA_CW, QUERY, { nctId });
};

export const fetchStudyPage = (nctId: any, QUERY: any) => {
    return callGraphql(HASURA_CW, QUERY, { nctId });
};

export const fetchStudyPageHasura = (nctId: any, HASURA_STUDY_QUERY: any) => {
    return callHasuraClinwiki(HASURA_CW, HASURA_STUDY_QUERY, { nctId });
};
export const fetchStudyPageHasuraDIS = (conditionId: any, HASURA_STUDY_QUERY: any) => {
    return callHasuraDIS(HASURA_CW_DIS, HASURA_STUDY_QUERY, { conditionId });
};

export const fetchHasuraWikiPage = (nctId: any) => {
    return callHasuraClinwiki(HASURA_CW, query.HASURA_WIKI_PAGE_QUERY, {
        nctId,
    });
};


export const wikiPageUpdateHasuraMutation = (
    nctId: any,
    text: any,
    isWikiContent: boolean
) => {
    if (isWikiContent) {
        return callHasuraClinwiki(
            HASURA_CW,
            mutate.WIKI_PAGE_UPDATE_HASURA_MUTATION,
            {
                nctId: nctId,
                text: text,
            }
        );
    } else {
        return callHasuraClinwiki(
            HASURA_CW,
            mutate.WIKI_PAGE_INSERT_HASURA_MUTATION,
            {
                nctId: nctId,
                text: text,
            }
        );
    }
};

export const fetchSuggestedLabels = (nctId: any, crowdKey: any) => {
    return callHasuraClinwiki(HASURA_CW, query.CROWD_VALUES_QUERY, {
        crowdKeyValueId: nctId,
        crowdKey: crowdKey,
    });
};