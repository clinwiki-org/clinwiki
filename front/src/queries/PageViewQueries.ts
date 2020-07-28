import { gql, MutationUpdaterFn } from 'apollo-boost';
import { useMutation, useQuery } from 'react-apollo';
import { UpdatePageViewInput } from 'types/globalTypes';
import { DataProxy } from 'apollo-cache';
import {
  PageViewsQuery,
  PageViewsQuery_site_pageViews,
  PageViewsQuery_site,
} from 'types/PageViewsQuery';
import { PageViewQuery } from 'types/PageViewQuery';

export const PAGE_VIEW_FRAGMENT = gql`
  fragment PageViewFragment on PageView {
    id
    pageType
    template
    title
    url
    default
  }
`;

export const PAGE_VIEWS_QUERY = gql`
  query PageViewsQuery($id: Int) {
    site(id: $id) {
      id
      pageViews {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;

const PAGE_VIEW_QUERY = gql`
  query PageViewQuery($id: Int, $url: String) {
    site(id: $id) {
      id
      pageView(url: $url) {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;

export function usePageViews(siteId?: number) {
  return useQuery<PageViewsQuery>(PAGE_VIEWS_QUERY, {
    variables: { id: siteId },
  });
}
export function usePageView(url : string, siteId?: number) {
  return useQuery<PageViewQuery>(PAGE_VIEW_QUERY, {
    variables: { id: siteId, url },
  });
}

const CREATE_PAGE_VIEW_MUTATION = gql`
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

/*
  This function can be used to insert the updated PageView into the SiteView without 
  hitting the server again. In this case I'm choosing to use refetchQueries because
  it simplifies the code substantially and this is admin functionality
  // update: (cache, { data }) => {
  //   const pageView = data.createPageView?.pageView;
  //   updatePageViewCache(cache, siteId, site => {
  //     return { ...site, pageViews: (site.pageViews||[]).concat(pageView) };
  //   });
  // },
*/
// function updatePageViewCache(
//   cache: DataProxy,
//   siteId: number,
//   updatePageView: (site: PageViewsQuery_site) => PageViewsQuery_site
// ) {

//   const result = cache.readQuery<PageViewsQuery>({
//     query: PAGE_VIEW_QUERY,
//     variables: { id: siteId },
//   });
//   if (result?.site) {
//     const updatedSite = updatePageView(result.site);
//     cache.writeQuery({
//       query: PAGE_VIEW_QUERY,
//       variables: { id: siteId },
//       data: { site: updatedSite },
//     });
//   }
// }

export function useCreatePageView(siteId: number) {
  const [doMutation] = useMutation(CREATE_PAGE_VIEW_MUTATION, {
    refetchQueries: [{ query: PAGE_VIEWS_QUERY, variables: { id: siteId } }],
  });
  return (url: string) => doMutation({ variables: { url: url, siteId } });
}

const DELETE_PAGE_VIEW_MUTATION = gql`
  mutation DeletePageViewMutation($id: Int!) {
    deletePageView(input: { id: $id }) {
      error
      pageView {
        id
      }
    }
  }
`;

export function useDeletePageView(siteId: number) {
  const [doMutation] = useMutation(DELETE_PAGE_VIEW_MUTATION, {
    refetchQueries: [{ query: PAGE_VIEWS_QUERY, variables: { id: siteId } }],
  });
  return (id: number) => doMutation({ variables: { id } });
}

const UPDATE_PAGE_VIEW_MUTATION = gql`
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

export function useUpdatePageView(siteId: number) {
  const [updatePageView] = useMutation(UPDATE_PAGE_VIEW_MUTATION, {
    refetchQueries: [{ query: PAGE_VIEWS_QUERY, variables: { id: siteId } }],
  });
  return (input: UpdatePageViewInput) =>
    updatePageView({ variables: { input } });
}
