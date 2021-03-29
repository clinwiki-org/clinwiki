import * as mutate from './mutations'
import * as query from './queries';
import { callGraphql, callHasura, getHasuraClinwikiURL, callHasuraClinwiki} from 'utils/graphqlUtil';
                                                                                    
// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant 

const HASURA_ENDPOINT = getHasuraClinwikiURL();                                     

export const updateSiteHasura = (input, url?) => {
    //console.log('mutation = ', mutate.UPDATE_SITE_MUTATION);
    //console.log('input = ', input);
    return callHasuraClinwiki(HASURA_ENDPOINT, mutate.UPDATE_SITE_MUTATION,
        { id: input.id, name: input.name, subdomain: input.subdomain, hide_donation: input.hide_donation, reactions_config: input.reactions_config, skip_landing: input.skip_landing, themes: input.themes, user_rank: input.user_rank});
        //{ input: { id: input.id, name: input.name}});
};
export const fetchSitesPageHasura = () => {
    //console.log("fetchSitesPageHasura called in hasuraSite api")
    return callHasuraClinwiki(HASURA_ENDPOINT, query.SITES_PAGE_QUERY, {});
}

export const fetchSiteProviderHasura = (id?, url?) => {
    //console.log("fetchSiteProviderHasura called in hasuraSite api")
    return callHasuraClinwiki(HASURA_ENDPOINT, query.SITE_PROVIDER_QUERY,
        { id: id, url: url});
}