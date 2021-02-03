import { callGraphql, get_gql_url } from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const ENDPOINT = get_gql_url()

let vars = {}

export const fetchIntrospection = (QUERY: any) => {
    return callGraphql(ENDPOINT, QUERY , vars);
};
