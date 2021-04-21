import * as query from './queries';
import { getHasuraClinwikiURL, callHasuraClinwiki } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const HASURA_CW = getHasuraClinwikiURL();

export const fetchFacilitiesPageHasura = (nctId: any) => {
    return callHasuraClinwiki(HASURA_CW, query.FACILITIES_PAGE_QUERY, { nctId });
};
