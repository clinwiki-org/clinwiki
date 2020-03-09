import moment from 'moment';
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
  contains,
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
    this.aggFilterGrouping = grouping;
    if (!this.searchParams || !this.updateSearchParams) {
      return;
    }
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
      if (isEmpty(this.aggFilterInput[field])) {
        continue;
      }
      if (isNil(this.aggFilterInput[field])) {
        continue;
      }
      return false;
    }
    return true;
  }

  updateSearchParamsForAggFilterInput(): void {
    const allButThisAgg = filter(
      (x: AggFilterInput) => x.field !== this.agg,
      this.searchParams[this.aggFilterGrouping]
    );
    if (this.hasNoFilters()) {
      this.updateSearchParams({
        [this.aggFilterGrouping as string]: allButThisAgg,
      });
    } else {
      this.updateSearchParams({
        [this.aggFilterGrouping]: [...allButThisAgg, this.aggFilterInput],
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

  isSelected(key: string): boolean {
    if (this.aggFilterInput.values === undefined) {
      return false;
    }
    return contains(key as string, this.aggFilterInput.values as Array<string>);
  }

  toggleFilter(key: string): void {
    this.isSelected(key) ? this.removeFilter(key) : this.addFilter(key);
  }

  changeRange([gte, lte]): void {
    this.aggFilterInput.gte = gte;
    this.aggFilterInput.lte = lte;
    this.updateSearchParamsForAggFilterInput();
  }

  removeRange(): void {
    this.aggFilterInput = omit(['gte', 'lte'], this.aggFilterInput);
    this.updateSearchParamsForAggFilterInput();
  }

  getRangeSelection(): Array<any> | undefined {
    if (this.aggFilterInput.gte && this.aggFilterInput.lte) {
      return [this.aggFilterInput.gte, this.aggFilterInput.lte];
    }
  }

  getMinString(): string | undefined {
    // need to check for agg type once we start using this for more than date.
    if (this.aggFilterInput.gte) {
      return moment(this.aggFilterInput.gte)
        .utc(false)
        .format('YYYY-MM-DD');
    }
  }

  getMaxString(): string | undefined {
    // need to check for agg type once we start using this for more than date.
    if (this.aggFilterInput.lte) {
      return moment(this.aggFilterInput.lte)
        .utc(false)
        .format('YYYY-MM-DD');
    }
  }
}

export default AggFilterInputUpdater;
