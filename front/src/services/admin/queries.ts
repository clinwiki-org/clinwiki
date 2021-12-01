export const REINDEX_ALL_MUTATION = `mutation {
  reindexAll
}`;
export const ACTION_QUERY = `mutation ActionQuery($input: String){
  actionQuery(input:$input)
}`;
export const REINDEX_ALL_DOCUMENTS_MUTATION  = `mutation ReindexAllDocumentsMutation( $primaryKey: String , $indexName: String) {
  reindexAllDocuments(primaryKey:$primaryKey, indexName: $indexName) 
}`;

export const REINDEX_STUDY_MUTATION = `mutation ReindexStudyMutation($input: String!) {
  reindexStudy(input: $input) 
}`;
export const REINDEX_DOCUMENT_MUTATION = `mutation ReindexDocumentMutation( $primaryKey: String , $primaryKeyList: String , $indexName: String) {
  reindexDocument(primaryKey:$primaryKey , primaryKeyList:$primaryKeyList , indexName: $indexName) 
}`;
