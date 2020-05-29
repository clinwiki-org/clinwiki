/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllQuery
// ====================================================

export interface AllQuery_study_facilities {
  __typename: "Facility";
  id: number;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface AllQuery_study_interventions {
  __typename: "Intervention";
  /**
   * Intervention id
   */
  id: number;
  /**
   * Intervention name
   */
  name: string | null;
  /**
   * Intervention description
   */
  description: string | null;
}

export interface AllQuery_study {
  __typename: "Study";
  nctId: string;
  briefSummary: string | null;
  detailedDescription: string | null;
  eligibilityCriteria: string;
  conditions: string | null;
  briefTitle: string;
  overallStatus: string;
  createdAt: any;
  updatedAt: any;
  facilities: AllQuery_study_facilities[];
  interventions: AllQuery_study_interventions[];
}

export interface AllQuery {
  study: AllQuery_study | null;
}

export interface AllQueryVariables {
  nctId: string;
}
