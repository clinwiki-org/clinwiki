import { getHasuraClinwikiURL } from './../../utils/graphqlUtil';
import * as query from './queries';
import * as mutate from './mutations';
import {
    callGraphql,
    // callHasuraAACT,
    callHasuraClinwiki,
    //getHasuraURLAACT,
    get_gql_url,
    getGraphQLMigrationURL,
} from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = get_gql_url();
//const HASURA_AACT = getHasuraURLAACT();
const NODE_ENDPOINT = getGraphQLMigrationURL();
const HASURA_CW = getHasuraClinwikiURL();

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

export const fetchHasuraSampleStudy = (nctId: any, QUERY: any) => {
    return callHasuraClinwiki(HASURA_CW, QUERY, { nctId });
};

export const fetchStudyPage = (nctId: any, QUERY: any) => {
    return callGraphql(HASURA_CW, QUERY, { nctId });
};

export const fetchStudyPageHasura = (nctId: any, HASURA_STUDY_QUERY: any) => {
    return callHasuraClinwiki(HASURA_CW, HASURA_STUDY_QUERY, { nctId });
};

export const fetchPageViews = (siteId: any) => {
    return callGraphql(ENDPOINT, query.PAGE_VIEWS_QUERY, {
        id: siteId.siteId,
    });
};
export const fetchPageView = (id: any, url: any) => {
    return callGraphql(ENDPOINT, query.PAGE_VIEW_QUERY, { id: id, url: url });
};
export const updateStudyViewLogCount = (nctId: any) => {
    return callGraphql(ENDPOINT, mutate.CREATE_STUDY_VIEW_LOG_MUTATION, {
        nctId,
    });
};
export const createPageView = (url, siteId) => {
    return callGraphql(ENDPOINT, mutate.CREATE_PAGE_VIEW_MUTATION, {
        url: url,
        siteId: siteId,
    });
};
export const updatePageView = (id, input) => {
    return callGraphql(ENDPOINT, mutate.UPDATE_PAGE_VIEW_MUTATION, {
        id: id,
        input: input,
    });
};
export const deletePageView = id => {
    return callGraphql(ENDPOINT, mutate.DELETE_PAGE_VIEW_MUTATION, { id: id });
};
export const fetchSearchStudyPage = (hash: string, id: string) => {
    return callGraphql(ENDPOINT, query.SEARCH_STUDY_PAGE_QUERY, { hash, id });
};
export const fetchWorkFlowPage = (nctId: any) => {
    return callGraphql(ENDPOINT, query.WORKFLOW_PAGE_QUERY, { nctId });
};
export const upsertLabelMutation = (nctId: any, key: any, value: any) => {
    return callGraphql(ENDPOINT, mutate.UPSERT_LABEL_MUTATION, {
        nctId: nctId,
        key: key,
        value: value,
    });
};
export const deleteLabelMutation = (nctId: any, key: any, value: any) => {
    return callGraphql(ENDPOINT, mutate.DELETE_LABEL_MUTATION, {
        nctId: nctId,
        key: key,
        value: value,
    });
};
export const fetchCrowdPage = (nctId: any) => {
    return callGraphql(ENDPOINT, query.CROWD_PAGE_QUERY, { nctId });
};
export const deleteReviewMutation = (id: any, nctId: any) => {
    return callGraphql(ENDPOINT, mutate.DELETE_REVIEW_MUTATION, { id, nctId });
};
export const fetchReviewPage = (nctId: any) => {
    return callGraphql(ENDPOINT, query.REVIEW_QUERY, { nctId });
};
export const fetchStudyEditsHistory = (nctId: string) => {
    return callGraphql(ENDPOINT, query.STUDY_EDITS_HISTORY_QUERY, { nctId });
};
export const fetchFacilitiesPage = (nctId: any) => {
    return callGraphql(ENDPOINT, query.FACILITIES_PAGE_QUERY, { nctId });
};
export const fetchWikiPage = (nctId: any) => {
    return callGraphql(ENDPOINT, query.WIKI_PAGE_QUERY, { nctId });
};

export const fetchHasuraWikiPage = (nctId: any) => {
    return callHasuraClinwiki(HASURA_CW, query.HASURA_WIKI_PAGE_QUERY, {
        nctId,
    });
};

export const wikiPageUpdateContentMutation = (nctId: any, content: any) => {
    return callGraphql(ENDPOINT, mutate.WIKI_PAGE_UPDATE_CONTENT_MUTATION, {
        nctId: nctId,
        content: content,
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
export const fetchAllWorkFlows = () => {
    return callGraphql(ENDPOINT, query.WORKFLOW_VIEW_PROVIDER, {});
};
export const fetchReactionsIsland = (nctId: any) => {
    return callGraphql(ENDPOINT, query.REACTIONS_ISLAND_QUERY, { nctId });
};
export const deleteReaction = (id: any) => {
    return callGraphql(ENDPOINT, mutate.DELETE_REACTION, { id });
};
export const fetchReactionKinds = () => {
    return callGraphql(ENDPOINT, query.REACTION_KINDS, {});
};
export const fetchStudyReactions = (nctId: string) => {
    return callGraphql(ENDPOINT, query.STUDY_REACTIONS, { nctId });
};
export const createReaction = (nctId: string, reactionKindId: any) => {
    return callGraphql(ENDPOINT, mutate.CREATE_REACTION, {
        nctId: nctId,
        reactionKindId: reactionKindId,
    });
};
export const fetchReactionsById = (reactionKindId: any) => {
    return callGraphql(ENDPOINT, query.REACTIONS_QUERY, {
        reactionKindId: reactionKindId,
    });
};
export const upsertReviewFormMutation = (
    id: any,
    nctId: any,
    meta: any,
    content: any
) => {
    return callGraphql(ENDPOINT, mutate.REVIEW_FORM_MUTATION, {
        id: id,
        nctId: nctId,
        meta: meta,
        content: content,
    });
};
export const fetchEditReview = (nctId: any) => {
    return callGraphql(ENDPOINT, query.EDIT_REVIEW_QUERY, { nctId });
};
export const updateWorkflowPage = (input: any) => {
    return callGraphql(ENDPOINT, mutate.UPDATE_WORKFLOW_PAGE_MUTATION, input);
};
export const fetchLabels = variables => {
    return callGraphql(ENDPOINT, query.LABELS_QUERY, variables);
};
export const fetchLabelsBuckets = (variables, QUERY) => {
    return callGraphql(ENDPOINT, QUERY, variables);
};
export const bulkQueryUpdate = (input: any) => {
    return callGraphql(ENDPOINT, mutate.BULK_QUERY_UPDATE_MUTATION, input);
};
export const bulkListUpdate = (input: any) => {
    return callGraphql(ENDPOINT, mutate.BULK_LIST_UPDATE_MUTATION, input);
};
