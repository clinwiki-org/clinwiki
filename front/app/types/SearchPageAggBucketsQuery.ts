/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SearchQueryInput, AggFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchPageAggBucketsQuery
// ====================================================

export interface SearchPageAggBucketsQuery_autocomplete_autocomplete_results {
  __typename: "AggBucket";
  key: string;
  docCount: number;
}

export interface SearchPageAggBucketsQuery_autocomplete_autocomplete {
  __typename: "Autocomplete";
  name: string;
  results: SearchPageAggBucketsQuery_autocomplete_autocomplete_results[];
}

export interface SearchPageAggBucketsQuery_autocomplete {
  __typename: "SearchResultSet";
  /**
   * autocomplete result
   */
  autocomplete: SearchPageAggBucketsQuery_autocomplete_autocomplete[] | null;
}

export interface SearchPageAggBucketsQuery {
  autocomplete: SearchPageAggBucketsQuery_autocomplete;
}

export interface SearchPageAggBucketsQueryVariables {
  agg: string;
  q: SearchQueryInput;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
  page: number;
  pageSize: number;
  aggOptionsFilter?: string | null;
}
