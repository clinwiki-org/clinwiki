/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SearchQueryInput, AggFilterInput, SortInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchPageAggBucketsQuery
// ====================================================

export interface SearchPageAggBucketsQuery_aggBuckets_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  docCount: number;
}

export interface SearchPageAggBucketsQuery_aggBuckets_aggs {
  __typename: "Agg";
  name: string;
  buckets: SearchPageAggBucketsQuery_aggBuckets_aggs_buckets[];
}

export interface SearchPageAggBucketsQuery_aggBuckets {
  __typename: "SearchResultSet";
  aggs: SearchPageAggBucketsQuery_aggBuckets_aggs[] | null;
}

export interface SearchPageAggBucketsQuery {
  aggBuckets: SearchPageAggBucketsQuery_aggBuckets;
}

export interface SearchPageAggBucketsQueryVariables {
  agg: string;
  q: SearchQueryInput;
  aggFilters?: AggFilterInput[] | null;
  crowdAggFilters?: AggFilterInput[] | null;
  page: number;
  pageSize: number;
  aggOptionsFilter?: string | null;
  aggOptionsSort?: SortInput[] | null;
  url?: string | null;
  configType?: string | null;
  returnAll?: boolean | null;
}
