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
