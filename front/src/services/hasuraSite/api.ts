import * as mutate from './mutations';
import * as query from './queries';
import { getHasuraClinwikiURL } from 'utils/graphqlUtil';
import {
  callHasuraClinwiki, 
  callGraphql,     
  getGraphQLMigrationURL,

} from 'utils/graphqlUtil';
// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const HASURA_CW = getHasuraClinwikiURL();
const NODE_ENDPOINT = getGraphQLMigrationURL();

export const updateSiteHasura = (input, url?) => {
  //console.log('mutation = ', mutate.UPDATE_SITE_MUTATION);
  //console.log('input = ', input);
  console.log('SITE UPDATE', mutate.UPDATE_SITE_MUTATION)
  return callHasuraClinwiki(HASURA_CW, mutate.UPDATE_SITE_MUTATION, {
    id: input.id,
    name: input.name,
    subdomain: input.subdomain,
    hide_donation: input.hide_donation,
    reactions_config: input.reactions_config,
    skip_landing: input.skip_landing,
    themes: input.themes,
    user_rank: input.user_rank,
  });
  //{ input: { id: input.id, name: input.name}});
};
export const fetchSitesPageHasura = () => {
  //console.log("fetchSitesPageHasura called in hasuraSite api")
  return callHasuraClinwiki(HASURA_CW, query.SITES_PAGE_QUERY, {});
};

export const fetchSiteProviderHasura = (id?, url?) => {
  //console.log("fetchSiteProviderHasura called in hasuraSite api")
  return callHasuraClinwiki(HASURA_CW, query.SITE_PROVIDER_QUERY, {
    id: id,
    url: url,
  });
};

// export const fetchGeneric = (query) => {
//   //console.log("fetchSitesPageHasura called in hasuraSite api")
//   return callHasuraClinwiki(HASURA_CW, query, {});
// };

export const fetchGeneric = (value: any, variable: any,  QUERY: any, useHasura:boolean) => {
  let endPoint = useHasura ? HASURA_CW : NODE_ENDPOINT;
  let object ={}
  object[variable] = value
return variable == 'null' ? callGraphql(endPoint, QUERY, undefined): callGraphql(endPoint, QUERY,object);
};
export const updateGeneric = (input, mutation?) => {
  console.log('UPDATE API', mutation)
  //console.log('mutation = ' mutate.UPDATE_SITE_MUTATION);
  //console.log('input = ', input);
  return callHasuraClinwiki(HASURA_CW, mutation, {
   ...input
  })
  //{ input: { id: input.id, name: input.name}});
};