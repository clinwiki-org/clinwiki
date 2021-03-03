/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageViewQuery
// ====================================================

export interface PageViewQuery_site_pageView {
  __typename: "PageView";
  id: number;
  pageType: string;
  template: string;
  title: string;
  url: string;
  default: boolean;
}

export interface PageViewQuery_site {
  __typename: "Site";
  id: number;
  pageView: PageViewQuery_site_pageView | null;
}

export interface PageViewQuery {
  /**
   * If id is missing, returns current site. If id == 0, returns default site
   */
  site: PageViewQuery_site | null;
}

export interface PageViewQueryVariables {
  id?: number | null;
  url?: string | null;
}
