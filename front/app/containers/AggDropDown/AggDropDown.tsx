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
import { withApollo } from 'react-apollo';
import { Panel } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';

import {
  AggBucket,
  AggCallback,
  AggregateAggCallback,
  SearchParams,
  AggKind,
  maskAgg,
} from '../SearchPage/Types';
import aggToField from 'utils/aggs/aggToField';
import { FieldDisplay } from 'types/globalTypes';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import {
  SiteViewFragment,
  SiteViewFragment_search_aggs_fields,
} from 'types/SiteViewFragment';
import './AggDropDownStyle.css';
import { SiteFragment, SiteFragment_siteView } from 'types/SiteFragment';
import SortKind from './SortKind';
import BucketsPanel from './BucketsPanel';
import Filter from './Filter';
import SearchPageCrowdAggBucketsQuery from 'queries/SearchPageCrowdAggBucketsQuery';
import SearchPageAggBucketsQuery from 'queries/SearchPageAggBucketsQuery';
import RangeSelector from './RangeSelector';
import AllowMissingCheckbox from './AllowMissingCheckbox';
import withTheme from '../ThemeProvider';
import { ApolloClient } from 'apollo-boost';
import { capitalize } from 'utils/helpers';
import {
  ThemedPresearchCard,
  ThemedPresearchHeader,
  PresearchTitle,
  PresearchFilter,
  PresearchPanel,
  PresearchContent,
} from 'components/StyledComponents';

const PAGE_SIZE = 25;

const Container = styledComponents.div`
  padding: 10px;
  padding-right: 0;
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
  #range-dropdown {
    padding: 5px;
    max-height: 400px;
    overflow-x: visible;
  }
  .range-selector {
    padding: 5px;
    padding-right: 15px;
  }
  .range-selector .dropdown {
    width: 100%;
 }
  .range-selector button {
    width: 100%;
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
  sortKind: any;
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
  addAllFilters?: any;
  removeAllFilters?: any;
  removeFilters?: AggregateAggCallback | undefined;
  removeFilter: AggCallback | null;
  display?: FieldDisplay;
  visibleOptions?: String[];
  onOpen?: (agg: string, aggKind: AggKind) => void;
  removeSelectAll?: boolean;
  presearch?: boolean;
  configType?: 'presearch' | 'autosuggest' | 'facetbar';
  returnAll?: boolean;
  resetSelectAll?: () => void;
  client: ApolloClient<any>;
  site: SiteFragment;
  currentSiteView: SiteFragment_siteView;
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
    if (props.presearch && !equals(state.prevParams, props.searchParams)) {
      return {
        hasMore: true,
        loading: false,
        buckets: [],
        prevParams: props.searchParams,
      };
    }
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

  isSelected = (key: string): boolean =>
    this.props.selectedKeys && this.props.selectedKeys.has(key);

  selectAll = (agg: string): void => {
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
      if (!this.props.addFilters) {
        this.props.addAllFilters(agg, newParams, false);
        this.setState({
          checkboxValue: true,
        });
        return;
      }
      this.props.addFilters(this.props.agg, newParams, false);
      this.setState({
        checkboxValue: true,
      });
    } else {
      if (!this.props.removeFilters) {
        this.props.removeAllFilters(agg, newParams, false);
        this.setState({
          checkboxValue: false,
        });
        return;
      }
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

  getFullPagesCount = buckets => Math.floor(length(buckets) / PAGE_SIZE);

  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({ filter: value, buckets: [], hasMore: true });
  };

  handleToggle = () => {
    this.props.onOpen && this.props.onOpen(this.props.agg, this.props.aggKind);
  };

  handleSort = (desc: boolean, sortKind: SortKind) => {
    switch (sortKind) {
      case SortKind.Alpha:
        return [{ id: 'key', desc: !desc }];
      case SortKind.Number:
        return [{ id: 'count', desc: !desc }];
    }
  };

  handleLoadMore = async () => {
    const { client: apolloClient } = this.props;
    const { desc, sortKind, buckets, filter } = this.state;
    const {
      agg,
      searchParams,
      currentSiteView,
      configType,
      returnAll,
    } = this.props;
    const [query, filterType] =
      this.props.aggKind === 'crowdAggs'
        ? [SearchPageCrowdAggBucketsQuery, 'crowdAggFilters']
        : [SearchPageAggBucketsQuery, 'aggFilters'];

    let aggSort = this.handleSort(desc, sortKind);

    const variables = {
      ...searchParams,
      url: currentSiteView.url,
      configType: configType,
      returnAll: returnAll,
      aggFilters: maskAgg(searchParams.aggFilters, this.props.agg),
      crowdAggFilters: maskAgg(
        this.props.searchParams.crowdAggFilters,
        this.props.agg
      ),
      agg: agg,
      pageSize: PAGE_SIZE,
      page: this.getFullPagesCount(this.state.buckets),
      aggOptionsFilter: filter,
      aggOptionsSort: aggSort,
    };

    const response = await apolloClient.query({
      query,
      variables,
    });

    const responseBuckets = pathOr(
      [],
      ['data', 'aggBuckets', 'aggs', 0, 'buckets'],
      response
    ) as AggBucket[];

    let newBuckets = pipe(
      concat(responseBuckets),
      uniqBy(prop('key')),
      sortBy(prop('key'))
    )(buckets) as AggBucket[];

    if (!desc && sortKind === SortKind.Alpha) {
      newBuckets = pipe(
        concat(responseBuckets),
        uniqBy(prop('key')),
        sortBy(prop('key')),
        reverse
      )(this.state.buckets) as AggBucket[];
    }
    if (desc && sortKind === SortKind.Number) {
      newBuckets = pipe(
        concat(responseBuckets),
        uniqBy(prop('key')),
        sortBy(prop('docCount'))
      )(this.state.buckets) as AggBucket[];
    }
    if (!desc && sortKind === SortKind.Number) {
      newBuckets = pipe(
        concat(responseBuckets),
        uniqBy(prop('key')),
        sortBy(prop('docCount')),
        reverse
      )(this.state.buckets) as AggBucket[];
    }

    const hasMore = length(buckets) !== length(newBuckets);
    this.setState({ buckets: newBuckets, hasMore });
  };

  findFields = () => {
    const { agg, site, currentSiteView } = this.props;
    if (this.props.presearch == true) {
      return find(propEq('name', agg), [
        ...(currentSiteView?.search?.presearch?.aggs?.fields || []),
        ...(currentSiteView?.search?.presearch?.crowdAggs?.fields || []),
      ]) as SiteViewFragment_search_aggs_fields | null;
    }
    return find(propEq('name', agg), [
      ...(currentSiteView?.search?.aggs?.fields || []),
      ...(currentSiteView?.search?.crowdAggs?.fields || []),
    ]) as SiteViewFragment_search_aggs_fields | null;
  };

  renderPanel = (isPresearch: boolean) => {
    const { visibleOptions = [], removeSelectAll } = this.props;
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
    const field = this.findFields();
    if (
      field?.display === FieldDisplay.DATE_RANGE ||
      field?.display === FieldDisplay.NUMBER_RANGE
    ) {
      return (
        <Panel.Collapse id="range-selector">
          <Panel.Body>
            <Container>
              <RangeSelector
                isOpen={isOpen}
                hasMore={hasMore}
                loading={loading}
                buckets={buckets}
                handleLoadMore={this.handleLoadMore}
                aggType={
                  field?.display === FieldDisplay.DATE_RANGE
                    ? FieldDisplay.DATE_RANGE
                    : FieldDisplay.NUMBER_RANGE
                }
              />
            </Container>
            {!loading && (
              <Container>
                <AllowMissingCheckbox buckets={buckets} />
              </Container>
            )}
          </Panel.Body>
        </Panel.Collapse>
      );
    }
    return (
      <Panel.Collapse className="bm-panel-collapse">
        <Panel.Body>
          <Filter
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
            isPresearch={isPresearch}
            visibleOptions={visibleOptions}
            buckets={buckets}
            isSelected={this.isSelected}
            hasMore={hasMore}
            handleLoadMore={this.handleLoadMore}
            field={field}
          />
          <AllowMissingCheckbox buckets={buckets} />
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

  renderPresearchFilter = () => {
    const { agg, removeSelectAll, visibleOptions } = this.props;
    const {
      buckets = [],
      filter,
      desc,
      sortKind,
      hasMore,
      checkboxValue,
      showLabel,
      isOpen,
      loading,
    } = this.state;
    const field = this.findFields();
    if (
      field?.display === FieldDisplay.DATE_RANGE ||
      field?.display === FieldDisplay.NUMBER_RANGE
    ) {
      return (
        <PresearchPanel id="range-selector">
          <Container>
            <RangeSelector
              isOpen={isOpen}
              hasMore={hasMore}
              loading={loading}
              buckets={buckets}
              handleLoadMore={this.handleLoadMore}
              aggType={
                field?.display === FieldDisplay.DATE_RANGE
                  ? FieldDisplay.DATE_RANGE
                  : FieldDisplay.NUMBER_RANGE
              }
            />
          </Container>
          {!loading && (
            <Container>
              <AllowMissingCheckbox buckets={buckets} />
            </Container>
          )}
        </PresearchPanel>
      );
    }
    return (
      <PresearchContent>
        <PresearchFilter>
          <Filter
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
        </PresearchFilter>
        <PresearchPanel>
          <BucketsPanel
            isPresearch={true}
            visibleOptions={visibleOptions}
            buckets={buckets}
            isSelected={this.isSelected}
            hasMore={hasMore}
            handleLoadMore={this.handleLoadMore}
            field={field}
          />
        </PresearchPanel>
      </PresearchContent>
    );
  };

  componentDidMount() {
    let fields = this.props.currentSiteView.search.aggs.fields;
    const field = this.findFields();
    if (field?.order && field.order.sortKind == 'key') {
      this.setState({
        sortKind: 0,
        desc: field.order.desc,
      });
    } else if (field?.order && field.order.sortKind == 'count') {
      this.setState({
        sortKind: 1,
        desc: field.order.desc,
      });
    }
  }

  render() {
    const { agg, presearch } = this.props;
    const { isOpen } = this.state;
    let currentAgg =this.findFields();
    //@ts-ignore
    let configuredLabel = currentAgg.displayName;
    const title = aggToField(agg,configuredLabel);

    const icon = `chevron${isOpen ? '-up' : '-down'}`;
    if (presearch) {
      return (
        <ThemedPresearchCard>
          <ThemedPresearchHeader>
            <PresearchTitle>{capitalize(title)}</PresearchTitle>
          </ThemedPresearchHeader>
          <PresearchContent>{this.renderPresearchFilter()}</PresearchContent>
        </ThemedPresearchCard>
      );
    } else {
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
            {this.renderPanel(false)}
          </Panel>
        </PanelWrapper>
      );
    }
  }
}

export default withApollo(withSite(AggDropDown));
