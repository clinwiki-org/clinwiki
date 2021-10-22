import * as query from './queries';
import * as mutate from './mutations';
import {
    callGraphql,
    callHasuraClinwiki,
    getHasuraClinwikiURL,
} from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT ="CHECKME";
const HASURA_CW = getHasuraClinwikiURL();

export const fetchAdminSiteView = () => {
    return callGraphql(ENDPOINT, query.ADMIN_SITE_VIEW_QUERY, {});
};

export const fetchSitesPage = () => {
    return callGraphql(ENDPOINT, query.SITES_PAGE_QUERY, {});
};

export const fetchSiteProvider = (id?, url?) => {
    return callGraphql(ENDPOINT, query.SITE_PROVIDER_QUERY, {
        id: id,
        url: url,
    });
};

export const fetchPresentSiteProvider = (id?, url?) => {
    return callGraphql(ENDPOINT, query.PRESENT_SITE_PROVIDER_QUERY, {
        id: id,
        url: url,
    });
};

export const fetchHasuraPresentSiteProvider = (id?, url?) => {
    return callHasuraClinwiki(
        HASURA_CW,
        query.HASURA_PRESENT_SITE_PROVIDER_QUERY,
        {
            url: url,
        }
    );
};

export const deleteSite = id => {
    return callGraphql(ENDPOINT, mutate.DELETE_SITE_MUTATION, {
        input: { id },
    });
};
export const createSite = (input, url?) => {
    return callGraphql(ENDPOINT, mutate.CREATE_SITE_MUTATION, {
        input: input,
        url,
    });
};
export const updateSite = (input, url?) => {
    return callGraphql(ENDPOINT, mutate.UPDATE_SITE_MUTATION, {
        input: input,
        url,
    });
};
export const createSiteView = input => {
    return callGraphql(ENDPOINT, mutate.CREATE_SITE_VIEW_MUTATION, {
        input: input,
    });
};
export const copySiteView = input => {
    return callGraphql(ENDPOINT, mutate.COPY_SITE_VIEW_MUTATION, {
        input: input,
    });
};
export const updateSiteView = input => {
    return callGraphql(ENDPOINT, mutate.UPDATE_SITE_VIEW_MUTATION, {
        input: input,
    });
};
export const deleteSiteView = input => {
    return callGraphql(ENDPOINT, mutate.DELETE_SITE_VIEW_MUTATION, {
        input: input,
    });
};
