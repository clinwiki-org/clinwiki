/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ExportToCsvMutation
// ====================================================

export interface ExportToCsvMutation_exportToCsv_searchExport {
  __typename: "SearchExport";
  id: number;
}

export interface ExportToCsvMutation_exportToCsv {
  __typename: "ExportToCsvPayload";
  searchExport: ExportToCsvMutation_exportToCsv_searchExport | null;
}

export interface ExportToCsvMutation {
  exportToCsv: ExportToCsvMutation_exportToCsv | null;
}

export interface ExportToCsvMutationVariables {
  searchHash: string;
  siteViewId: number;
}
