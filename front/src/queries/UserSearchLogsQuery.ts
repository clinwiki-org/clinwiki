import gql from 'graphql-tag';

export default gql`
query UserSearchLogsQuery($userId: Int!){
        searchLog(userId: $userId) {
      	createdAt
   			nameDefault
        }
    }
`;