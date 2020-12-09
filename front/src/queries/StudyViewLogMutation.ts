import gql from 'graphql-tag'

export default gql`
mutation CreateStudyViewLogMutation($nctId: String!){
    createStudyViewLog(input: {
      nctId: $nctId
    }) {
        errors
        }
    }
  `;