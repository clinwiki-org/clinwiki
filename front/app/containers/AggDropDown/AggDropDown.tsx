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
  propEq,
} from 'ramda';
import { ApolloConsumer } from 'react-apollo';
import { Checkbox, Panel, FormControl } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import * as InfiniteScroll from 'react-infinite-scroller';
import * as FontAwesome from 'react-fontawesome';

import {
  AggBucket,
  AggCallback,
  SearchParams,
  AggKind,
  maskAgg,
} from '../SearchPage/Types';

import gql from 'graphql-tag';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';
import { FieldDisplay } from 'types/globalTypes';
import SiteProvider from 'containers/SiteProvider';
import {
  SiteViewFragment,
  SiteViewFragment_search_aggs_fields,
} from 'types/SiteViewFragment';

const PAGE_SIZE = 25;

const QUERY_AGG_BUCKETS = gql`
  query SearchPageAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
  ) {
    aggBuckets(
      params: {
        agg: $agg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        page: $page
        pageSize: $pageSize
      }
    ) {
      aggs {
        name
        buckets {
          key
          docCount
        }
      }
    }
  }
`;

const QUERY_CROWD_AGG_BUCKETA = gql`
  query SearchPageCrowdAggBucketsQuery(
    $agg: String!
    $q: SearchQueryInput!
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int!
    $pageSize: Int!
    $aggOptionsFilter: String
  ) {
    aggBuckets: crowdAggBuckets(
      params: {
        agg: $agg
        q: $q
        sorts: []
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        aggOptionsFilter: $aggOptionsFilter
        page: $page
        pageSize: $pageSize
      }
    ) {
      aggs {
        buckets {
          key
          docCount
        }
      }
    }
  }
`;

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
}

interface AggDropDownProps {
  agg: string;
  isOpen: boolean;
  buckets?: AggBucket[];
  searchParams: SearchParams;
  aggKind: AggKind;
  selectedKeys: Set<string>;
  addFilter: AggCallback | null;
  removeFilter: AggCallback | null;
  display?: FieldDisplay;
  onOpen?: (agg: string, aggKind: AggKind) => void;
}

class AggDropDown extends React.Component<AggDropDownProps, AggDropDownState> {
  state = {
    hasMore: true,
    loading: false,
    buckets: [],
    filter: '',
    isOpen: false,
    prevParams: null,
  };

  static getDerivedStateFromProps(
    props: AggDropDownProps,
    state: AggDropDownState,
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
  toggleAgg = (agg: string, key: string): void => {
    if (!this.props.addFilter || !this.props.removeFilter) return;
    return this.isSelected(key)
      ? this.props.removeFilter(agg, key)
      : this.props.addFilter(agg, key);
  };

  getFullPagesCount = () => Math.floor(length(this.state.buckets) / PAGE_SIZE);

  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({ filter: value, buckets: [], hasMore: true });
  };

  handleToggle = () => {
    this.props.onOpen && this.props.onOpen(this.props.agg, this.props.aggKind);
  };

  handleLoadMore = async apolloClient => {
    const [query, filterType] =
      this.props.aggKind === 'crowdAggs'
        ? [QUERY_CROWD_AGG_BUCKETA, 'crowdAggFilters']
        : [QUERY_AGG_BUCKETS, 'aggFilters'];

    const variables = {
      ... this.props.searchParams,
      aggFilters: maskAgg(this.props.searchParams.aggFilters, this.props.agg),
      crowdAggFilters : maskAgg(this.props.searchParams.crowdAggFilters, this.props.agg),
      agg: this.props.agg,
      pageSize: PAGE_SIZE,
      page: this.getFullPagesCount(),
      aggOptionsFilter: this.state.filter,
    };

    const response = await apolloClient.query({
      query,
      variables,
    });

    const newBuckets = pathOr(
      [],
      ['data', 'aggBuckets', 'aggs', 0, 'buckets'],
      response,
    ) as AggBucket[];

    const buckets = pipe(
      concat(newBuckets),
      uniqBy(prop('key')),
      sortBy(prop('key')),
    )(this.state.buckets) as AggBucket[];

    const hasMore = length(this.state.buckets) !== length(buckets);
    this.setState({ buckets, hasMore });
  };

  renderBucket = (
    value: string | number,
    display: FieldDisplay,
    docCount: number,
  ): React.ReactNode => {
    let text = '';
    switch (display) {
      case FieldDisplay.STAR:
        text = {
          0: '☆☆☆☆☆',
          1: '★☆☆☆☆',
          2: '★★☆☆☆',
          3: '★★★☆☆',
          4: '★★★★☆',
          5: '★★★★★',
        }[value];
        break;
      case FieldDisplay.DATE:
        text = new Date(parseInt(value.toString(), 10))
          .getFullYear()
          .toString();
        break;
      default:
        text = value.toString();
    }
    return `${text} (${docCount})`;
  };

  renderBuckets = (display: FieldDisplay) => {
    const { agg } = this.props;
    const { buckets = [] } = this.state;

    return pipe(
      sortBy(prop('key')),
      map(({ key, docCount }) => (
        <Checkbox
          key={key}
          checked={this.isSelected(key)}
          onChange={() => this.toggleAgg(agg, key)}
        >
          {this.renderBucket(key, display, docCount)}
        </Checkbox>
      )),
    )(buckets);
  };

  renderBucketsPanel = (apolloClient, site: SiteViewFragment) => {
    let display = this.props.display;
    if (!display) {
      const field = find(propEq('name', this.props.agg), [
        ...site.search.aggs.fields,
        ...site.search.crowdAggs.fields,
      ]) as SiteViewFragment_search_aggs_fields | null;
      display = (field && field.display) || FieldDisplay.STRING;
    }
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={() => this.handleLoadMore(apolloClient)}
        hasMore={this.state.hasMore}
        useWindow={false}
        loader={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BeatLoader key="loader" color="#fff" />
          </div>
        }
      >
        {this.renderBuckets(display)}
      </InfiniteScroll>
    );
  };

  renderFilter = () => {
    const { buckets = [], filter } = this.state;
    if (length(buckets) <= 10 && (isNil(filter) || isEmpty(filter))) {
      return null;
    }
    return (
      <FormControl
        type="text"
        placeholder="filter..."
        value={this.state.filter}
        onChange={this.handleFilterChange}
      />
    );
  };

  render() {
    const { agg } = this.props;
    const { isOpen } = this.state;

    const title = aggToField(agg);
    const icon = `chevron${isOpen ? '-up' : '-down'}`;

    return (
      <SiteProvider>
        {site => (
          <ApolloConsumer>
            {apolloClient => (
              <PanelWrapper>
                <Panel onToggle={this.handleToggle} expanded={isOpen}>
                  <Panel.Heading>
                    <Panel.Title toggle>
                      <div className="flex">
                        <span>{title}</span>
                        <span>
                          <FontAwesome name={icon} />{' '}
                        </span>
                      </div>
                    </Panel.Title>
                  </Panel.Heading>
                  {isOpen && (
                    <Panel.Collapse>
                      <Panel.Body>{this.renderFilter()}</Panel.Body>
                      <Panel.Body>
                        {this.renderBucketsPanel(apolloClient, site.siteView)}
                      </Panel.Body>
                    </Panel.Collapse>
                  )}
                </Panel>
              </PanelWrapper>
            )}
          </ApolloConsumer>
        )}
      </SiteProvider>
    );
  }
}

export default AggDropDown;
