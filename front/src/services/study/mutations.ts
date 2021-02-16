import {WORKFLOW_VIEW_PROVIDER_FRAGMENT} from './queries';

export const CREATE_STUDY_VIEW_LOG_MUTATION =`
mutation CreateStudyViewLogMutation($nctId: String!){
    createStudyViewLog(input: {
      nctId: $nctId
    }) {
        errors
        }
    }
  `;

  export const PAGE_VIEW_FRAGMENT = `
fragment PageViewFragment on PageView {
    id
    pageType
    template
    title
    url
    default
  }
`;

export const CREATE_PAGE_VIEW_MUTATION = `
  mutation CreatePageViewMutation($url: String!, $siteId: Int!) {
    createPageView(
      input: { url: $url, title: $url, template: "", siteId: $siteId }
    ) {
      errors
      pageView {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;

export const UPDATE_PAGE_VIEW_MUTATION = `
  mutation UpdatePageViewMutation($input: UpdatePageViewInput!) {
    updatePageView(input: $input) {
      errors
      pageView {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;

export const DELETE_PAGE_VIEW_MUTATION = `
  mutation DeletePageViewMutation($id: Int!) {
    deletePageView(input: { id: $id }) {
      error
      pageView {
        id
      }
    }
  }
`;
const FRAGMENT = `
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;

export const WikiPageEditFragment = `
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
const WIKI_PAGE_EDIT_FRAGMENT = `
  fragment WikiPageFragment on WikiPage {
    content
    edits {
      ...WikiPageEditFragment
    }
    nctId
    meta
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
  ${WIKI_PAGE_EDIT_FRAGMENT}
`;
export const WIKI_PAGE_FRAGMENT =`
  fragment WikiPageFragment on WikiPage {
    content
    edits {
      ...WikiPageEditFragment
    }
    nctId
    meta
  }
`;

export const WIKI_PAGE_UPDATE_CONTENT_MUTATION =`
  mutation WikiPageUpdateContentMutation($nctId: String!, $content: String!) {
    updateWikiContent(input: { nctId: $nctId, content: $content }) {
      wikiPage {
        ...WikiPageFragment
      }
      errors
    }
  }
  ${WIKI_PAGE_FRAGMENT}
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

export const DELETE_REVIEW_MUTATION = `
  mutation ReviewsPageDeleteReviewMutation($id: Int!) {
    deleteReview(input: { id: $id }) {
      success
      errors
    }
  }
`;

export const DELETE_REACTION = `
  mutation DeleteReaction(
    $id: Int!

  ) {
    deleteReaction(
        input : { id: $id }
    ) {
      reaction{
        study{
          dislikesCount
        }
 }

      errors
    }
  }
`;
export const CREATE_REACTION = `
  mutation CreateReaction(
    $reactionKindId: Int!
    $nctId: String!

  ) {
    createReaction(
        input : { reactionKindId: $reactionKindId, nctId: $nctId }
    ) {
      reaction{
          reactionKind{
            id
          }
      }
      errors
    }
  }
`;

export const UPDATE_WORKFLOW_PAGE_MUTATION = `
mutation UpdateWorkflowsViewMutation($input: UpdateWorkflowsViewInput!) {
  updateWorkflowsView(input: $input) {
    workflowsView {
      ...WorkflowsViewFragment
    }
    errors
  }
}

${WORKFLOW_VIEW_PROVIDER_FRAGMENT}
`
export const BULK_QUERY_UPDATE_MUTATION = `
  mutation BulkQueryUpdateMutation($input: BulkQueryUpdateInput!) {
    bulkQueryUpdate(input: $input) {
      clientMutationId
      undoActions {
        nctId
        state {
          enable
          name
          value
        }
      }
    }
  }
`;
export const BULK_LIST_UPDATE_MUTATION = `
  mutation BulkListUpdateMutation($input: BulkListUpdateInput!) {
    bulkListUpdate(input: $input) {
      clientMutationId
    }
  }
`;
export const REVIEW_FRAGMENT = `
   fragment ReviewFragment on Review {
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


export const REVIEW_FORM_MUTATION =`
  mutation ReviewFormMutation(
    $id: Int
    $nctId: String!
    $meta: String!
    $content: String!
  ) {
    upsertReview(
      input: { id: $id, nctId: $nctId, meta: $meta, content: $content }
    ) {
      review {
        ...ReviewFragment
      }
      errors
    }
  }

  ${REVIEW_FRAGMENT}
`;

