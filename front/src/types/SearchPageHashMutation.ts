/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchQueryInput, SortInput, AggFilterInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SearchPageHashMutation
// ====================================================

export interface SearchPageHashMutation_provisionSearchHash_searchHash {
  __typename: "ShortLink";
  short: string | null;
}

export interface SearchPageHashMutation_provisionSearchHash {
  __typename: "SearchHashMutationPayload";
  searchHash: SearchPageHashMutation_provisionSearchHash_searchHash | null;
}

export interface SearchPageHashMutation {
  provisionSearchHash: SearchPageHashMutation_provisionSearchHash | null;
}

export interface SearchPageHashMutationVariables {
  q: SearchQueryInput;
  sorts?: SortInput[] | null;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
  page?: number | null;
  pageSize?: number | null;
}
