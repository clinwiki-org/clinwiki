import * as mutate from './mutations'
import * as query from './queries';
import { callGraphql, callHasura, getHasuraClinwikiURL, callHasuraClinwiki} from 'utils/graphqlUtil';
                                                                                    
// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant 

const HASURA_ENDPOINT = getHasuraClinwikiURL();                                     

export const updateSiteHasura = (input, HASURA_UPDATE_SITE?:any, url?) => {
    return callHasura(HASURA_ENDPOINT, mutate.UPDATE_SITE_MUTATION,
        { input: input, url });
};
export const fetchSitesPageHasura = () => {
    console.log("fetchSitesPageHasura called in hasuraSite api")
    return callHasuraClinwiki(HASURA_ENDPOINT, query.SITES_PAGE_QUERY, {});
}

