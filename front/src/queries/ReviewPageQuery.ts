import gql from 'graphql-tag';
const FRAGMENT = gql`
  fragment ReviewsPageFragment on Review {
    id
    meta
    content
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
  }
`;
export default gql`
query ReviewPageQuery($nctId: String!) {
  study(nctId: $nctId) {
    reviews {
      ...ReviewsPageFragment
    }
    nctId
  }
  me {
    id
  }
}  
${FRAGMENT}
`;