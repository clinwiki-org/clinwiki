export const SITE_ITEM_FRAGMENT = `
fragment SiteItemFragment on Site {
  id
  name
  subdomain
}
`;

export const SITES_PAGE_QUERY = `
query sitesPageHasuraQuery {
  sites {
    id
    name
    subdomain
  }
}
`;

export const SITE_PROVIDER_QUERY = `
  query SiteProviderQuery($id: bigint, $url: String) {
    sites(where: {id: {_eq: $id}}) {
      id
      name
      skip_landing
      hide_donation
      subdomain
      themes
      reactions_config
      user_rank
    }
  }

`;