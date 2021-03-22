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
