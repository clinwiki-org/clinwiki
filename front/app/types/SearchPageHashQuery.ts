/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SearchQueryInput, SortInput, AggFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchPageHashQuery
// ====================================================

export interface SearchPageHashQuery {
  /**
   * Search hash for search params
   */
  searchHash: string;
}

export interface SearchPageHashQueryVariables {
  q: SearchQueryInput;
  sorts?: SortInput[] | null;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
  page?: number | null;
  pageSize?: number | null;
}
