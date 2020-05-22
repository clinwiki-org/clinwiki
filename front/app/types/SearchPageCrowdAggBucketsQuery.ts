/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SearchQueryInput, AggFilterInput, SortInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchPageCrowdAggBucketsQuery
// ====================================================

export interface SearchPageCrowdAggBucketsQuery_aggBuckets_aggs_buckets {
  __typename: "AggBucket";
  key: string;
  keyAsString: string | null;
  docCount: number;
}

export interface SearchPageCrowdAggBucketsQuery_aggBuckets_aggs {
  __typename: "Agg";
  buckets: SearchPageCrowdAggBucketsQuery_aggBuckets_aggs_buckets[];
}

export interface SearchPageCrowdAggBucketsQuery_aggBuckets {
  __typename: "SearchResultSet";
  aggs: SearchPageCrowdAggBucketsQuery_aggBuckets_aggs[] | null;
}

export interface SearchPageCrowdAggBucketsQuery {
  aggBuckets: SearchPageCrowdAggBucketsQuery_aggBuckets;
}

export interface SearchPageCrowdAggBucketsQueryVariables {
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
