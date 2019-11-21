import {
  pipe,
  map,
  length,
  prop,
  sortBy,
  pathOr,
  uniqBy,
  concat,
  isNil,
  isEmpty,
  equals,
  lensPath,
  view,
  find,
  propEq,
  filter,
} from 'ramda';

export type Params = {};

export type AggKind = 'aggs' | 'crowdAggs';
export const defaultPageSize = 25;
export type AggCallback = (
  aggName: string,
  key: string,
  isCrowd?: boolean,
) => void;
export interface AggBucket {
  key: string;
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
}

export interface SortItem {
  id: string;
  desc?: boolean;
}

export interface SearchParams {
  readonly q: string[];
  readonly page: number;
  readonly pageSize: number;
  readonly aggFilters: AggFilterListItem[];
  readonly crowdAggFilters: AggFilterListItem[];
  readonly sorts: SortItem[];
}

export function flattenAggs(aggs: AggFilterMap): AggFilterListItem[] {
  if (!aggs) return [];
  const result = Object.keys(aggs)
    .filter(k => aggs[k].size > 0)
    .map(k => ({ field: k, values: [...aggs[k].values()] }));
  if (result.length === 0) return [];
  return result;
}

export function expandAggs(aggs: AggFilterListItem[]) {
  if (aggs) {
    return aggs.reduce(
      (acc, agg) => {
        acc[agg.field] = new Set(agg.values);
        return acc;
      },
      {} as AggFilterMap,
    );
  }
  return null;
}

export function maskAgg(aggs : AggFilterListItem[], toRemove : string) {
  return filter(a => a.field != toRemove, aggs);
}
