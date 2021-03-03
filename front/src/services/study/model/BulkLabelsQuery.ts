/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

export interface SearchInput {
    q: SearchQueryInput;
    page?: number | null;
    pageSize?: number | null;
    sorts?: SortInput[] | null;
    aggOptionsFilter?: string | null;
    aggOptionsSort?: SortInput[] | null;
    aggFilters?: AggFilterInput[] | null;
    crowdAggFilters?: AggFilterInput[] | null;
    agg?: string | null;
  }
  /**
 * An input type for a search query param (q).
 * This is a tree like structure where leafs are the search terms and
 * tree nodes are the AND / OR conditions.
 */
export interface SearchQueryInput {
    key: string;
    children?: SearchQueryInput[] | null;
  }
  /**
 * Column to sort by
 */
export interface SortInput {
    id: string;
    desc?: boolean | null;
  }
  /**
 * An Agg Filter
 */
export interface AggFilterInput {
    field: string;
    values?: string[] | null;
    gte?: string | null;
    lte?: string | null;
    includeMissingFields?: boolean | null;
    zipcode?: string | null;
    radius?: string | null;
    lat?: number | null;
    long?: number | null;
  }
  
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
