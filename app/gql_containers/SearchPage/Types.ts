import { object } from "prop-types";

const default_page_size = 20
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
  k:string,
  v: string[]
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
    .map(k => ({k: k, v: [...aggs[k].values()]}))
  if (result.length == 0) return []
  return result;
}

export function expandAggs(aggs: AggFilterListItem[]) {
  if (aggs) {
    return aggs.reduce( (acc,agg) => {
      acc[agg.k] = new Set(agg.v)
      return acc
    }, {} as AggFilterMap );
  }
  return null
}

const version_marker = '!'
interface CompactSearchParams {
  q: string
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
    q: p.q,
    p: p.page,
    z : p.pageSize,
    a : p.aggFilters,
    c : p.crowdAggFilters,
    s : p.sort
  }
  // Erase default values
  if (p.q === "") delete res.q
  if (p.page == 0) delete res.p
  if (Array.isArray(res.a) && res.a.length == 0) delete res.a
  if (Array.isArray(res.c) && res.c.length == 0) delete res.c
  if (Array.isArray(res.s) && res.s.length == 0) delete res.s
  return res
}
function expand(p : CompactSearchParams) : SearchParams {
  return {
    q: p.q||"",
    page: p.p||0,
    pageSize: p.z,
    aggFilters: p.a||[],
    crowdAggFilters: p.c||[],
    sort: p.s
  }
}

export function encodeSearchParams(params : SearchParams) : string {
  let shortNames = compact_search(params)
  if (params.page != 0) shortNames.p = params.page
  let temp = JSON.stringify(shortNames)
  return version_marker + btoa(temp)
}

export function decodeSearchParams(arg: string) : SearchParams {
  if (arg[0] == version_marker) {
      let decoded = atob(arg.substr(1))
      const temp = JSON.parse(decoded)
      return expand(temp);
  }
  return null
}