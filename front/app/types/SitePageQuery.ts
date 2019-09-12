/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SitePageQuery
// ====================================================

export interface SitePageQuery_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
}

export interface SitePageQuery {
  /**
   * Current logged in user
   */
  me: SitePageQuery_me | null;
}
