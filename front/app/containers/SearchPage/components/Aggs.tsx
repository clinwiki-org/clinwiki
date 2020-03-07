import * as React from 'react';
import {
  isEmpty,
  isNil,
  reject,
  filter,
  equals,
  prop,
  tap,
  compose,
  reduce,
  sortBy,
  toLower,
  intersection,
  pathOr,
} from 'ramda';
import AggDropDown from 'containers/AggDropDown';
import {
  AggBucketMap,
  AggCallback,
  AggregateAggCallback,
  SearchParams,
  AggKind,
  AggFilterMap,
} from '../Types';
import aggToField from 'utils/aggs/aggToField';
import SiteProvider from 'containers/SiteProvider';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import { SiteFragment } from 'types/SiteFragment';
import { throws } from 'assert';
import { FilterKind } from 'types/globalTypes';
import { displayFields } from 'utils/siteViewHelpers';
import AggFilterInputUpdater from './AggFilterInputUpdater';
import AggFilterUpdateContext from './AggFilterUpdateContext';
import { withSearchParams } from './SearchParamsContext';

const getVisibleOptionsByName: (SiteFragment) => any = compose(
  reduce(
    (byName, { name, visibleOptions }) => ({
      ...byName,
      [name]: visibleOptions.values,
    }),
    {}
  ),
  pathOr([], ['siteView', 'search', 'crowdAggs', 'fields'])
);
interface AggsProps {
  aggs: AggBucketMap;
  crowdAggs: AggBucketMap;
  // selected
  filters: AggFilterMap;
  crowdFilters: AggFilterMap;
  addFilter: AggCallback;
  addFilters: AggregateAggCallback;
  removeFilter: AggCallback;
  removeFilters: AggregateAggCallback;
  searchParams: SearchParams;
  opened: string | null;
  openedKind: AggKind | null;
  onOpen: (agg: string, kind: AggKind) => void;
  removeSelectAll?: boolean;
  resetSelectAll?: () => void;
  site: SiteFragment;
  updateSearchParams: any;
}

class Aggs extends React.PureComponent<AggsProps> {
  getAggs = (site: SiteFragment): string[] => {
    return displayFields(
      site.siteView.search.aggs.selected.kind,
      site.siteView.search.aggs.selected.values,
      site.siteView.search.aggs.fields
    ).map(prop('name'));
  };

  getCrowdAggs = (site: SiteFragment, crowdAggs: string[]): string[] => {
    const displayed = displayFields(
      site.siteView.search.crowdAggs.selected.kind,
      site.siteView.search.crowdAggs.selected.values,
      site.siteView.search.crowdAggs.fields
    ).map(prop('name'));
    return filter(x => crowdAggs.includes(x), displayed);
  };

  render() {
    const {
      aggs,
      crowdAggs,
      filters,
      crowdFilters,
      addFilter,
      addFilters,
      removeFilter,
      removeFilters,
      searchParams,
      updateSearchParams,
      site,
    } = this.props;

    console.log('search params are', searchParams);

    const sortByNameCi = sortBy(compose(toLower, aggToField));

    let crowdAggDropdowns: React.ReactElement<any> | null = null;
    const emptySet = new Set();

    const visibleOptionsByName = getVisibleOptionsByName(site);
    if (!isEmpty(crowdAggs) && !isNil(crowdAggs)) {
      crowdAggDropdowns = (
        <div>
          <h4
            style={{
              color: 'white',
              position: 'relative',
              left: '20px',
            }}>
            Crowd Facets
          </h4>
          {sortByNameCi(this.getCrowdAggs(site, Object.keys(crowdAggs))).map(
            k => (
              <AggFilterUpdateContext.Provider
                key={k}
                value={{
                  updater: new AggFilterInputUpdater(
                    k,
                    searchParams,
                    updateSearchParams,
                    'crowdAggFilters'
                  ),
                }}>
                <AggDropDown
                  agg={k}
                  removeSelectAll={this.props.removeSelectAll}
                  selectedKeys={crowdFilters[k] || emptySet}
                  buckets={crowdAggs[k]}
                  isOpen={
                    this.props.opened === k &&
                    this.props.openedKind === 'crowdAggs'
                  }
                  onOpen={this.props.onOpen}
                  aggKind="crowdAggs"
                  addFilter={(agg, item) => addFilter(agg, item, true)}
                  addFilters={(agg, items) => addFilters(agg, items, true)}
                  removeFilter={(agg, item) =>
                    removeFilter && removeFilter(agg, item, true)
                  }
                  removeFilters={(agg, items) =>
                    removeFilters(agg, items, true)
                  }
                  searchParams={searchParams}
                  visibleOptions={visibleOptionsByName[k]}
                />
              </AggFilterUpdateContext.Provider>
            )
          )}
        </div>
      );
    }
    if (!isEmpty(aggs) && !isNil(aggs)) {
      return (
        <div>
          <div>
            {sortByNameCi(this.getAggs(site)).map(k =>
              aggs[k] ? (
                <AggFilterUpdateContext.Provider
                  key={k}
                  value={{
                    updater: new AggFilterInputUpdater(
                      k,
                      searchParams,
                      updateSearchParams,
                      'crowdAggFilters'
                    ),
                  }}>
                  <AggDropDown
                    key={k}
                    agg={k}
                    selectedKeys={filters[k] || emptySet}
                    buckets={aggs[k]}
                    isOpen={
                      this.props.opened === k &&
                      this.props.openedKind === 'aggs'
                    }
                    onOpen={this.props.onOpen}
                    aggKind="aggs"
                    addFilter={addFilter}
                    addFilters={addFilters}
                    removeFilter={removeFilter}
                    removeFilters={removeFilters}
                    searchParams={searchParams}
                    resetSelectAll={this.props.resetSelectAll}
                    removeSelectAll={this.props.removeSelectAll}
                  />
                </AggFilterUpdateContext.Provider>
              ) : null
            )}
          </div>
          {crowdAggDropdowns}
        </div>
      );
    }
    return null;
  }
}

export default withSite(withSearchParams(Aggs));
