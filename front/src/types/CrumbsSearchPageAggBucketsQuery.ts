/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchQueryInput, AggFilterInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: CrumbsSearchPageAggBucketsQuery
// ====================================================

export interface CrumbsSearchPageAggBucketsQuery_autocomplete_autocomplete_results {
  __typename: "AggBucket";
  key: string;
  docCount: number;
}

export interface CrumbsSearchPageAggBucketsQuery_autocomplete_autocomplete {
  __typename: "Autocomplete";
  name: string;
  isCrowd: boolean;
  results: CrumbsSearchPageAggBucketsQuery_autocomplete_autocomplete_results[];
}

export interface CrumbsSearchPageAggBucketsQuery_autocomplete {
  __typename: "SearchResultSet";
  /**
   * autocomplete result
   */
  autocomplete: CrumbsSearchPageAggBucketsQuery_autocomplete_autocomplete[] | null;
}

export interface CrumbsSearchPageAggBucketsQuery {
  autocomplete: CrumbsSearchPageAggBucketsQuery_autocomplete;
}

export interface CrumbsSearchPageAggBucketsQueryVariables {
  agg: string;
  q: SearchQueryInput;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
  page: number;
  pageSize: number;
  aggOptionsFilter?: string | null;
  aggFields: string[];
  crowdAggFields: string[];
  url?: string | null;
}
