/* tslint:disable */
/* eslint-disable */
// @generated
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
  skipLanding: boolean | null;
  editors: SiteFormFragment_editors[];
}
