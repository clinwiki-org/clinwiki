import * as _ from 'lodash';

export const defaultPageSize = 20
export type AggCallback = (aggName:string,key:string,isCrowd?:boolean) => void;
export interface AggBucket {
  key: string
  docCount: number
}
export interface AggItem {
  name: string
  buckets: AggBucket[]
}
export interface AggBucketMap { [key:string] : AggBucket[] }
export type AggFilterMap = { [key:string] : Set<string> }

export interface AggFilterListItem { 
  // These field names are used in graphql query
  field:string,
  values: string[]
}

enum SortDirection {
  Asc = "+",
  Desc = "-"
}
export interface SortItem {
  col : string
  dir : SortDirection
}

export interface SearchParams {
  q: string
  page: number
  pageSize: number
  aggFilters: AggFilterListItem[]
  crowdAggFilters: AggFilterListItem[]
  sort: SortItem[]
}

export function flattenAggs(aggs : AggFilterMap) : AggFilterListItem[] {
  if (!aggs) return []
  const result =
    Object.keys(aggs)
    .filter(k => aggs[k].size > 0)
    .map(k => ({field: k, values: [...aggs[k].values()]}))
  if (result.length == 0) return []
  return result;
}

export function expandAggs(aggs: AggFilterListItem[]) {
  if (aggs) {
    return aggs.reduce( (acc,agg) => {
      acc[agg.field] = new Set(agg.values)
      return acc
    }, {} as AggFilterMap );
  }
  return null
}

const version_marker = '!'
interface CompactSearchParams {
  // page
  p: number
  // page size
  z: number
  // aggFilters
  a: AggFilterListItem[]
  // crowdAggFilters
  c: AggFilterListItem[]
  s: SortItem[]
}

function compact_search(p : SearchParams) : CompactSearchParams {
  var res = {
    p: p.page,
    z : p.pageSize,
    a : p.aggFilters,
    c : p.crowdAggFilters,
    s : p.sort
  }
  // Erase default values
  if (res.p == 0) delete res.p
  if (res.z === defaultPageSize) delete res.z
  Object.keys(res).forEach(k => {
    if (Array.isArray(res[k]) && res[k].length === 0) delete res[k]
  })
  if (Object.keys(res).length == 0) return null;
  return res
}
function expand(q : string, p : CompactSearchParams) : SearchParams {
  return {
    q,
    page: p.p||0,
    pageSize: p.z||defaultPageSize,
    aggFilters: p.a||[],
    crowdAggFilters: p.c||[],
    sort: p.s
  }
}

export function encodeSearchParams(params : SearchParams) : string {
  let shortNames = compact_search(params)
  if (shortNames == null) return ""
  let temp = JSON.stringify(shortNames)
  return version_marker + btoa(temp)
}

export function getSearchParamsFromURL() : SearchParams {
  const u = new URL(window.location.href)
  const encodedQuery = u.pathname.startsWith("/search/") ? _.last(u.pathname.split('/')) : ""
  const query = decodeURIComponent(encodedQuery)
  const encodedParams = u.searchParams.get('p')
  if (encodedParams && encodedParams[0] == version_marker) {
      let decoded = atob(encodedParams.substr(1))
      const temp = JSON.parse(decoded)
      return expand(query, temp);
  }
  return  expand(query, <CompactSearchParams>{})
}