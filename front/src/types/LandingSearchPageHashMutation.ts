/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchQueryInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: LandingSearchPageHashMutation
// ====================================================

export interface LandingSearchPageHashMutation_provisionSearchHash_searchHash {
  __typename: "ShortLink";
  short: string | null;
}

export interface LandingSearchPageHashMutation_provisionSearchHash {
  __typename: "SearchHashMutationPayload";
  searchHash: LandingSearchPageHashMutation_provisionSearchHash_searchHash | null;
}

export interface LandingSearchPageHashMutation {
  provisionSearchHash: LandingSearchPageHashMutation_provisionSearchHash | null;
}

export interface LandingSearchPageHashMutationVariables {
  q: SearchQueryInput;
}
