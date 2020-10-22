import moment from 'moment';
import { AggFilterInput } from 'types/globalTypes';
import { SearchParams } from '../shared';
import { find, propEq, isEmpty, isNil, omit, filter, contains } from 'ramda';

type AggFilterSettings = SearchParams | any;

/**
 * This class gives us an encapsulated tool for representing agg
 * configurations both for search filters as well as setting defaults
 */
abstract class AbstractAggFilterInputUpdater {
  input?: AggFilterInput;
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

  abstract onUpdateFilter(allowsMissingChanged?: boolean): void;

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
    if (this.input) {
      this.input.values = this.input?.values
        ? [...this.input.values, value]
        : [value];
      this.onUpdateFilter();
    }
  }

  removeFilter(value: string) {
    //console.log("VALUE Removing:", value)
    if (this.input) {
      this.input.values = this.input.values
        ? filter(x => x !== value, this.input.values)
        : this.input.values;
      this.onUpdateFilter();
    }
  }

  hasNoFilters(): boolean {
    for (let field of this.ACCEPTED_FIELDS) {
      if (isEmpty(this.input?.[field])) {
        continue;
      }
      if (isNil(this.input?.[field])) {
        continue;
      }
      return false;
    }
    return true;
  }
   
  isSelected(key: string): boolean {
    if (this.input?.values === undefined) {
      return false;
    }
    return contains(key as string, this.input.values as Array<string>);
  }

  toggleFilter(key: string): void {
    this.isSelected(key) ? this.removeFilter(key) : this.addFilter(key);
  }

  changeRange([gte, lte]): void {
    if (this.input) {
      this.input.gte = gte;
      this.input.lte = lte;
      this.onUpdateFilter();
    }
  }

  removeRange(): void {
    if (this.input) {
      this.input = omit(['gte', 'lte'], this.input);
      this.onUpdateFilter();
    }
  }
  removeAllowMissing(): void {

    if (this.input) {
      this.input.includeMissingFields = false

    }
    this.onUpdateFilter();
  }

  getRangeSelection(): Array<any> | undefined {
    if (this.input) {
      if (this.input.gte || this.input.lte) {
        return [this.input.gte, this.input.lte];
      }
    }
  }

  isDateAgg(): boolean {
    return this.agg.match(/date/) !== null;
  }

  getMinString(thisSiteView): string | undefined {
    // logic handling of input based on agg type here
    if (this.input?.gte) {
      const thisField: any =
        find(propEq('name', this.agg))(thisSiteView.search.aggs.fields) ||
        find(propEq('name', this.agg))(thisSiteView.search.crowdAggs.fields);
      if (thisField.display) {
        switch (thisField.display) {
          case 'DATE_RANGE':
            return this.isDateAgg()
              ? moment(this.input.gte)
                  .utc(false)
                  .format('YYYY-MM-DD')
              : this.input.gte;
          case 'NUMBER_RANGE':
            return this.input.gte;
          default:
            return this.input.gte;
        }
      }
      return this.input.gte;
    }
  }

  getMaxString(thisSiteView): string | undefined {
    // logic handling of input based on agg type here
    if (this.input?.lte) {
      const thisField: any =
        find(propEq('name', this.agg))(thisSiteView.search.aggs.fields) ||
        find(propEq('name', this.agg))(thisSiteView.search.crowdAggs.fields);
      switch (thisField.display) {
        case 'DATE_RANGE':
          return this.isDateAgg()
            ? moment(this.input.lte)
                .utc(false)
                .format('YYYY-MM-DD')
            : this.input.lte;
        case 'NUMBER_RANGE':
          return this.input.lte;
        default:
          return this.input.lte;
      }
    }
  }
  allowsMissing(): boolean {
    return this.input!.includeMissingFields || false;
  }

  toggleAllowMissing(): void {
    if (this.input) {
      this.input.includeMissingFields = !this.input.includeMissingFields;
      this.onUpdateFilter(true);
    }
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
    } else if (this.input?.includeMissingFields == false && this.input.values?.length == 0) {
      this.updateSettings({
        [this.grouping as string]: allButThisAgg,
      });
    } else {
      let newInput = {
        field: this.input?.field,
        values: this.input?.values,
        gte: this.input?.gte || null,
        lte: this.input?.lte || null,
        includeMissingFields: this.input?.includeMissingFields || null
      }      
      this.updateSettings({
        [this.grouping]: [...allButThisAgg, newInput],
      });
    }
  }
}

export type ConfigType = 'presearch' | 'autosuggest' | 'facetbar' | 'workflow';
export class AggFilterSiteConfigUpdater extends AbstractAggFilterInputUpdater {
  kind: 'preselected' | 'visibleOptions';
  configType: ConfigType;
  workflowName?: string;
  constructor(
    agg: string,
    settings: AggFilterSettings,
    updateSettings: any,
    grouping: 'aggs' | 'crowdAggs',
    kind: 'preselected' | 'visibleOptions',
    configType: ConfigType,
    workflowName?: string
  ) {
    super(agg, settings, updateSettings, grouping);
    this.kind = kind;
    this.configType = configType;
    this.workflowName = workflowName;
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
      case 'workflow':
        return `set:workflows.${this.workflowName}.suggestedLabelsConfig.${this.agg}.${this.kind}.values`;
    }
  }

  onUpdateFilter(allowsMissingChanged: boolean = false): void {
    const name = this.getPath();
    if (allowsMissingChanged) {
      this.updateSettings({
        currentTarget: {
          name: name.replace(/values$/, 'includeMissingFields'),
          value: this.allowsMissing(),
        },
      });
    } else {
      this.updateSettings({
        currentTarget: {
          name,
          value: this.input?.values,
        },
      });
    }
  }
}

export default AggFilterInputUpdater;
