/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AdminSiteViewFragment
// ====================================================

export interface AdminSiteViewFragment_search {
  __typename: "SiteSearchPage";
  type: string;
}

export interface AdminSiteViewFragment {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  search: AdminSiteViewFragment_search;
}
