import * as React from 'react';
import styledComponents from 'styled-components';
import { pipe, map, length, prop, sortBy, pathOr, uniqBy, concat, isNil, isEmpty } from 'ramda';
import { ApolloConsumer } from 'react-apollo';
import { Checkbox, Panel, FormControl } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import * as InfiniteScroll from 'react-infinite-scroller';
import * as FontAwesome from 'react-fontawesome';

import { AggBucket, AggCallback, SearchParams, gqlParams, AggKind } from '../Types';

import gql from 'graphql-tag';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';

const PAGE_SIZE = 25;

const QUERY_AGG_BUCKETS = gql`
  query (
    $agg : String!,
    $q : String,
    $aggFilters:[AggFilter!],
    $crowdAggFilters:[AggFilter!],
    $page: Int!, $pageSize: Int!,
    $aggOptionsFilter: String
  ) {
    aggBuckets(params: {
      agg: $agg,
      q: $q,
      sorts: [],
      aggFilters: $aggFilters,
      crowdAggFilters: $crowdAggFilters,
      aggOptionsFilter: $aggOptionsFilter,
      page: $page,
      pageSize: $pageSize
    }) {
      aggs {
        name
        buckets {
          key
          docCount
        }
      }
    }
  }`;

const QUERY_CROWD_AGG_BUCKETA = gql`
  query (
    $agg : String!,
    $q : String,
    $aggFilters:[AggFilter!],
    $crowdAggFilters:[AggFilter!],
    $page: Int!, $pageSize: Int!,
    $aggOptionsFilter: String
  ) {
    aggBuckets: crowdAggBuckets(params: {
      agg: $agg,
      q: $q,
      sorts: [],
      aggFilters: $aggFilters,
      crowdAggFilters: $crowdAggFilters,
      aggOptionsFilter: $aggOptionsFilter,
      page: $page,
      pageSize: $pageSize
    }) {
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
  .panel {
    margin-top: 5px;
    margin-bottom: 0px;
  }
  .panel-heading {
    margin: 0px;
    padding: 5px;
  }
  .panel-title {
    margin: 0px;
    font-size: 14px;
    width: 100%;
  }
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
}

interface AggDropDownProps {
  agg: string;
  isOpen: boolean;
  buckets?: AggBucket[];
  searchParams: SearchParams;
  aggKind: AggKind;
  selectedKeys : Set<string>;
  onOpen: (agg: string, aggKind: AggKind) => void;
  addFilter: AggCallback;
  removeFilter: AggCallback;
}

class AggDropDown extends React.Component<AggDropDownProps, AggDropDownState> {
  state = { hasMore: true, loading: false, buckets: [], filter: '', isOpen: false };

  static getDerivedStateFromProps(props: AggDropDownProps, state: AggDropDownState)  {
    if (props.isOpen !== state.isOpen) {
      if (props.isOpen) {
        return { hasMore: true, loading: false, buckets: [], filter: '', isOpen: props.isOpen };
      }

      return {
        hasMore: true,
        loading: false,
        buckets: props.buckets,
        filter: '',
        isOpen: props.isOpen,
      };
    }

    return null;
  }

  // getBucketKey = (key: string): string => path([key, 'key'], this.props.buckets)
  // getBucketDocCount = (key: string): number => path([key, 'docCount'], this.props.buckets)
  isSelected = (key: string): boolean =>
    this.props.selectedKeys && this.props.selectedKeys.has(key)
  toggleAgg = (agg: string, key: string): void =>
    this.isSelected(key) ? this.props.removeFilter(agg, key) : this.props.addFilter(agg, key)
  getFullPagesCount = () => Math.floor(length(this.state.buckets) / PAGE_SIZE);

  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({ filter: value, buckets: [], hasMore: true });
  }

  handleToggle = () => {
    this.props.onOpen(this.props.agg, this.props.aggKind);
  }

  handleLoadMore = async (apolloClient) => {
    // TODO
    const [query, filterType] = this.props.aggKind === 'crowdAggs' ?
    [QUERY_CROWD_AGG_BUCKETA, 'crowdAggFilters'] :
    [QUERY_AGG_BUCKETS, 'aggFilters'];

    const variables = {
      ...gqlParams(this.props.searchParams),
      agg: this.props.agg,
      pageSize: PAGE_SIZE,
      page: this.getFullPagesCount(),
      aggOptionsFilter: this.state.filter,
    };

    const response = await apolloClient.query({
      query,
      variables,
    });

    const newBuckets = pathOr([], ['data', 'aggBuckets', 'aggs', 0, 'buckets'], response);

    // @ts-ignore
    const buckets = pipe(
      // @ts-ignore
      concat(newBuckets),
      uniqBy(prop('key')),
      sortBy(prop('key')),
    )(this.state.buckets);

    const hasMore = length(this.state.buckets) !== length(buckets);
    // @ts-ignore
    this.setState({ buckets, hasMore });
  }

  renderBuckets = () => {
    const { agg } = this.props;
    const { buckets = [] } = this.state;

    return pipe(
      sortBy(prop('key')),
      map(({ key, docCount }) => (
        <Checkbox
          key={key}
          checked={this.isSelected(key)}
          onChange={() => this.toggleAgg(agg, key)}>
            {aggKeyToInner(agg, key)}
            <span> ({docCount})</span>
        </Checkbox>
      )),
    )(buckets);
  }

  renderBucketsPanel = (apolloClient) => {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={() => this.handleLoadMore(apolloClient)}
        hasMore={this.state.hasMore}
        useWindow={false}
        loader={(
          <BeatLoader
            key="loader"
            color="#333"
          />
        )}
      >
        {this.renderBuckets()}
      </InfiniteScroll>
    );
  }

  renderFilter = () => {
    const { buckets = [], filter } = this.state;
    if ((length(buckets) <= 10) && (isNil(filter) || isEmpty(filter))) {
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
  }

  render() {
    const { agg } = this.props;
    const { isOpen } = this.state;

    const title = aggToField(agg);
    const icon = `chevron${(isOpen ? '-up' : '-down')}`;

    return (
      <ApolloConsumer>
         {apolloClient => (
          <PanelWrapper>
            <Panel onToggle={this.handleToggle} expanded={isOpen}>
              <Panel.Heading>
                <Panel.Title toggle>
                  <div className="flex">
                    <span>{title}</span>
                    <span> <FontAwesome name={icon} /> </span>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              {isOpen &&
                <Panel.Collapse>
                  <Panel.Body>
                    {this.renderFilter()}
                  </Panel.Body>
                  <Panel.Body>
                    {this.renderBucketsPanel(apolloClient)}
                  </Panel.Body>
                </Panel.Collapse>
              }
            </Panel>
          </PanelWrapper>
        )}
      </ApolloConsumer>
    );
  }
}

export default AggDropDown;
