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
