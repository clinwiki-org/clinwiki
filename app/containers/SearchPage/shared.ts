import { SortInput, AggFilterInput } from 'types/globalTypes';

export type SearchParams = {
  q: string;
  sorts: SortInput[];
  aggFilters: AggFilterInput[];
  crowdAggFilters: AggFilterInput[];
  page: number;
  pageSize: number;
};

export type AggKind = 'aggs' | 'crowdAggs';

export interface AggBucket {
  key: string;
  docCount: number;
}
export interface AggBucketMap { [key:string] : AggBucket[]; }
