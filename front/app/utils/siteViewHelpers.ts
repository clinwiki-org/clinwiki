import { FilterKind, AggFilterInput } from 'types/globalTypes';
import {
  reject,
  filter,
  pipe,
  sortWith,
  sortBy,
  isEmpty,
  indexOf,
} from 'ramda';
import { SiteViewFragment } from 'types/SiteViewFragment';

export const preselectedFilters = (
  view: SiteViewFragment,
): { aggFilters: AggFilterInput[]; crowdAggFilters: AggFilterInput[] } => {
  const aggFilters = reject(
    field => isEmpty(field.preselected.values),
    view.search.aggs.fields,
  ).map(field => ({
    field: field.name,
    values: field.preselected.values,
  }));
  const crowdAggFilters = reject(
    field => isEmpty(field.preselected.values),
    view.search.crowdAggs.fields,
  ).map(field => ({
    field: field.name,
    values: field.preselected.values,
  }));
  return {
    aggFilters,
    crowdAggFilters,
  };
};

export const displayFields = <
  T extends { name: string; rank: number | string | null }
>(
  kind: FilterKind,
  filterValues: string[],
  fields: T[],
  sortByValues?: boolean,
): T[] => {
  const fieldFilterFn = kind === FilterKind.BLACKLIST ? reject : filter;
  const filtered = fieldFilterFn(
    (field: T) => filterValues.includes(field.name),
    fields,
  );
  const sortF = sortByValues ? x => indexOf(x.name, filterValues) : getRank;
  return sortBy(sortF, filtered);
};

const getRank = <T extends { name: string; rank: number | string | null }>(
  field: T,
): number => {
  if (field.rank == null) return Number.POSITIVE_INFINITY;
  return typeof field.rank === 'number' ? field.rank : parseInt(field.rank, 10);
};
