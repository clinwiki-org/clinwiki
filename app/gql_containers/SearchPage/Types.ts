
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
export type SearchParams = any