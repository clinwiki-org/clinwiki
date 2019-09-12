/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CrowdFacetsInputQuery
// ====================================================

export interface CrowdFacetsInputQuery_site {
  __typename: "Site";
  id: number;
}

export interface CrowdFacetsInputQuery {
  /**
   * If id is missing, returns current site. If id == 0, returns default site
   */
  site: CrowdFacetsInputQuery_site | null;
}

export interface CrowdFacetsInputQueryVariables {
  id: number;
}
