import * as query from './queries';
import { callGraphql } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = 'http://localhost:3000/graphql'

export const fetchAdminSiteView = () => {
    return callGraphql(ENDPOINT, query.ADMIN_SITE_VIEW_QUERY, {});
};

export const fetchSitesPage = () => {
    return callGraphql(ENDPOINT, query.SITES_PAGE_QUERY, {});
}