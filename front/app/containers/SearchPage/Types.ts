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

export function gqlParams(params: SearchParams) {
  return { ...params };
}

const versionMarker = '!';
interface CompactSearchParams {
  // page
  p: number;
  // search within terms
  w: string[];
  // page size
  z: number;
  // aggFilters
  a: AggFilterListItem[];
  // crowdAggFilters
  c: AggFilterListItem[];
  s: SortItem[];
}

function compact_search(p: SearchParams): CompactSearchParams | null {
  const res = {
    p: p.page,
    w: p.q.slice(1),
    z: p.pageSize,
    a: p.aggFilters,
    c: p.crowdAggFilters,
    s: p.sorts,
  };
  // Erase default values
  if (res.p === 0) delete res.p;
  if (res.z === defaultPageSize) delete res.z;
  Object.keys(res).forEach(k => {
    if (Array.isArray(res[k]) && res[k].length === 0) delete res[k];
  });
  if (Object.keys(res).length === 0) return null;
  return res;
}
function expand_search(q: string, p: CompactSearchParams): SearchParams {
  const w = p.w || [];
  return {
    q: q ? [q, ...w] : w,
    page: p.p || 0,
    pageSize: p.z || defaultPageSize,
    aggFilters: p.a || [],
    crowdAggFilters: p.c || [],
    sorts: p.s || [],
  };
}

export function encodeSearchParams(params: SearchParams): string {
  const shortNames = compact_search(params);
  if (shortNames == null) return '';
  const temp = JSON.stringify(shortNames);
  return versionMarker + btoa(temp);
}
