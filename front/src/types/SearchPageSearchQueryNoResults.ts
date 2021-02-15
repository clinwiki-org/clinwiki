/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchQueryInput, SortInput, AggFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchPageSearchQueryNoResults
// ====================================================

export interface SearchPageSearchQueryNoResults_search {
  __typename: "SearchResultSet";
  /**
   * Total results
   */
  recordsTotal: number | null;
}

export interface SearchPageSearchQueryNoResults {
  /**
   * Searches params by searchHash on server and `params` argument into it
   */
  search: SearchPageSearchQueryNoResults_search | null;
}

export interface SearchPageSearchQueryNoResultsVariables {
  q: SearchQueryInput;
  page?: number | null;
  pageSize?: number | null;
  sorts?: SortInput[] | null;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
}
