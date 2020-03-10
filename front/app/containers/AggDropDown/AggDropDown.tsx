import * as React from 'react';
import styledComponents from 'styled-components';
import {
  pipe,
  map,
  length,
  prop,
  sortBy,
  pathOr,
  uniqBy,
  concat,
  isNil,
  isEmpty,
  equals,
  lensPath,
  view,
  find,
  filter,
  propEq,
  reverse,
  identity,
} from 'ramda';
import moment from 'moment';
import { withApollo } from 'react-apollo';
import { Checkbox, Panel, FormControl } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';

import {
  AggBucket,
  AggCallback,
  AggregateAggCallback,
  SearchParams,
  AggKind,
  maskAgg,
} from '../SearchPage/Types';

import gql from 'graphql-tag';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';
import { FieldDisplay } from 'types/globalTypes';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import {
  SiteViewFragment,
  SiteViewFragment_search_aggs_fields,
} from 'types/SiteViewFragment';
import './AggDropDownStyle.css';
import { SiteFragment } from 'types/SiteFragment';
import SortKind from './SortKind';
import Buckets from './Buckets';
import BucketsPanel from './BucketsPanel';
import Filter from './Filter';
import SearchPageCrowdAggBucketsQuery from './queries/SearchPageCrowdAggBucketsQuery';
import SearchPageAggBucketsQuery from './queries/SearchPageAggBucketsQuery';
import HistoPanel from './HistoPanel';

const PAGE_SIZE = 25;

const PanelWrapper = styledComponents.div`
  .flex {
    display:flex;
    justify-content: space-between;
  }
  .checkbox {
    margin: 3px 0px;
  }
  .panel-body {
    padding: 5px;
    overflow-x: auto;
    max-height: 400px;
  }
`;

interface AggDropDownState {
  hasMore: boolean;
  isOpen: boolean;
  loading: boolean;
  filter: string;
  buckets: AggBucket[];
  prevParams: SearchParams | null;
  desc: boolean;
  sortKind: SortKind;
  checkboxValue: boolean;
  showLabel: boolean;
}

interface AggDropDownProps {
  agg: string;
  isOpen: boolean;
  buckets?: AggBucket[];
  searchParams: SearchParams;
  aggKind: AggKind;
  selectedKeys: Set<string>;
  addFilter: AggCallback;
  addFilters?: AggregateAggCallback | undefined;
  removeFilters?: AggregateAggCallback | undefined;
  removeFilter: AggCallback | null;
  display?: FieldDisplay;
  visibleOptions?: String[];
  onOpen?: (agg: string, aggKind: AggKind) => void;
  removeSelectAll?: boolean;
  resetSelectAll?: () => void;
  client: any;
  site: SiteViewFragment;
}

class AggDropDown extends React.Component<AggDropDownProps, AggDropDownState> {
  state = {
    hasMore: true,
    loading: false,
    buckets: [],
    filter: '',
    isOpen: false,
    prevParams: null,
    sortKind: SortKind.Alpha,
    desc: true,
    checkboxValue: false,
    showLabel: false,
  };

  static getDerivedStateFromProps(
    props: AggDropDownProps,
    state: AggDropDownState
  ) {
    if (props.isOpen !== state.isOpen) {
      if (props.isOpen) {
        return {
          hasMore: true,
          loading: false,
          buckets: [],
          filter: '',
          isOpen: props.isOpen,
          prevParams: props.searchParams,
        };
      }
      return {
        hasMore: true,
        loading: false,
        buckets: props.buckets,
        filter: '',
        isOpen: props.isOpen,
        prevParams: props.searchParams,
      };
    }

    const findAgg = (searchParams: SearchParams | null) => {
      if (!searchParams) return null;

      const key = props.aggKind === 'aggs' ? 'aggFilters' : 'crowdAggFilters';
      return find(agg => agg.field === props.agg, searchParams[key]);
    };
    const prevAggValue = findAgg(state.prevParams);
    const nextAggValue = findAgg(props.searchParams);

    if (
      state.isOpen &&
      !equals(state.prevParams, props.searchParams) &&
      equals(prevAggValue, nextAggValue)
    ) {
      return {
        hasMore: true,
        loading: false,
        buckets: props.buckets,
        filter: '',
        isOpen: props.isOpen,
        prevParams: props.searchParams,
      };
    }

    return null;
  }

  // getBucketKey = (key: string): string => path([key, 'key'], this.props.buckets)
  // getBucketDocCount = (key: string): number => path([key, 'docCount'], this.props.buckets)
  isSelected = (key: string): boolean =>
    this.props.selectedKeys && this.props.selectedKeys.has(key);

  toggleAgg = (key: string): void => {
    if (!this.props.addFilter || !this.props.removeFilter) return;
    return this.isSelected(key)
      ? this.props.removeFilter(this.props.agg, key)
      : this.props.addFilter(this.props.agg, key);
  };

  selectAll = (): void => {
    const { buckets } = this.state;
    let newParams = [];

    buckets.map(({ key }) => {
      newParams.push(key);
    });

    if (this.props.removeSelectAll) {
      this.setState({
        checkboxValue: false,
      });
    }
    if (this.isAllSelected() != true) {
      if (!this.props.addFilters) return;
      this.props.addFilters(this.props.agg, newParams, false);
      this.setState({
        checkboxValue: true,
      });
    } else {
      if (!this.props.removeFilters) return;
      this.setState({
        checkboxValue: false,
      });
      this.props.removeFilters(this.props.agg, newParams, false);
    }
  };

  isAllSelected = (): boolean => {
    const { buckets } = this.state;
    let i = 0;
    let newParams = [];
    buckets.map(({ key }) => {
      if (this.isSelected(key)) {
        i++;
      }
    });
    if (buckets.length == i) {
      return true;
    }
    return false;
  };

  getFullPagesCount = () => Math.floor(length(this.state.buckets) / PAGE_SIZE);

  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({ filter: value, buckets: [], hasMore: true });
  };

  handleToggle = () => {
    this.props.onOpen && this.props.onOpen(this.props.agg, this.props.aggKind);
  };

  handleLoadMore = async () => {
    const { client: apolloClient } = this.props;
    const { desc, sortKind } = this.state;
    const [query, filterType] =
      this.props.aggKind === 'crowdAggs'
        ? [SearchPageCrowdAggBucketsQuery, 'crowdAggFilters']
        : [SearchPageAggBucketsQuery, 'aggFilters'];

    let aggSort = [{ id: 'key', desc: false }];

    if (!desc && sortKind === SortKind.Alpha) {
      aggSort = [{ id: 'key', desc: true }];
    }

    if (desc && sortKind === SortKind.Number) {
      aggSort = [{ id: 'count', desc: false }];
    }

    if (!desc && sortKind === SortKind.Number) {
      aggSort = [{ id: 'count', desc: true }];
    }

    const variables = {
      ...this.props.searchParams,
      aggFilters: maskAgg(this.props.searchParams.aggFilters, this.props.agg),
      crowdAggFilters: maskAgg(
        this.props.searchParams.crowdAggFilters,
        this.props.agg
      ),
      agg: this.props.agg,
      pageSize: PAGE_SIZE,
      page: this.getFullPagesCount(),
      aggOptionsFilter: this.state.filter,
      aggOptionsSort: aggSort,
    };

    const response = await apolloClient.query({
      query,
      variables,
    });

    const newBuckets = pathOr(
      [],
      ['data', 'aggBuckets', 'aggs', 0, 'buckets'],
      response
    ) as AggBucket[];

    let buckets = pipe(
      concat(newBuckets),
      uniqBy(prop('key')),
      sortBy(prop('key'))
      // desc ? identity() : reverse(),
    )(this.state.buckets) as AggBucket[];
    if (!desc && sortKind === SortKind.Alpha) {
      buckets = pipe(
        concat(newBuckets),
        uniqBy(prop('key')),
        sortBy(prop('key')),
        reverse()
      )(this.state.buckets) as AggBucket[];
    }
    if (desc && sortKind === SortKind.Number) {
      buckets = pipe(
        concat(newBuckets),
        uniqBy(prop('key')),
        sortBy(prop('docCount'))
      )(this.state.buckets) as AggBucket[];
    }
    if (!desc && sortKind === SortKind.Number) {
      buckets = pipe(
        concat(newBuckets),
        uniqBy(prop('key')),
        sortBy(prop('docCount')),
        reverse()
      )(this.state.buckets) as AggBucket[];
    }

    const hasMore = length(this.state.buckets) !== length(buckets);
    this.setState({ buckets, hasMore });
  };

  renderPanel = () => {
    const {
      client,
      site,
      agg,
      visibleOptions = [],
      removeSelectAll,
    } = this.props;
    const {
      buckets = [],
      filter,
      desc,
      sortKind,
      isOpen,
      hasMore,
      checkboxValue,
      showLabel,
      loading,
    } = this.state;
    if (!isOpen) {
      return null;
    }
    if (agg === 'start_date') {
      return (
        <HistoPanel
          isOpen={isOpen}
          hasMore={hasMore}
          loading={loading}
          buckets={buckets}
          handleLoadMore={this.handleLoadMore}
        />
      );
    }
    return (
      <Panel.Collapse className="bm-panel-collapse">
        <Panel.Body>
          <Filter
            agg={agg}
            buckets={buckets}
            filter={filter}
            desc={desc}
            sortKind={sortKind}
            selectAll={this.selectAll}
            checkSelect={this.checkSelect}
            checkboxValue={checkboxValue}
            removeSelectAll={removeSelectAll}
            showLabel={showLabel}
            handleFilterChange={this.handleFilterChange}
            toggleAlphaSort={this.toggleAlphaSort}
            toggleNumericSort={this.toggleNumericSort}
            setShowLabel={showLabel => this.setState({ showLabel })}
          />
        </Panel.Body>
        <Panel.Body>
          <BucketsPanel
            visibleOptions={visibleOptions}
            buckets={buckets}
            isSelected={this.isSelected}
            toggleAgg={this.toggleAgg}
            hasMore={hasMore}
            handleLoadMore={this.handleLoadMore}
            agg={agg}
            field={
              find(propEq('name', agg), [
                ...(site.search?.aggs?.fields || []),
                ...(site.search?.crowdAggs?.fields || []),
              ]) as SiteViewFragment_search_aggs_fields | null
            }
          />
        </Panel.Body>
      </Panel.Collapse>
    );
  };

  toggleAlphaSort = () => {
    this.setState({
      desc: !this.state.desc,
      sortKind: SortKind.Alpha,
      buckets: [],
      hasMore: true,
    });
  };

  toggleNumericSort = () => {
    this.setState({
      desc: !this.state.desc,
      sortKind: SortKind.Number,
      buckets: [],
      hasMore: true,
    });
  };

  checkSelect = () => {
    if (this.props.removeSelectAll) {
      this.setState(
        {
          checkboxValue: false,
        },
        () => {
          if (this.props.resetSelectAll != null) {
            this.props.resetSelectAll();
          }
        }
      );
    }
  };
  render() {
    const { agg } = this.props;
    const { isOpen } = this.state;
    const title = aggToField(agg);
    const icon = `chevron${isOpen ? '-up' : '-down'}`;
    return (
      <PanelWrapper>
        <Panel
          onToggle={this.handleToggle}
          expanded={isOpen}
          className="bm-panel-default">
          <Panel.Heading className="bm-panel-heading">
            <Panel.Title className="bm-panel-title" toggle>
              <div className="flex">
                <span>{title}</span>
                <span>
                  <FontAwesome name={icon} />{' '}
                </span>
              </div>
            </Panel.Title>
          </Panel.Heading>
          {this.renderPanel()}
        </Panel>
      </PanelWrapper>
    );
  }
}

export default withApollo(withSite(AggDropDown));
