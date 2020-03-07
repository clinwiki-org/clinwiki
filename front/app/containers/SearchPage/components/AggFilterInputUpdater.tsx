import { AggFilterInput } from 'types/globalTypes';
import { SearchParams } from '../shared';
import {
  path,
  map,
  dissoc,
  pathOr,
  prop,
  any,
  pipe,
  groupBy,
  head,
  propOr,
  lensPath,
  over,
  find,
  findIndex,
  propEq,
  reject,
  isEmpty,
  isNil,
  omit,
  view,
  remove,
  equals,
  filter,
  forEach,
} from 'ramda';

/**
 * The purpose of this class is to construct
 * a new set of search params based on the agg
 * filter input provided
 */
class AggFilterInputUpdater {
  aggFilterInput: AggFilterInput;
  searchParams: SearchParams;
  aggFilterGrouping: string;
  updateSearchParams: any;
  agg: string;

  ACCEPTED_FIELDS = ['values', 'gte', 'lte'];

  constructor(
    agg: string,
    searchParams: SearchParams | any,
    updateSearchParams: any,
    grouping: string
  ) {
    this.agg = agg;
    this.searchParams = searchParams;
    this.updateSearchParams = updateSearchParams;
    console.log(this.updateSearchParams);
    const result = find(propEq('field', agg))(this.searchParams[grouping]);
    if (result) {
      this.aggFilterInput = result as AggFilterInput;
    } else {
      this.aggFilterInput = {
        field: agg,
      };
    }
  }

  hasNoFilters(): boolean {
    for (let field of this.ACCEPTED_FIELDS) {
      if (
        !isEmpty(this.aggFilterInput[field]) ||
        !isNil(this.aggFilterInput[field])
      ) {
        return false;
      }
    }
    return true;
  }

  updateSearchParamsForAggFilterInput(): void {
    if (this.hasNoFilters()) {
      this.updateSearchParams({
        [this.aggFilterGrouping as string]: omit(
          [this.agg],
          this.searchParams[this.aggFilterGrouping]
        ),
      });
    } else {
      this.updateSearchParams({
        [this.aggFilterGrouping]: {
          ...this.searchParams[this.aggFilterGrouping],
          [this.agg]: this.aggFilterInput,
        },
      });
    }
  }

  addFilter(value: string) {
    this.aggFilterInput.values = this.aggFilterInput.values
      ? [...this.aggFilterInput.values, value]
      : [value];
    this.updateSearchParamsForAggFilterInput();
  }

  removeFilter(value: string) {
    this.aggFilterInput.values = this.aggFilterInput.values
      ? filter(x => x !== value, this.aggFilterInput.values)
      : this.aggFilterInput.values;
    this.updateSearchParamsForAggFilterInput();
  }
}

export default AggFilterInputUpdater;
