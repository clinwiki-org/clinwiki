import { SITE_FRAGMENT } from './SiteFragments';

export const ADMIN_SITE_VIEW_FRAGMENT = `
    fragment AdminSiteViewFragment on SiteView {
        name
        url
        id
        search {
            type
        }
    }
`;

export const ADMIN_SITE_VIEW_QUERY = `
    query AdminViewsProviderQuery($id: Int) {
        site(id: $id) {
            id
            hideDonation
            siteViews {
                ...AdminSiteViewFragment
            }
        }
    }

    ${ADMIN_SITE_VIEW_FRAGMENT}
`;


export const SITE_ITEM_FRAGMENT = `
fragment SiteItemFragment on Site {
  id
  name
  subdomain
}
`;

export const SITES_PAGE_QUERY = `
  query SitesPageQuery {
    me {
      id
      ownSites {
        ...SiteItemFragment
      }
      editorSites {
        ...SiteItemFragment
      }
    }
  }

  ${SITE_ITEM_FRAGMENT}
`;

export const SITE_PROVIDER_QUERY = `
  query SiteProviderQuery($id: Int, $url: String) {
    site(id: $id) {
      ...SiteFragment
    }
  }

  ${SITE_FRAGMENT}
`;