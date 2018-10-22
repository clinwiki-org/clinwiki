
export type AggCallback = (aggName:string,key:string,isCrowd?:boolean) => void;
export interface AggBucket {
  key: string
  docCount: number
}
export interface AggBucketMap {
  [key:string] : AggBucket[]
}

export type SearchParams = any