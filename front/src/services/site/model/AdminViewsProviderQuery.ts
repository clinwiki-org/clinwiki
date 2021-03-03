/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminViewsProviderQuery
// ====================================================

export interface AdminViewsProviderQuery_site_siteViews_search {
  __typename: "SiteSearchPage";
  type: string;
}

export interface AdminViewsProviderQuery_site_siteViews {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  search: AdminViewsProviderQuery_site_siteViews_search;
}

export interface AdminViewsProviderQuery_site {
  __typename: "Site";
  id: number;
  hideDonation: boolean | null;
  siteViews: AdminViewsProviderQuery_site_siteViews[];
}

export interface AdminViewsProviderQuery {
  /**
   * If id is missing, returns current site. If id == 0, returns default site
   */
  site: AdminViewsProviderQuery_site | null;
}

export interface AdminViewsProviderQueryVariables {
  id?: number | null;
}
