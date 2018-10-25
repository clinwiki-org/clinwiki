import { object } from "prop-types";

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
  field:string,
  values: string[]
}

export interface SearchParams {
  q: string
  // page
  p: number
  psz: number
  agFlt: AggFilterListItem[]
  cagFlt: AggFilterListItem[]
  // todo: sorts need asc/desc on server
  // sorts: any
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
  else {
    return null
  }
}

const marker = '!'
export function encodeSearchParams(params : SearchParams) : string {
  if (params.p == 0) {
    delete params.p
  }
  let temp = JSON.stringify(params)
  return marker + btoa(temp)
}

export function decodeSearchParams(arg: string) : SearchParams {
  if (arg[0] == marker) {
      let decoded = atob(arg.substr(1))
      return JSON.parse(decoded)
  }
  return null
}