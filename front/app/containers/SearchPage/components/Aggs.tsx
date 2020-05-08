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
import { BeatLoader } from 'react-spinners';
import aggToField from 'utils/aggs/aggToField';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import { SiteFragment, SiteFragment_siteView } from 'types/SiteFragment';
import { throws } from 'assert';
import { FilterKind } from 'types/globalTypes';
import { displayFields } from 'utils/siteViewHelpers';
import styled from 'styled-components';
import AggFilterInputUpdater from './AggFilterInputUpdater';
import AggContext from './AggFilterUpdateContext';
import { withSearchParams } from './SearchParamsContext';
import withTheme from 'containers/ThemeProvider';

const getVisibleOptionsByName: (SiteFragment) => any = compose(
  reduce(
    (byName, { name, visibleOptions }) => ({
      ...byName,
      [name]: visibleOptions.values,
    }),
    {}
  ),

  pathOr([], ['search', 'crowdAggs', 'fields'])
);
const getVisibleOptionsByNamePresearch: (SiteFragment) => any = compose(
  reduce(
    (byName, { name, visibleOptions }) => ({
      ...byName,
      [name]: visibleOptions.values,
    }),
    {}
  ),

  pathOr([], ['search', 'presearch', 'crowdAggs', 'fields'])
);
interface AggsProps {
  key?: any;
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
  updateParams: any;
  presearch?: boolean;
  currentSiteView: SiteFragment_siteView;
  preSearchAggs?: string[];
  preSearchCrowdAggs?: string[];
  site: SiteFragment;
  updateSearchParams: any;
}

const PresearchContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    max-height: 1500px;
  }
  span {
    display: contents;
  }
`;

const AggSideBarTitle = styled.h4`
  color: ${props => props.theme.aggSideBar.sideBarTitleFont};
  position: relative;
  left: 20px;
`;
const ThemedAggSideBarTitle = withTheme(AggSideBarTitle);

class Aggs extends React.PureComponent<AggsProps> {
  getAggs = (siteView: SiteFragment_siteView): string[] => {
    return displayFields(
      siteView.search.aggs.selected.kind,
      siteView.search.aggs.selected.values,
      siteView.search.aggs.fields
    ).map(prop('name'));
  };

  getCrowdAggs = (crowdAggs: string[]): string[] => {
    const displayed = displayFields(
      this.props.currentSiteView.search.crowdAggs.selected.kind,
      this.props.currentSiteView.search.crowdAggs.selected.values,
      this.props.currentSiteView.search.crowdAggs.fields
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
      presearch,
      currentSiteView,
      preSearchAggs,
      preSearchCrowdAggs,
    } = this.props;
    //commented out because not sure how to pass two parameters when using compose 
    // const sortByNameCi = sortBy(compose(toLower, aggToField);

    let crowdAggDropdowns: React.ReactElement<any> | null = null;
    let crowdAggPresearch: React.ReactElement<any> | null = null;
    const emptySet = new Set();

    if (preSearchCrowdAggs && crowdAggs) {
      const visibleOptionsByName = getVisibleOptionsByNamePresearch(
        currentSiteView
      );
      crowdAggPresearch = (
        <span>
          {preSearchCrowdAggs.map(k =>
            crowdAggs[k] ? (
              <AggContext.Provider
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
                  selectedKeys={crowdFilters[k] || emptySet}
                  buckets={preSearchCrowdAggs[k]}
                  isOpen={true}
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
                  resetSelectAll={this.props.resetSelectAll}
                  removeSelectAll={this.props.removeSelectAll}
                  presearch
                  currentSiteView={this.props.currentSiteView}
                  configType="presearch"
                  visibleOptions={visibleOptionsByName[k]}
                />
              </AggContext.Provider>
            ) : (
              <div
                key={k}
                style={{ display: 'flex', justifyContent: 'center' }}>
                <BeatLoader key="loader" color="#fff" />
              </div>
            )
          )}
        </span>
      );
    }

    if (presearch && preSearchAggs) {
      return (
        <PresearchContainer>
          {preSearchAggs.map(k =>
            aggs[k] ? (
              <AggContext.Provider
                key={k}
                value={{
                  updater: new AggFilterInputUpdater(
                    k,
                    searchParams,
                    updateSearchParams,
                    'aggFilters'
                  ),
                }}>
                <AggDropDown
                  key={k}
                  agg={k}
                  selectedKeys={filters[k] || emptySet}
                  buckets={aggs[k]}
                  isOpen={true}
                  aggKind="aggs"
                  addFilter={addFilter}
                  addFilters={addFilters}
                  removeFilter={removeFilter}
                  removeFilters={removeFilters}
                  searchParams={searchParams}
                  resetSelectAll={this.props.resetSelectAll}
                  removeSelectAll={this.props.removeSelectAll}
                  presearch
                  currentSiteView={this.props.currentSiteView}
                  configType="presearch"
                />
              </AggContext.Provider>
            ) : (
              <div
                key={k}
                style={{ display: 'flex', justifyContent: 'center' }}>
                <BeatLoader key="loader" color="#fff" />
              </div>
            )
          )}
          {crowdAggPresearch}
        </PresearchContainer>
      );
    }

    if (!isEmpty(crowdAggs) && !isNil(crowdAggs)) {
      const visibleOptionsByName = getVisibleOptionsByName(currentSiteView);

      crowdAggDropdowns = (
        <div>
          <ThemedAggSideBarTitle>Crowd Facets</ThemedAggSideBarTitle>
          {(this.getCrowdAggs(Object.keys(crowdAggs))).map(k => (
            <AggContext.Provider
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
                removeFilters={(agg, items) => removeFilters(agg, items, true)}
                searchParams={searchParams}
                visibleOptions={visibleOptionsByName[k]}
                currentSiteView={currentSiteView}
                configType="facetbar"
              />
            </AggContext.Provider>
          ))}
        </div>
      );
    }
    if (!isEmpty(aggs) && !isNil(aggs)) {
      return (
        <div>
          <div>
            {(this.getAggs(this.props.currentSiteView)).map(k =>
              aggs[k] ? (
                <AggContext.Provider
                  key={k}
                  value={{
                    updater: new AggFilterInputUpdater(
                      k,
                      searchParams,
                      updateSearchParams,
                      'aggFilters'
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
                    currentSiteView={this.props.currentSiteView}
                    configType="facetbar"
                  />
                </AggContext.Provider>
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

export default withSearchParams(Aggs);
