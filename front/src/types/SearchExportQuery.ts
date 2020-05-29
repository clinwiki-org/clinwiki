/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchExportQuery
// ====================================================

export interface SearchExportQuery_searchExport {
  __typename: "SearchExport";
  downloadUrl: string | null;
}

export interface SearchExportQuery {
  /**
   * Retrieve an export by ID
   */
  searchExport: SearchExportQuery_searchExport | null;
}

export interface SearchExportQueryVariables {
  searchExportId: number;
}
