export const CREATE_STUDY_VIEW_LOG_MUTATION =`
mutation CreateStudyViewLogMutation($nctId: String!){
    createStudyViewLog(input: {
      nctId: $nctId
    }) {
        errors
        }
    }
  `;

  const FRAGMENT = `
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;

const WikiPageEditFragment = `
  fragment WikiPageEditFragment on WikiPageEdit {
    user {
      id
      firstName
      lastName
      email
    }
    createdAt
    id
    comment
    diff
    diffHtml
    changeSet {
      bodyChanged
      frontMatterChanged
      editLines {
        status
        content
        frontMatter
        body
      }
    }
  }
`;

export const UPSERT_LABEL_MUTATION = `
  mutation CrowdPageUpsertWikiLabelMutation(
    $nctId: String!
    $key: String!
    $value: String!
  ) {
    upsertWikiLabel(input: { nctId: $nctId, key: $key, value: $value }) {
      wikiPage {
        ...CrowdPageFragment
        edits {
          ...WikiPageEditFragment
        }
      }
      errors
    }
  }

  ${FRAGMENT}
  ${WikiPageEditFragment}
`;
  
export const DELETE_LABEL_MUTATION = `
  mutation CrowdPageDeleteWikiLabelMutation($nctId: String!, $key: String!) {
    deleteWikiLabel(input: { nctId: $nctId, key: $key }) {
      wikiPage {
        ...CrowdPageFragment
        edits {
          ...WikiPageEditFragment
        }
      }
      errors
    }
  }

  ${FRAGMENT}
  ${WikiPageEditFragment}
`;