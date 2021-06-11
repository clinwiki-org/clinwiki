export const REINDEX_ALL_MUTATION = `mutation {
  reindexAll
}`;

export const REINDEX_STUDY_MUTATION = `mutation ReindexStudyMutation($input: String!) {
  reindexStudy(input: $input) 
}`;
