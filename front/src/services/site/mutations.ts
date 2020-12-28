
export const DELETE_SITE_MUTATION = `
mutation DeleteSiteMutation($input: DeleteSiteInput!) {
  deleteSite(input: $input) {
    site {
      id
    }
  }
}
`;