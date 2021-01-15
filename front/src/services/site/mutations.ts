
import { SITE_FRAGMENT } from 'services/site/SiteFragments'; //TODO Move/delete site fragment from SiteProvider.tsx when we do redux there.
import { SITE_VIEW_FRAGMENT } from 'services/site/SiteFragments';

export const DELETE_SITE_MUTATION = `
mutation DeleteSiteMutation($input: DeleteSiteInput!) {
  deleteSite(input: $input) {
    site {
      id
    }
  }
}
`;

export const CREATE_SITE_MUTATION = `
  mutation CreateSiteMutation($input: CreateSiteInput!, $url: String) {
    createSite(input: $input) {
      site {
        ...SiteFragment
      }
      errors
    }
  }

  ${SITE_FRAGMENT}
`;


export const UPDATE_SITE_MUTATION = `
  mutation UpdateSiteMutation($input: UpdateSiteInput!, $url: String) {
    updateSite(input: $input) {
      site {
        ...SiteFragment
      }
      errors
    }
  }

  ${SITE_FRAGMENT}
`;

export const COPY_SITE_VIEW_MUTATION = `
  mutation CopySiteViewMutation($input: CopySiteViewInput!) {
    copySiteView(input: $input) {
      siteView {
        ...SiteViewFragment
      }
      errors
    }
  }

  ${SITE_VIEW_FRAGMENT}
`;

export const UPDATE_SITE_VIEW_MUTATION = `
  mutation UpdateSiteViewMutation($input: UpdateSiteInput!) {
    updateSite(input: $input) {
      siteView {
        ...SiteViewFragment
      }
      errors
    }
  }

  ${SITE_VIEW_FRAGMENT}
`;

export const CREATE_SITE_VIEW_MUTATION = `
  mutation CreateSiteViewMutation($input: CreateSiteViewInput!, $url: String) {
    createSiteView(input: $input) {
      siteView {
        ...SiteViewFragment
      }
      errors
    }
  }

  ${SITE_VIEW_FRAGMENT}
`;

export const DELETE_SITE_VIEW_MUTATION = `
mutation DeleteSiteViewMutation($input: DeleteSiteViewInput!) {
  deleteSiteView(input: $input) {
    siteView {
      id
    }
  }
}
`;

