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
