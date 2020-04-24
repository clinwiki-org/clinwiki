import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import {
  SearchPageHashMutation as SearchPageHashMutationType,
  SearchPageHashMutationVariables,
} from 'types/SearchPageHashMutation';
import {
  SearchPageParamsQuery as SearchPageParamsQueryType,
  SearchPageParamsQueryVariables,
  SearchPageParamsQuery_searchParams,
} from 'types/SearchPageParamsQuery';
import { MAX_WINDOW_SIZE } from 'utils/constants';
import { SearchParams, AggKind, SearchQuery } from './shared';
import SearchStudyPage from 'containers/SearchStudyPage';
import BulkEditPage from 'containers/BulkEditPage';
import { Query, graphql, ApolloConsumer } from 'react-apollo';
import { ThemedButton } from '../../components/StyledComponents';
import { History } from 'history';
import {
  path,
  map,
  filter,
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
  findIndex,
  propEq,
  reject,
  isEmpty,
  view,
  remove,
  equals,
} from 'ramda';
import SearchView from './SearchView';
import CrumbsBar from './components/CrumbsBar';
import { AggFilterInput, SortInput } from 'types/globalTypes';
import Aggs from './components/Aggs';
import {
  SearchPageSearchQuery_search_aggs,
  SearchPageSearchQuery_search_aggs_buckets,
  SearchPageSearchQuery_crowdAggs_aggs,
  SearchPageSearchQuery_search_studies,
} from 'types/SearchPageSearchQuery';
import { AggBucketMap, AggFilterListItem, defaultPageSize } from './Types';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { SiteFragment, SiteFragment_siteView } from 'types/SiteFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';
import { match } from 'react-router';
import SearchPageHashMutation from 'queries/SearchPageHashMutation';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import withTheme from 'containers/ThemeProvider';
import SearchParamsContext from './components/SearchParamsContext';

class ParamsQueryComponent extends Query<
  SearchPageParamsQueryType,
  SearchPageParamsQueryVariables
> {}

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
  flex: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }

  .rt-th {
    text-transform: capitalize;
    padding: 15px !important;
    background: ${props =>
      props.theme.searchResults.resultsHeaderBackground} !important;
    color: #fff;
  }

  .ReactTable .-pagination .-btn {
    background: ${props =>
      props.theme.searchResults.resultsPaginationButtons} !important;
  }

  div.rt-tbody div.rt-tr:hover {
    background: ${props =>
      props.theme.searchResults.resultsRowHighlight} !important;
    color: #fff !important;
  }

  .rt-table {
  }
`;

const SearchPageWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  @media only screen and (max-width: 1132px) {
    flex-direction: column;
  }
`;

const ThemedMainContainer = withTheme(MainContainer);

const SidebarContainer = styled(Col)`
  padding-right: 0px !important;
  padding-top: 10px;
  box-sizing: border-box;
  width: 235px;
  min-width: 235px;
  min-height: 100%;
  /* background: ${props => props.theme.aggSideBar.sideBarBackground}; */
  .panel-title {
    a:hover {
      text-decoration: none;
      color: ${props => props.theme.aggSideBar.sideBarFontHover};
    }
  }
  .panel-default {
    box-shadow: 0px;
    border: 0px;
    background: none;
    color: #fff;
    text-transform: capitalize;
    .panel-heading {
      box-shadow: 0px;
      border: 0px;
      background: none;
      color: #fff;
      text-transform: capitalize;
    }
    .panel-collapse {
      background: #394149;
      .panel-body {
        padding-left: 10px;
        color: #fff;
      }
    }
    .panel-title {
      font-size: 16px;
      color: ${props => props.theme.aggSideBar.sideBarFont};
      padding: 0px 10px;
    }
  }
  @media only screen and (max-width: 1132px) {
    width: 100%;
  }
`;
const ThemedSidebarContainer = withTheme(SidebarContainer);

const SearchContainer = styled.div`
  border: solid white 1px;
  background-color: #f2f2f2;
  color: black;
  margin-bottom: 1em;
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const InstructionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
`;
const Instructions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const changeFilter = (add: boolean) => (
  aggName: string,
  key: string,
  isCrowd?: boolean
) => (params: SearchParams) => {
  const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
  const lens = lensPath([propName]);
  return over(
    lens,
    (aggs: AggFilterInput[]) => {
      const index = findIndex(propEq('field', aggName), aggs);
      if (index === -1 && add) {
        return [...aggs, { field: aggName, values: [key] }];
      }
      const aggLens = lensPath([index, 'values']);
      const updater = (values: string[]) =>
        add ? [...values, key] : reject(x => x === key, values);
      let res = over(aggLens, updater, aggs);
      // Drop filter if no values left
      if (isEmpty(view(aggLens, res))) {
        res = remove(index, 1, res as any);
      }
      return res;
    },
    {
      ...params,
      page: 0,
    }
  );
};
const addFilter = changeFilter(true);
const removeFilter = changeFilter(false);
const addFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
  return (params: SearchParams) => {
    keys.forEach(k => {
      params = addFilter(aggName, k, isCrowd)(params) as SearchParams;
    });
    // changeFilter(true);
    return params;
  };
};

const removeFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
  return (params: SearchParams) => {
    keys.forEach(k => {
      params = removeFilter(aggName, k, isCrowd)(params) as SearchParams;
    });
    // changeFilter(true);
    return params;
  };
};

const addSearchTerm = (term: string) => (params: SearchParams) => {
  // have to check for empty string because if you press return two times it ends up putting it in the terms
  if (!term.replace(/\s/g, '').length) {
    return params;
  }
  // recycled code for removing repeated terms. might be a better way but I'm not sure.
  const children = reject(propEq('key', term), params.q.children || []);
  return {
    ...params,
    q: { ...params.q, children: [...(children || []), { key: term }] },
    page: 0,
  };
};

const removeSearchTerm = (term: string) => (params: SearchParams) => {
  const children = reject(
    propEq('key', term),
    params.q.children || []
  ) as SearchQuery[];
  return {
    ...params,
    q: { ...params.q, children },
    page: 0,
  };
};

const changePage = (pageNumber: number) => (params: SearchParams) => ({
  ...params,
  page: Math.min(pageNumber, Math.ceil(MAX_WINDOW_SIZE / params.pageSize) - 1),
});

interface SearchPageProps {
  match: match<{ siteviewUrl: string }>;
  history: any;
  location: any;
  ignoreUrlHash?: boolean | null;
  searchParams?: SearchParams;
  site: SiteFragment;
  currentSiteView: SiteFragment_siteView;
  mutate: any;
  email?:string;
}

interface SearchPageState {
  params: SearchParams | null;
  openedAgg: {
    name: string;
    kind: AggKind;
  } | null;
  searchAggs: AggBucketMap;
  searchCrowdAggs: AggBucketMap;
  removeSelectAll: boolean;
  totalRecords: number;
}

const DEFAULT_PARAMS: SearchParams = {
  q: { key: 'AND', children: [] },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: defaultPageSize,
};

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  state: SearchPageState = {
    params: null,
    openedAgg: null,
    searchAggs: {},
    searchCrowdAggs: {},
    removeSelectAll: false,
    totalRecords: 0,
  };

  numberOfPages: number = 0;
  returnNumberOfPages = (numberOfPg: number) => {
    this.numberOfPages = numberOfPg;
  };

  static getDerivedStateFromProps(
    props: SearchPageProps,
    state: SearchPageState
  ) {
    if (state.params == null && props.ignoreUrlHash) {
      return {
        params: props.searchParams || DEFAULT_PARAMS,
        openedAgg: null,
      };
    }
    return null;
  }

  previousSearchData: Array<SearchPageSearchQuery_search_studies> = [];
  returnPreviousSearchData = (
    previousSearchData: Array<SearchPageSearchQuery_search_studies>
  ) => {
    this.previousSearchData = previousSearchData;
  };

  getDefaultParams = () => {
    return {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(this.props.currentSiteView),
    };
  };

  searchParamsFromQuery = (
    params: SearchPageParamsQuery_searchParams | null | undefined
  ): SearchParams => {
    const defaultParams = this.getDefaultParams();
    if (!params) return defaultParams;

    const q = params.q
      ? (JSON.parse(params.q) as SearchQuery)
      : defaultParams.q;

    const aggFilters = map(
      dissoc('__typename'),
      params.aggFilters || []
    ) as AggFilterInput[];
    const crowdAggFilters = map(
      dissoc('__typename'),
      params.crowdAggFilters || []
    ) as AggFilterInput[];
    const sorts = map(dissoc('__typename'), params.sorts || []) as SortInput[];

    return {
      aggFilters,
      crowdAggFilters,
      sorts,
      q,
      page: params.page || 0,
      pageSize: params.pageSize || defaultPageSize,
    };
  };

  transformFilters = (
    filters: AggFilterInput[]
  ): { [key: string]: Set<string> } => {
    return pipe(
      groupBy(prop('field')),
      map(head),
      map(propOr([], 'values')),
      map(arr => new Set(arr))
    )(filters) as { [key: string]: Set<string> };
  };

  transformAggs = (
    aggs: SearchPageSearchQuery_search_aggs[]
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    return pipe(
      groupBy(prop('name')),
      map(head),
      map(prop('buckets'))
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
  };

  transformCrowdAggs = (
    aggs: SearchPageSearchQuery_crowdAggs_aggs[]
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    // @ts-ignore
    return pipe(head, prop('buckets'), groupBy(prop('key')))(aggs) as {
      [key: string]: SearchPageSearchQuery_search_aggs_buckets[];
    };
  };

  handleResetFilters = () => {
    this.setState(
      {
        params: this.getDefaultParams(),
        removeSelectAll: true,
      },
      () => this.updateSearchParams(this.state.params)
    );
  };

  handleClearFilters = () => {
    this.setState(
      {
        params: DEFAULT_PARAMS,
        removeSelectAll: true,
      },
      () => this.updateSearchParams(this.state.params)
    );
  };

  resetSelectAll = () => {
    this.setState(
      {
        removeSelectAll: false,
      },
      () => this.updateSearchParams(this.state.params)
    );
  };

  handleUpdateParams = (updater: (params: SearchParams) => SearchParams) => {
    const params = updater(this.state.params!);
    this.previousSearchData = [];
    if (!equals(params.q, this.state.params && this.state.params.q)) {
      // For now search doesn't work well with args list
      // Therefore we close it to refresh later on open
      this.setState({ openedAgg: null });
    }
    this.setState({ params }, () => this.updateSearchParams(this.state.params));
  };

  isWorkflow = () => {
    return pipe(
      pathOr([], ['params', 'crowdAggFilters']),
      map(prop('field')),
      // @ts-ignore
      any(x => (x as string).toLowerCase().includes('wf_'))
    )(this.state);
  };

  handleRowClick = (nctId: string, hash: string, siteViewUrl: string) => {
    const suffix =
      this.isWorkflow() && !this.props.ignoreUrlHash ? '/workflow' : '';
    this.props.history.push(
      `/study/${nctId}${suffix}?hash=${hash}&sv=${siteViewUrl}`
    );
  };

  handleBulkUpdateClick = (hash: string, siteViewUrl: string) => {
    this.props.history.push(`/bulk?hash=${hash}&sv=${siteViewUrl}`);
  };

  handleOpenAgg = (name: string, kind: AggKind) => {
    if (!this.state.openedAgg) {
      this.setState({ openedAgg: { name, kind } });
      return;
    }
    const { name: currentName, kind: currentKind } = this.state.openedAgg;
    if (name === currentName && kind === currentKind) {
      this.setState({ openedAgg: null });
      return;
    }

    this.setState({ openedAgg: { name, kind } });
  };

  handleAggsUpdate = (
    searchAggs: AggBucketMap,
    searchCrowdAggs: AggBucketMap
  ) => {
    if (
      !equals(searchAggs, this.state.searchAggs) ||
      !equals(searchCrowdAggs, this.state.searchCrowdAggs)
    ) {
      this.setState({ searchAggs, searchCrowdAggs }, () =>
        this.updateSearchParams(this.state.params)
      );
    }
  };

  renderAggs = siteView => {
    const opened = this.state.openedAgg && this.state.openedAgg.name;
    const openedKind = this.state.openedAgg && this.state.openedAgg.kind;
    const { aggFilters = [], crowdAggFilters = [] } = this.state.params || {};
    return (
      <Aggs
        aggs={this.state.searchAggs}
        crowdAggs={this.state.searchCrowdAggs}
        filters={this.transformFilters(aggFilters)}
        crowdFilters={this.transformFilters(crowdAggFilters)}
        addFilter={pipe(addFilter, this.handleUpdateParams)}
        addFilters={pipe(addFilters, this.handleUpdateParams)}
        removeFilter={pipe(removeFilter, this.handleUpdateParams)}
        removeFilters={pipe(removeFilters, this.handleUpdateParams)}
        updateParams={this.handleUpdateParams}
        removeSelectAll={this.state.removeSelectAll}
        resetSelectAll={this.resetSelectAll}
        // @ts-ignore
        opened={opened}
        openedKind={openedKind}
        onOpen={this.handleOpenAgg}
        currentSiteView={siteView}
      />
    );
  };

  renderSearch = () => {
    const hash = this.getHashFromLocation();
    const { currentSiteView } = this.props;
    return (
      <ParamsQueryComponent
        key={`${hash}+${JSON.stringify(this.state?.params)}`}
        query={SearchPageParamsQuery}
        variables={{ hash }}
        onCompleted={async (data: any) => {
          this.updateStateFromHash(data.searchParams);
        }}>
        {result => {
          const { data, loading, error } = result;
          if (error || loading) return null;

          const params: SearchParams = this.searchParamsFromQuery(
            data!.searchParams
          );
          // hydrate state params from hash
          if (!this.state.params) {
            this.setState({ params });
            return null;
          }
          const opened = this.state.openedAgg && this.state.openedAgg.name;
          const openedKind = this.state.openedAgg && this.state.openedAgg.kind;

          return (
            <SearchView
              key={`${hash}+${JSON.stringify(params)}`}
              params={params}
              onBulkUpdate={this.handleBulkUpdateClick}
              openedAgg={this.state.openedAgg}
              onUpdateParams={this.handleUpdateParams}
              onRowClick={this.handleRowClick}
              onOpenAgg={this.handleOpenAgg}
              onAggsUpdate={this.handleAggsUpdate}
              onResetFilters={this.handleResetFilters}
              onClearFilters={this.handleClearFilters}
              previousSearchData={this.previousSearchData}
              returnPreviousSearchData={this.returnPreviousSearchData}
              searchHash={hash || ''}
              showCards={this.showingCards()}
              returnNumberOfPages={this.returnNumberOfPages}
              searchAggs={this.state.searchAggs}
              crowdAggs={this.state.searchCrowdAggs}
              transformFilters={this.transformFilters}
              removeSelectAll={this.state.removeSelectAll}
              resetSelectAll={this.resetSelectAll}
              searchParams={this.state.params}
              opened={opened}
              openedKind={openedKind}
              onOpen={this.handleOpenAgg}
              currentSiteView={currentSiteView}
              getTotalResults={this.getTotalResults}
            />
          );
        }}
      </ParamsQueryComponent>
    );
  };

  handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
      this.state.params!.page < this.numberOfPages - 1 &&
      this.showingCards()
    ) {
      window.removeEventListener('scroll', this.handleScroll);

      const params: any = {
        ...this.state.params,
        page: this.state.params!.page + 1,
      };
      this.setState({ params }, () =>
        this.updateSearchParams(this.state.params)
      );

      setTimeout(() => {
        window.addEventListener('scroll', this.handleScroll);
      }, 1000);

      return null;
    }
  };

  showingCards = () => this.props.currentSiteView.search.results.type == 'card';

  componentDidMount() {
    let searchTerm = new URLSearchParams(this.props.location?.search || '');
    console.log("EMAIL", this.props.email, this.props)

  
    if (searchTerm.has('q')) {
      let q = {
        key: 'AND',
        children: [{ children: [], key: searchTerm.getAll('q').toString() }],
      };
      this.setState(
        {
          params: {
            q: q,
            aggFilters: [],
            crowdAggFilters: [],
            sorts: [],
            page: 0,
            pageSize: defaultPageSize,
          },
        },
        () => this.updateSearchParams(this.state.params)
      );
    }
    if (this.showingCards()) {
      window.addEventListener('scroll', this.handleScroll);
    } else {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.showingCards()) {
      window.addEventListener('scroll', this.handleScroll);
    } else {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  getHashFromLocation(): string | null {
    let hash = new URLSearchParams(this.props.history.location.search).getAll(
      'hash'
    );
    return hash.toString();
  }

  updateStateFromHash(searchParams) {
    const params: SearchParams = this.searchParamsFromQuery(searchParams);
    let searchTerm = new URLSearchParams(this.props.location?.search || '');

    if (searchTerm.has('q')) {
      let q = {
        key: 'AND',
        children: [{ children: [], key: searchTerm.getAll('q').toString() }],
      };
      this.setState(
        {
          params: {
            ...params,
            q: q,
          },
        },
        () => this.updateSearchParams(this.state.params)
      );
    }
    this.setState({
      params: {
        ...params,
      },
    });
  }
  updateSearchParams = async params => {
    this.setState({
      ...this.state,
      params: { ...(this.state?.params || {}), ...params },
    });
    const variables = { ...this.state.params, ...params };
    const { data } = await this.props.mutate({ variables });
    const siteViewUrl =
      new URLSearchParams(this.props.history.location.search)
        .getAll('sv')
        .toString() || 'default';
    if (data?.provisionSearchHash?.searchHash?.short) {
      if(this.props.match.path =="/profile"){
        console.log("pushing")
        this.props.history.push(
          `/profile?hash=${
            data!.provisionSearchHash!.searchHash!.short
          }&sv=${siteViewUrl}`
        );
      }
console.log("pushing to search")
      this.props.history.push(
        `/search?hash=${
          data!.provisionSearchHash!.searchHash!.short
        }&sv=${siteViewUrl}`
      );
    }
  };

  getTotalResults = total => {
    if (total) {
      this.setState({
        totalRecords: total,
      });
    }
    return null;
  };

  handlePresearchButtonClick = (hash, target) => {
    console.log(hash, target);
    const url = `/search?hash=${hash}&sv=${target}`;
    this.props.history.push(url);
  };

  renderPresearch = hash => {
    const { aggFilters = [], crowdAggFilters = [] } = this.state.params || {};
    const { currentSiteView } = this.props;
    const preSearchAggs = currentSiteView.search.presearch.aggs.selected.values;
    const preSearchCrowdAggs =
      currentSiteView.search.presearch.crowdAggs.selected.values;
    const presearchButton = currentSiteView.search.presearch.button;
    const presearchText = currentSiteView.search.presearch.instructions;
    return (
      <SearchContainer>
        <InstructionsContainer>
          {presearchText && (
            <Instructions>
              <h5>{presearchText}</h5>
            </Instructions>
          )}
        </InstructionsContainer>
        <Aggs
          aggs={this.state.searchAggs}
          crowdAggs={this.state.searchCrowdAggs}
          filters={this.transformFilters(aggFilters)}
          crowdFilters={this.transformFilters(crowdAggFilters)}
          addFilter={pipe(addFilter, this.handleUpdateParams)}
          addFilters={pipe(addFilters, this.handleUpdateParams)}
          removeFilter={pipe(removeFilter, this.handleUpdateParams)}
          removeFilters={pipe(removeFilters, this.handleUpdateParams)}
          updateParams={this.handleUpdateParams}
          removeSelectAll={this.state.removeSelectAll}
          resetSelectAll={this.resetSelectAll}
          // @ts-ignore
          searchParams={this.state.params}
          presearch
          preSearchAggs={preSearchAggs}
          preSearchCrowdAggs={preSearchCrowdAggs}
          currentSiteView={currentSiteView}
        />
        {presearchButton.name && (
          <ThemedButton
            onClick={() =>
              this.handlePresearchButtonClick(hash, presearchButton.target)
            }
            style={{ width: 200, marginLeft: 13 }}>
            {presearchButton.name}
          </ThemedButton>
        )}
      </SearchContainer>
    );
  };

  renderCrumbs = () => {
    const { params, totalRecords } = this.state;
    const q =
      this.state.params?.q.key === '*'
        ? []
        : (this.state.params?.q.children || []).map(prop('key'));

    const searchParams = {
      ...this.state.params!,
      q,
    };

    const { currentSiteView } = this.props;
    const hash = this.getHashFromLocation();
    return (
      <CrumbsBar
        searchParams={searchParams}
        onBulkUpdate={this.handleBulkUpdateClick}
        removeFilter={pipe(removeFilter, this.handleUpdateParams)}
        addSearchTerm={pipe(addSearchTerm, this.handleUpdateParams)}
        removeSearchTerm={pipe(removeSearchTerm, this.handleUpdateParams)}
        update={{
          page: pipe(changePage, this.handleUpdateParams),
        }}
        data={this.props.site}
        onReset={this.handleResetFilters}
        onClear={this.handleClearFilters}
        addFilter={pipe(addFilter, this.handleUpdateParams)}
        currentSiteView={currentSiteView}
        totalResults={totalRecords}
        searchHash={hash || ''}
      />
    );
  };

  render() {
    const opened = this.state.openedAgg && this.state.openedAgg.name;
    const openedKind = this.state.openedAgg && this.state.openedAgg.kind;
    const { currentSiteView } = this.props;
    if (this.props.ignoreUrlHash) {
      return (
        <SearchParamsContext.Provider
          value={{
            searchParams: this.state.params,
            updateSearchParams: params => {
              this.setState({ params: { ...this.state.params, ...params } });
            },
          }}>
          <Row>
            <ThemedSidebarContainer md={2}>
              {this.renderAggs(currentSiteView)}
            </ThemedSidebarContainer>
            <ThemedMainContainer md={10}>
              {this.renderPresearch(null)}
              <SearchView
                params={this.state.params as any}
                onBulkUpdate={this.handleBulkUpdateClick}
                openedAgg={this.state.openedAgg}
                onUpdateParams={this.handleUpdateParams}
                onRowClick={this.handleRowClick}
                onOpenAgg={this.handleOpenAgg}
                onAggsUpdate={this.handleAggsUpdate}
                onResetFilters={this.handleResetFilters}
                onClearFilters={this.handleClearFilters}
                previousSearchData={this.previousSearchData}
                returnPreviousSearchData={() => this.returnPreviousSearchData}
                searchHash={''}
                showCards={this.showingCards()}
                returnNumberOfPages={this.returnNumberOfPages}
                searchAggs={this.state.searchAggs}
                crowdAggs={this.state.searchCrowdAggs}
                transformFilters={this.transformFilters}
                removeSelectAll={this.state.removeSelectAll}
                resetSelectAll={this.resetSelectAll}
                searchParams={this.state.params}
                opened={opened}
                openedKind={openedKind}
                onOpen={this.handleOpenAgg}
                currentSiteView={currentSiteView}
                getTotalResults={this.getTotalResults}
              />
            </ThemedMainContainer>
          </Row>
        </SearchParamsContext.Provider>
      );
    }

    const hash = this.getHashFromLocation();

    return (
      <SearchParamsContext.Provider
        value={{
          searchParams: this.state.params,
          updateSearchParams: this.updateSearchParams,
        }}>
        <Switch>
          {/* <Route
            path={`/study/:nctId`}
            component={SearchStudyPage}
          />
          <Route
            path={`/bulk`}	
            component={BulkEditPage}
          /> */}
          <Route
            render={() => {
              const { currentSiteView } = this.props;
              const {
                showPresearch,
                showFacetBar,
                showBreadCrumbs,
              } = currentSiteView.search.config.fields;
              return (
                <SearchPageWrapper>
                  {showFacetBar && (
                    <ThemedSidebarContainer md={2}>
                      {this.renderAggs(currentSiteView)}
                    </ThemedSidebarContainer>
                  )}
                  <ThemedMainContainer>
                    {showBreadCrumbs && this.renderCrumbs()}
                    {showPresearch && this.renderPresearch(hash)}
                    {this.renderSearch()}
                  </ThemedMainContainer>
                </SearchPageWrapper>
              );
            }}
          />
        </Switch>
      </SearchParamsContext.Provider>
    );
  }
}

export default withSite(graphql(SearchPageHashMutation)(SearchPage));
