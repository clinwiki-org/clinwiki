/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SearchInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: BulkLabelsQuery
// ====================================================

export interface BulkLabelsQuery_myCrowdAggs_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  docCount: number;
}

export interface BulkLabelsQuery_myCrowdAggs_aggs {
  __typename: "Agg";
  name: string;
  buckets: BulkLabelsQuery_myCrowdAggs_aggs_buckets[];
}

export interface BulkLabelsQuery_myCrowdAggs {
  __typename: "SearchResultSet";
  aggs: BulkLabelsQuery_myCrowdAggs_aggs[] | null;
}

export interface BulkLabelsQuery_allCrowdAggs_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  docCount: number;
}

export interface BulkLabelsQuery_allCrowdAggs_aggs {
  __typename: "Agg";
  name: string;
  buckets: BulkLabelsQuery_allCrowdAggs_aggs_buckets[];
}

export interface BulkLabelsQuery_allCrowdAggs {
  __typename: "SearchResultSet";
  aggs: BulkLabelsQuery_allCrowdAggs_aggs[] | null;
}

export interface BulkLabelsQuery_search {
  __typename: "SearchResultSet";
  /**
   * Total results
   */
  recordsTotal: number | null;
}

export interface BulkLabelsQuery {
  myCrowdAggs: BulkLabelsQuery_myCrowdAggs;
  allCrowdAggs: BulkLabelsQuery_allCrowdAggs;
  /**
   * Searches params by searchHash on server and `params` argument into it
   */
  search: BulkLabelsQuery_search | null;
}

export interface BulkLabelsQueryVariables {
  searchHash: string;
  params: SearchInput;
}
