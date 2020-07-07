import { gql } from 'apollo-boost';

export const PAGE_VIEW_QUERY = gql`
  query PageViewsQuery($id: Int!) {
    site(id: $id) {
      id
      pageViews {
        id
        pageType
        template
        title
        url
      }
    }
  }
`;

export const CREATE_PAGE_VIEW_MUTATION = gql`
  mutation CreatePageViewMutation($url: String!, $siteId: Int!) {
    createPageView(
      input: { url: $url, title: $url, template: "", siteId: $siteId }
    ) {
      errors
      pageView {
        id
        url
      }
    }
  }
`;

export const DELETE_PAGE_VIEW_MUTATION = gql`
  mutation DeletePageViewMutation(
`;

// export const UPDATE_PAGE_VIEW_MUTATION = gql``;
