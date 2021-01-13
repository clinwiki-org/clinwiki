/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchQueryInput, SortInput, AggFilterInput } from "../../../types/globalTypes";

// ====================================================
// GraphQL query operation: SearchPageAggsQuery
// ====================================================

export interface SearchPageAggsQuery_crowdAggs_aggs_buckets {
  __typename: "AggBucket";
  key: string;
}

export interface SearchPageAggsQuery_crowdAggs_aggs {
  __typename: "Agg";
  buckets: SearchPageAggsQuery_crowdAggs_aggs_buckets[];
}

export interface SearchPageAggsQuery_crowdAggs {
  __typename: "SearchResultSet";
  aggs: SearchPageAggsQuery_crowdAggs_aggs[] | null;
}

export interface SearchPageAggsQuery_search_aggs {
  __typename: "Agg";
  name: string;
}

export interface SearchPageAggsQuery_search {
  __typename: "SearchResultSet";
  /**
   * Total results
   */
  recordsTotal: number | null;
  aggs: SearchPageAggsQuery_search_aggs[] | null;
}

export interface SearchPageAggsQuery {
  crowdAggs: SearchPageAggsQuery_crowdAggs;
  /**
   * Searches params by searchHash on server and `params` argument into it
   */
  search: SearchPageAggsQuery_search | null;
}

export interface SearchPageAggsQueryVariables {
  q: SearchQueryInput;
  page?: number | null;
  pageSize?: number | null;
  sorts?: SortInput[] | null;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
}
