export const REINDEX_ALL_MUTATION = `mutation {
  reindexAll
}`;

export const REINDEX_STUDY_MUTATION = `mutation ReindexStudyMutation($input: String!) {
  reindexStudy(input: $input) 
}`;
export const REINDEX_DOCUMENT_MUTATION = `mutation ReindexDocumentMutation( $primaryKey: String , $primaryKeyList: String , $indexName: String) {
  reindexDocument(primaryKey:$primaryKey , primaryKeyList:$primaryKeyList , indexName: $indexName) 
}`;
