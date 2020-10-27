import gql from 'graphql-tag';

export default gql`
query ReactionsIslandQuery($nctId: String!) {
  study(nctId: $nctId) {
    reactionsCount {
      name
      count
    }
    nctId
  }
}

`;
