/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReactionsIslandQuery
// ====================================================

export interface ReactionsIslandQuery_study_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface ReactionsIslandQuery_study {
  __typename: "Study";
  reactionsCount: ReactionsIslandQuery_study_reactionsCount[] | null;
  nctId: string;
}

export interface ReactionsIslandQuery {
  study: ReactionsIslandQuery_study | null;
}

export interface ReactionsIslandQueryVariables {
  nctId: string;
}

