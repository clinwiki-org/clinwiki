/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PageViewsQuery
// ====================================================

export interface PageViewsQuery_site_pageViews {
  __typename: "PageView";
  id: number;
  pageType: string;
  template: string;
  title: string;
  url: string;
  default: boolean;
}

export interface PageViewsQuery_site {
  __typename: "Site";
  id: number;
  pageViews: PageViewsQuery_site_pageViews[] | null;
}

export interface PageViewsQuery {
  /**
   * If id is missing, returns current site. If id == 0, returns default site
   */
  site: PageViewsQuery_site | null;
}

export interface PageViewsQueryVariables {
  id?: number | null;
}
