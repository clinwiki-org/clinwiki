/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SampleStudyQuery
// ====================================================

export interface SampleStudyQuery_study {
  __typename: "Study";
  briefTitle: string;
}

export interface SampleStudyQuery {
  study: SampleStudyQuery_study | null;
}

export interface SampleStudyQueryVariables {
  nctId: string;
}
