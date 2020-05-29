/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CreateSiteOwnSitesQuery
// ====================================================

export interface CreateSiteOwnSitesQuery_me_ownSites {
  __typename: "Site";
  id: number;
  name: string;
  subdomain: string;
}

export interface CreateSiteOwnSitesQuery_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  ownSites: CreateSiteOwnSitesQuery_me_ownSites[];
}

export interface CreateSiteOwnSitesQuery {
  /**
   * Current logged in user
   */
  me: CreateSiteOwnSitesQuery_me | null;
}
