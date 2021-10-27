import * as query from './queries';
import * as mutate from './mutations';
import {
    callGraphql,
    callHasuraClinwiki,
    getHasuraClinwikiURL,
} from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const HASURA_CW = getHasuraClinwikiURL();



export const fetchHasuraPresentSiteProvider = (id?, url?) => {
    return callHasuraClinwiki(
        HASURA_CW,
        query.HASURA_PRESENT_SITE_PROVIDER_QUERY,
        {
            url: url,
        }
    );
};

