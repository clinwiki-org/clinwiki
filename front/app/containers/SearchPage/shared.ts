import { SortInput, AggFilterInput } from 'types/globalTypes';

export type SearchParams = {
  q: SearchQuery;
  sorts: SortInput[];
  aggFilters: AggFilterInput[];
  crowdAggFilters: AggFilterInput[];
  page: number;
  pageSize: number;
};

export type AggKind = 'aggs' | 'crowdAggs';

export interface AggBucket {
  key: string;
  keyAsString?: string;
  docCount: number;
}
export interface AggBucketMap {
  [key: string]: AggBucket[];
}

export interface SearchQuery {
  key: string;
  children?: SearchQuery[];
}