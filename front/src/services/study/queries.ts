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
export const PAGE_VIEWS_QUERY = `
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


export const PAGE_VIEW_QUERY = `
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

export const getSampleStudyQuery = (name: string, frag: string) => {
  frag = frag || `fragment ${name} on Study { nctId }`;
  return `
  query SampleStudyQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...${name}
    }
  }
  ${frag}
`;
};