import gql from 'graphql-tag';

export default gql`
query UserSavedSearchesQuery($userId: Int!){
    savedSearch(userId: $userId) {
        id
        userId
        nameLabel
        createdAt
        updatedAt
        isSubscribed
        shortLink {
            long
            short
        }  
    }
} 
`;