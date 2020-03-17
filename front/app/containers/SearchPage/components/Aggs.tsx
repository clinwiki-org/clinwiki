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
import { aggsOrdered } from 'utils/constants';
import SiteProvider from 'containers/SiteProvider';
import { SiteFragment, SiteFragment_editors } from 'types/SiteFragment';
import { throws } from 'assert';
import { FilterKind } from 'types/globalTypes';
import { displayFields } from 'utils/siteViewHelpers';
import styled from 'styled-components';

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
  currentSiteView?: any;
  preSearchAggs?: string[];
  preSearchCrowdAggs?: string[];
}

const PresearchContainer = styled.div`
  display: flex;
  max-height: 350px;
  @media (max-width: 1250px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    max-height: 1500px;
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    max-height: 1500px;
  }
`;

class Aggs extends React.PureComponent<AggsProps> {
  getAggs = (siteView): string[] => {
    return displayFields(
      siteView.search.aggs.selected.kind,
      siteView.search.aggs.selected.values,
      siteView.search.aggs.fields
    ).map(prop('name'));
  };

  getCrowdAggs = (site: SiteFragment, crowdAggs: string[]): string[] => {
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
      presearch,
      currentSiteView,
      preSearchAggs,
      preSearchCrowdAggs,
    } = this.props;
    let crowdAggDropdowns: React.ReactElement<any> | null = null;
    let crowdAggPresearch: React.ReactElement<any> | null = null;
    const emptySet = new Set();

    if (preSearchCrowdAggs && crowdAggs) {
      crowdAggPresearch = (
        <SiteProvider>
          {(site: SiteFragment) => {
            return (
              <span>
                {preSearchCrowdAggs.map(k =>
                  crowdAggs[k] ? (
                      <AggDropDown
                        key={k}
                        agg={k}
                        selectedKeys={crowdFilters[k] || emptySet}
                        buckets={crowdAggs[k]}
                        isOpen={true}
                        aggKind="crowdAggs"
                        addFilter={(agg, item) => addFilter(agg, item, true)}
                        addFilters={(agg, items) =>
                          addFilters(agg, items, true)
                        }
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
                      />

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
          }}
        </SiteProvider>
      );
    }

    if (presearch && preSearchAggs) {
      return (
        <SiteProvider>
          {(site: SiteFragment) => {
            return (
              <PresearchContainer>
                {preSearchAggs.map(k =>
                  aggs[k] ? (
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
          }}
        </SiteProvider>
      );
    }
    if (!isEmpty(crowdAggs) && !isNil(crowdAggs)) {
      crowdAggDropdowns = (
        <SiteProvider>
          {(site: SiteFragment) => {
            const visibleOptionsByName = getVisibleOptionsByName(site);
            return (
              <div>
                <h4
                  style={{
                    color: 'white',
                    position: 'relative',
                    left: '20px',
                  }}>
                  Crowd Facets
                </h4>
                {this.getCrowdAggs(site, Object.keys(crowdAggs)).map(k => (
                  <AggDropDown
                    key={k}
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
                    currentSiteView={this.props.currentSiteView}
                    configType="facetbar"

                  />
                ))}
              </div>
            );
          }}
        </SiteProvider>
      );
    }
    if (!isEmpty(aggs) && !isNil(aggs)) {
      return (
        <SiteProvider>
          {(site: SiteFragment) => {
            return (
              <div>
                <div>
                  {this.getAggs(this.props.currentSiteView).map(k =>
                    aggs[k] ? (
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
                    ) : null
                  )}
                </div>
                {crowdAggDropdowns}
              </div>
            );
          }}
        </SiteProvider>
      );
    }

    return null;
  }
}

export default Aggs;
