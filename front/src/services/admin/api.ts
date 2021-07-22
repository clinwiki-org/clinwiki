import * as query from './queries';
import {
  callGraphql,
  get_gql_url,
  getGraphQLMigrationURL,
} from 'utils/graphqlUtil';

// This is a temporary measure to support different enpoints during the backend migration to NodeJS
// Once that is complete, all endpoint URLs should be pulled from a common constant

const NODE_ENDPOINT = getGraphQLMigrationURL();

export const reindexAll = () => {
  return callGraphql(NODE_ENDPOINT, query.REINDEX_ALL_MUTATION, {});
};

export const reindexStudy = (nctId:String) => {
    return callGraphql(NODE_ENDPOINT, query.REINDEX_STUDY_MUTATION, {input:nctId});
  };
export const reindexDocument = (primaryKey:string , primaryKeyList:string , indexName: string) => {
    return callGraphql(NODE_ENDPOINT, query.REINDEX_DOCUMENT_MUTATION, {primaryKey, primaryKeyList, indexName});
  };
  