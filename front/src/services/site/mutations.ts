
import { SITE_FRAGMENT } from 'services/site/model/SiteFragment'; //TODO Move/delete site fragment from SiteProvider.tsx when we do redux there.


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