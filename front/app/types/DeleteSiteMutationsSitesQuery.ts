/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeleteSiteMutationsSitesQuery
// ====================================================

export interface DeleteSiteMutationsSitesQuery_me_ownSites {
  __typename: "Site";
  id: number;
}

export interface DeleteSiteMutationsSitesQuery_me_editorSites {
  __typename: "Site";
  id: number;
}

export interface DeleteSiteMutationsSitesQuery_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  ownSites: DeleteSiteMutationsSitesQuery_me_ownSites[];
  editorSites: DeleteSiteMutationsSitesQuery_me_editorSites[];
}

export interface DeleteSiteMutationsSitesQuery {
  /**
   * Current logged in user
   */
  me: DeleteSiteMutationsSitesQuery_me | null;
}
