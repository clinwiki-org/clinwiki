import {
    callGraphql,
    getGraphQLMigrationURL,
    getHasuraClinwikiURL,
    callHasuraClinwiki,
} from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

//const HASURA_AACT = getHasuraURLAACT();
const HASURA_CW = getHasuraClinwikiURL();
const NODE_ENDPOINT = getGraphQLMigrationURL();

let vars = {};

export const fetchHasuraIntrospection = (QUERY: any) => {
    return callHasuraClinwiki(HASURA_CW, QUERY, vars);
};
export const fetchNodeIntrospection = (QUERY: any) => {
    return callGraphql(NODE_ENDPOINT, QUERY, vars);
};
