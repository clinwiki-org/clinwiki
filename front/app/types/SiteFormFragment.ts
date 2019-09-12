/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SiteFormFragment
// ====================================================

export interface SiteFormFragment_editors {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface SiteFormFragment {
  __typename: "Site";
  name: string;
  subdomain: string;
  editors: SiteFormFragment_editors[];
}
