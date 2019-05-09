import * as React from 'react';
import { isEmpty, isNil, reject, filter, equals } from 'ramda';
import AggDropDown from './AggDropDown';
import {
  AggBucketMap,
  AggCallback,
  SearchParams,
  AggKind,
  AggFilterMap,
} from '../Types';
import { aggsOrdered } from 'utils/constants';
import SiteProvider from 'containers/SiteProvider';
import { SiteFragment } from 'types/SiteFragment';
import { throws } from 'assert';
import { FilterKind } from 'types/globalTypes';

interface AggsProps {
  aggs: AggBucketMap;
  crowdAggs: AggBucketMap;
  // selected
  filters: AggFilterMap;
  crowdFilters: AggFilterMap;
  addFilter: AggCallback | null;
  removeFilter: AggCallback | null;
  searchParams: SearchParams;
  opened: string | null;
  openedKind: AggKind | null;
  onOpen: (agg: string, kind: AggKind) => void;
}

class Aggs extends React.PureComponent<AggsProps> {
  getAggs = (site: SiteFragment): string[] => {
    const aggsSettings = site.siteView.search.aggs;
    const { kind, values } = aggsSettings.selected;
    const kindFunction = kind === FilterKind.BLACKLIST ? reject : filter;
    return kindFunction(x => values.includes(x), aggsOrdered);
  };

  render() {
    const {
      aggs,
      crowdAggs,
      filters,
      crowdFilters,
      addFilter,
      removeFilter,
      searchParams,
    } = this.props;

    let crowdAggDropdowns: React.ReactElement<any> | null = null;
    const emptySet = new Set();

    if (!isEmpty(crowdAggs) && !isNil(crowdAggs)) {
      crowdAggDropdowns = (
        <div>
          <h4 style={{ color: 'white', position: 'relative', left: '20px' }}>
            Crowd Facets
          </h4>
          {Object.keys(crowdAggs).map(k => (
            <AggDropDown
              key={k}
              agg={k}
              selectedKeys={crowdFilters[k] || emptySet}
              buckets={crowdAggs[k]}
              isOpen={
                this.props.opened === k && this.props.openedKind === 'crowdAggs'
              }
              onOpen={this.props.onOpen}
              aggKind="crowdAggs"
              addFilter={(agg, item) => addFilter && addFilter(agg, item, true)}
              removeFilter={(agg, item) =>
                removeFilter && removeFilter(agg, item, true)
              }
              searchParams={searchParams}
            />
          ))}
        </div>
      );
    }
    if (!isEmpty(aggs) && !isNil(aggs)) {
      return (
        <SiteProvider>
          {site => (
            <div>
              <div>
                {this.getAggs(site).map(k =>
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
                      removeFilter={removeFilter}
                      searchParams={searchParams}
                    />
                  ) : null,
                )}
              </div>
              {crowdAggDropdowns}
            </div>
          )}
        </SiteProvider>
      );
    }
    return null;
  }
}

export default Aggs;
