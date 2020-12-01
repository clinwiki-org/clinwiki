import { gql }  from '@apollo/client';
export default  gql`
  query StudyReactions($nctId: String!) {
    me {
        id
        email
        firstName
        lastName
        reactions(nctId: $nctId){
          id
          reactionKindId
          reactionKind{
            id
            name
            unicode
          }
          study{
            briefTitle
          }
          nctId
        }
    }
  }

`;

