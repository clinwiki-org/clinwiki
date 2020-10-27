import { filter } from 'ramda';
import { SortInput, AggFilterInput } from 'types/globalTypes';
import { SearchQueryInput } from 'types/globalTypes'

export type Params = {};

export type AggKind = 'aggs' | 'crowdAggs';
export const defaultPageSize = 100;
export type AggCallback = (
  aggName: string,
  key: string,
  isCrowd?: boolean
) => void;
export type AggregateAggCallback = (
  aggName: string,
  keys: string[],
  isCrowd?: boolean
) => void;
export interface AggBucket {
  key: string;
  keyAsString?: string;
  docCount: number;
}
export interface AggItem {
  name: string;
  buckets: AggBucket[];
}
export interface AggBucketMap {
  [key: string]: AggBucket[];
}
export type AggFilterMap = { [key: string]: Set<string> };

export interface AggFilterListItem {
  // These field names are used in graphql query
  field: string;
  values: string[];
  gte?: any;
  lte?: any;
  includeMissingFields:boolean;
}

export interface SortItem {
  id: string;
  desc?: boolean;
}

export interface SearchParams {
  readonly q: string[];
  readonly page: number;
  readonly pageSize: number;
  readonly aggFilters: AggFilterInput[];
  readonly crowdAggFilters: AggFilterInput[];
  readonly sorts: SortInput[];
}

export interface SearchParamsAsInput {
  readonly q: SearchQueryInput;
  readonly page: number;
  readonly pageSize: number;
  readonly aggFilters: AggFilterInput[];
  readonly crowdAggFilters: AggFilterInput[];
  readonly sorts: SortInput[];
}

export function maskAgg(aggs: AggFilterInput[], toRemove: string) {
  return filter(a => a.field !== toRemove, aggs);
}
