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

type AggFilterSettings = SearchParams | any;

/**
 * This class gives us an encapsulated tool for representing agg
 * configurations both for search filters as well as setting defaults
 */
abstract class AbstractAggFilterInputUpdater {
  input: AggFilterInput;
  settings: AggFilterSettings;
  grouping: string;
  updateSettings: any;
  agg: string;

  ACCEPTED_FIELDS = ['values', 'gte', 'lte', 'includeMissingFields'];

  constructor(
    agg: string,
    settings: AggFilterSettings,
    updateSettings: any,
    grouping: string
  ) {
    this.agg = agg;
    this.settings = settings;
    this.updateSettings = updateSettings;
    this.grouping = grouping;
    if (!this.settings || !this.updateSettings) {
      return;
    }
    this.configureInput();
  }

  abstract onUpdateFilter(): void;

  configureInput() {
    const result = find(propEq('field', this.agg))(
      this.settings[this.grouping]
    );
    if (result) {
      this.input = result as AggFilterInput;
    } else {
      this.input = {
        field: this.agg,
      };
    }
  }

  addFilter(value: string) {
    this.input.values = this.input.values
      ? [...this.input.values, value]
      : [value];
    this.onUpdateFilter();
  }

  removeFilter(value: string) {
    this.input.values = this.input.values
      ? filter(x => x !== value, this.input.values)
      : this.input.values;
    this.onUpdateFilter();
  }

  hasNoFilters(): boolean {
    for (let field of this.ACCEPTED_FIELDS) {
      if (isEmpty(this.input[field])) {
        continue;
      }
      if (isNil(this.input[field])) {
        continue;
      }
      return false;
    }
    return true;
  }

  isSelected(key: string): boolean {
    if (this.input.values === undefined) {
      return false;
    }
    return contains(key as string, this.input.values as Array<string>);
  }

  toggleFilter(key: string): void {
    this.isSelected(key) ? this.removeFilter(key) : this.addFilter(key);
  }

  changeRange([gte, lte]): void {
    this.input.gte = gte;
    this.input.lte = lte;
    this.onUpdateFilter();
  }

  removeRange(): void {
    this.input = omit(['gte', 'lte'], this.input);
    this.onUpdateFilter();
  }

  getRangeSelection(): Array<any> | undefined {
    if (this.input.gte || this.input.lte) {
      return [this.input.gte, this.input.lte];
    }
  }

  isDateAgg(): boolean {
    return this.agg.match(/date/) !== null;
  }

  getMinString(): string | undefined {
    // need to check for agg type once we start using this for more than date.
    if (this.input.gte) {
      let type = 'number_range';
      if (type == 'date_range') {
        return this.isDateAgg()
          ? moment(this.input.gte)
              .utc(false)
              .format('YYYY-MM-DD')
          : this.input.gte;
      } else if (type == 'number_range') {
        return this.input.gte;
      }
    }
  }

  getMaxString(): string | undefined {
    // need to check for agg type once we start using this for more than date.
    if (this.input.lte) {
      let type = 'number_range';
      if (type == 'date_range') {
        return this.isDateAgg()
          ? moment(this.input.lte)
              .utc(false)
              .format('YYYY-MM-DD')
          : this.input.lte;
      } else if (type == 'number_range') {
        return this.input.lte;
      }
    }
  }

  allowsMissing(): boolean {
    return this.input!.includeMissingFields || false;
  }

  toggleAllowMissing(): void {
    this.input.includeMissingFields = !this.input.includeMissingFields;
    this.onUpdateFilter();
  }
}

/**
 * Responsible for updating aggs in the context of a search
 */
class AggFilterInputUpdater extends AbstractAggFilterInputUpdater {
  onUpdateFilter(): void {
    const allButThisAgg = filter(
      (x: AggFilterInput) => x.field !== this.agg,
      this.settings[this.grouping]
    );
    if (this.hasNoFilters()) {
      this.updateSettings({
        [this.grouping as string]: allButThisAgg,
      });
    } else {
      this.updateSettings({
        [this.grouping]: [...allButThisAgg, this.input],
      });
    }
  }
}

export class AggFilterSiteConfigUpdater extends AbstractAggFilterInputUpdater {
  kind: 'preselected' | 'visibleOptions';
  configType: 'presearch' | 'autosuggest' | 'facetbar';
  constructor(
    agg: string,
    settings: AggFilterSettings,
    updateSettings: any,
    grouping: 'aggs' | 'crowdAggs',
    kind: 'preselected' | 'visibleOptions',
    configType: 'presearch' | 'autosuggest' | 'facetbar'
  ) {
    super(agg, settings, updateSettings, grouping);
    this.kind = kind;
    this.configType = configType;
  }

  configureInput() {
    this.input = { ...this.settings };
  }

  getPath() {
    switch (this.configType) {
      case 'presearch':
        return `set:search.${this.configType}.${this.grouping}.fields.${this.agg}.${this.kind}.values`;
      case 'autosuggest':
        // Note: the capitalized S in autoSuggest
        return `set:search.autoSuggest.${this.grouping}.fields.${this.agg}.${this.kind}.values`;
      case 'facetbar':
        return `set:search.${this.grouping}.fields.${this.agg}.${this.kind}.values`;
    }
  }

  onUpdateFilter(): void {
    const name = this.getPath();
    this.updateSettings({
      currentTarget: {
        name,
        value: this.input.values,
      },
    });
  }
}

export default AggFilterInputUpdater;
