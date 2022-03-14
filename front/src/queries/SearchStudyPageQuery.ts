import gql from 'graphql-tag';

export default gql`
query SearchStudyPageQuery($hash: String!, $id: String!) {
  search(searchHash: $hash) {
    studyEdge(id: $id) {
      nextId
      prevId
      firstId
      lastId
      isWorkflow
      workflowName
      study {
        nctId
      }
      recordsTotal
      counterIndex
      firstId
      lastId
    }
  }
}
`;