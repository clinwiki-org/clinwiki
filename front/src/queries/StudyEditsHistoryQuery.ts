import { gql } from 'apollo-boost';

export default gql`
  query StudyEditsHistoryQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        edits {
          id
          createdAt
          changeSet {
            frontMatterChanged
            bodyChanged
            editLines {
              body
              content
              frontMatter
              status
            }
          }
          comment
          diff
          diffHtml
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;
