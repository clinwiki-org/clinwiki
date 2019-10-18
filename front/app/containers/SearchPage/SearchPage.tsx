import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import {
  SearchPageHashQuery,
  SearchPageHashQueryVariables,
} from 'types/SearchPageHashQuery';
import {
  SearchPageParamsQuery,
  SearchPageParamsQueryVariables,
  SearchPageParamsQuery_searchParams,
} from 'types/SearchPageParamsQuery';
import { SearchParams, AggKind, SearchQuery } from './shared';
import SearchStudyPage from 'containers/SearchStudyPage';
import { Query, ApolloConsumer } from 'react-apollo';
import {
  path,
  map,
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
import { AggFilterInput, SortInput } from 'types/globalTypes';
import Aggs from './components/Aggs';
import {
  SearchPageSearchQuery,
  SearchPageSearchQueryVariables,
  SearchPageSearchQuery_search_aggs,
  SearchPageSearchQuery_search_aggs_buckets,
  SearchPageSearchQuery_crowdAggs_aggs,
} from 'types/SearchPageSearchQuery';
import { AggBucketMap } from './Types';
import SiteProvider from 'containers/SiteProvider';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';

const HASH_QUERY = gql`
  query SearchPageHashQuery(
    $q: SearchQueryInput!
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $page: Int
    $pageSize: Int
  ) {
    searchHash(
      params: {
        q: $q
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        page: $page
        pageSize: $pageSize
      }
    )
  }
`;

const PARAMS_QUERY = gql`
  query SearchPageParamsQuery($hash: String) {
    searchParams(hash: $hash) {
      q
      sorts {
        id
        desc
      }
      aggFilters {
        field
        values
      }
      crowdAggFilters {
        field
        values
      }
      page
      pageSize
    }
  }
`;

class HashQueryComponent extends Query<
  SearchPageHashQuery,
  SearchPageHashQueryVariables
> {}
class ParamsQueryComponent extends Query<
  SearchPageParamsQuery,
  SearchPageParamsQueryVariables
> {}

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
  float: left;

  .rt-th {
    text-transform: capitalize;
    padding: 15px !important;
    background: #8bb7a4 !important;
    color: #fff;
  }

  .rt-table {
  }
`;

const SidebarContainer = styled(Col)`
  padding-right: 0px !important;
  padding-top: 10px;
  box-sizing: border-box;

  .panel-title {
    a:hover {
      text-decoration: none;
      color: #fff;
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
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .panel-title {
      font-size: 16px;
      color: #bac5d0;
      padding: 0px 10px;
    }
  }
`;

const changeFilter = (add: boolean) => (
  aggName: string,
  key: string,
  isCrowd?: boolean,
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
    },
  );
};
const addFilter = changeFilter(true);
const removeFilter = changeFilter(false);

interface SearchPageProps {
  match: any;
  history: any;
  ignoreUrlHash?: boolean | null;
  searchParams?: SearchParams;
}

interface SearchPageState {
  params: SearchParams | null;
  openedAgg: {
    name: string;
    kind: AggKind;
  } | null;
  searchAggs: AggBucketMap;
  searchCrowdAggs: AggBucketMap;
  showCards: Boolean;
}

const DEFAULT_PARAMS: SearchParams = {
  q: { key: 'AND', children: [] },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: 25,
};

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  state: SearchPageState = {
    params: null,
    openedAgg: null,
    searchAggs: {},
    searchCrowdAggs: {},
    showCards: (localStorage.getItem('showCards') === 'true') ? true : false,
  };

  static getDerivedStateFromProps(
    props: SearchPageProps,
    state: SearchPageState,
  ) {
    if (state.params == null && props.ignoreUrlHash) {
      return {
        params: props.searchParams || DEFAULT_PARAMS,
        openedAgg: null,
      };
    }
    return null;
  }

  toggledShowCards = (showCards: Boolean) => {
    localStorage.setItem('showCards', showCards.toString());
    const params:any = { ...this.state.params, page: 0 };
    this.setState({ showCards, params });
  }

  previousSearchData: Array<Object> = [];
  returnPreviousSearchData = (previousSearchData: Array<Object>) => {
    this.previousSearchData = previousSearchData;
  }

  getDefaultParams = (view: SiteViewFragment) => {
    return { ...DEFAULT_PARAMS, ...preselectedFilters(view) };
  };

  searchParamsFromQuery = (
    view: SiteViewFragment,
    params: SearchPageParamsQuery_searchParams | null | undefined,
  ): SearchParams => {
    const defaultParams = this.getDefaultParams(view);
    if (!params) return defaultParams;

    const q = params.q
      ? (JSON.parse(params.q) as SearchQuery)
      : defaultParams.q;

    const aggFilters = map(
      dissoc('__typename'),
      params.aggFilters || [],
    ) as AggFilterInput[];
    const crowdAggFilters = map(
      dissoc('__typename'),
      params.crowdAggFilters || [],
    ) as AggFilterInput[];
    const sorts = map(dissoc('__typename'), params.sorts || []) as SortInput[];

    return {
      aggFilters,
      crowdAggFilters,
      sorts,
      q,
      page: params.page || 0,
      pageSize: params.pageSize || 25,
    };
  };

  transformFilters = (
    filters: AggFilterInput[],
  ): { [key: string]: Set<string> } => {
    return pipe(
      groupBy(prop('field')),
      map(head),
      map(propOr([], 'values')),
      map(arr => new Set(arr)),
    )(filters) as { [key: string]: Set<string> };
  };

  transformAggs = (
    aggs: SearchPageSearchQuery_search_aggs[],
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    return pipe(
      groupBy(prop('name')),
      map(head),
      map(prop('buckets')),
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
  };

  transformCrowdAggs = (
    aggs: SearchPageSearchQuery_crowdAggs_aggs[],
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    // @ts-ignore
    return pipe(
      head,
      prop('buckets'),
      groupBy(prop('key')),
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
  };

  handleResetFilters = (view: SiteViewFragment) => () => {
    this.setState({ params: this.getDefaultParams(view) });
  };

  handleUpdateParams = (updater: (params: SearchParams) => SearchParams) => {
    const params = updater(this.state.params as any);
    if (!equals(params.q, this.state.params && this.state.params.q)) {
      // For now search doesn't work well with args list
      // Therefore we close it to refresh later on open
      this.setState({ openedAgg: null });
    }
    this.setState({ params });
  };

  isWorkflow = () => {
    return pipe(
      pathOr([], ['params', 'crowdAggFilters']),
      map(prop('field')),
      // @ts-ignore
      any(x => (x as string).toLowerCase().includes('wf_')),
    )(this.state);
  };

  handleRowClick = (nctId: string) => {
    const suffix =
      this.isWorkflow() && !this.props.ignoreUrlHash ? '/workflow' : '';
    const prefix = this.props.ignoreUrlHash ? '' : this.props.match.url;
    this.props.history.push(`${prefix}/study/${nctId}${suffix}`);
  };

  handleOpenAgg = (name: string, kind: AggKind) => {
    if (!this.state.openedAgg) {
      this.setState({ openedAgg: { name, kind } });
      return;
    }
    // @ts-ignore
    const { name: currentName, kind: currentKind } = this.state.openedAgg;
    if (name === currentName && kind === currentKind) {
      this.setState({ openedAgg: null });
      return;
    }

    this.setState({ openedAgg: { name, kind } });
  };

  handleAggsUpdate = (
    searchAggs: AggBucketMap,
    searchCrowdAggs: AggBucketMap,
  ) => {
    if (
      !equals(searchAggs, this.state.searchAggs) ||
      !equals(searchCrowdAggs, this.state.searchCrowdAggs)
    ) {
      this.setState({ searchAggs, searchCrowdAggs });
    }
  };

  renderAggs = () => {
    const opened = this.state.openedAgg && this.state.openedAgg.name;
    const openedKind = this.state.openedAgg && this.state.openedAgg.kind;
    const { aggFilters = [], crowdAggFilters = [] } = this.state.params || {};

    return (
      <Aggs
        aggs={this.state.searchAggs}
        crowdAggs={this.state.searchCrowdAggs}
        filters={this.transformFilters(aggFilters)}
        crowdFilters={this.transformFilters(crowdAggFilters)}
        addFilter={pipe(
          addFilter,
          this.handleUpdateParams,
        )}
        removeFilter={pipe(
          removeFilter,
          this.handleUpdateParams,
        )}
        // @ts-ignore
        searchParams={this.state.params}
        opened={opened}
        openedKind={openedKind}
        onOpen={this.handleOpenAgg}
      />
    );
  };

  renderSearch = (hash: string | null, view: SiteViewFragment) => {
    return (
      <ParamsQueryComponent query={PARAMS_QUERY} variables={{ hash }}>
        {({ data, loading, error }) => {
          if (error || loading) return null;
          const params: SearchParams = this.searchParamsFromQuery(
            view,
            data && data.searchParams,
          );
          // hydrate state params from hash
          if (!this.state.params) {
            this.setState({ params });
            return null;
          }

          return (
            <HashQueryComponent
              query={HASH_QUERY}
              variables={this.state.params || undefined}
            >
              {({ data, loading, error }) => {
                if (error || loading || !data) return null;
                // We have a mismatch between url and params in state
                if (data.searchHash !== hash) {
                  return <Redirect to={`/search/${data.searchHash}`} />;
                }

                return (
                  <SearchView
                    params={params}
                    openedAgg={this.state.openedAgg}
                    onUpdateParams={this.handleUpdateParams}
                    onRowClick={this.handleRowClick}
                    onOpenAgg={this.handleOpenAgg}
                    onAggsUpdate={this.handleAggsUpdate}
                    onResetFilters={this.handleResetFilters(view)}
                    previousSearchData={this.previousSearchData}
                    returnPreviousSearchData={this.returnPreviousSearchData}
                    searchHash={data.searchHash}
                    showCards={this.state.showCards}
                    toggledShowCards={this.toggledShowCards}
                  />
                );
              }}
            </HashQueryComponent>
          );
        }}
      </ParamsQueryComponent>
    );
  };

  handleScroll = () => {

    if (window.innerHeight + window.scrollY === document.body.scrollHeight) {

      // runScrollUp to avoid reprocessing
      document.body.scrollTo(0, (document.body.scrollHeight - 10));
      window.removeEventListener('scroll', this.handleScroll);

      const params:any = { ...this.state.params, page: (this.state.params!.page + 1) };
      this.setState({ params });

      setTimeout(
        () => {
          window.addEventListener('scroll', this.handleScroll);
        },
        1000,
      );

      return null;

    }

  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  bmStyles = {
    bmBurgerButton: {
      zIndex: '1030',
      position: 'fixed',
      width: '30px',  // 36 px
      height: '25px', // 30 px
      left: '20px',
      top: '14px',
    },
    bmBurgerBars: {
      background: '#55b88d',
    },
    bmBurgerBarsHover: {
      background: '#a90000',
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
    },
    bmCross: {
      background: '#bdc3c7',
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
    },
    bmMenu: {
      background: '#373a47',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em',
    },
    bmMorphShape: {
      fill: '#373a47',
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em',
    },
    bmItem: {
      display: 'inline-block',
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  };

  render() {
    if (this.props.ignoreUrlHash) {
      return (
        <Row>
          <SidebarContainer md={2}>{this.renderAggs()}</SidebarContainer>
          <MainContainer md={10}>
            <SiteProvider>
              {site => (
                <SearchView
                  params={this.state.params as any}
                  openedAgg={this.state.openedAgg}
                  onUpdateParams={this.handleUpdateParams}
                  onRowClick={this.handleRowClick}
                  onOpenAgg={this.handleOpenAgg}
                  onAggsUpdate={this.handleAggsUpdate}
                  onResetFilters={this.handleResetFilters(site.siteView)}
                  previousSearchData={this.previousSearchData}
                  returnPreviousSearchData={() => this.returnPreviousSearchData}
                  searchHash={''}
                  showCards={this.state.showCards}
                  toggledShowCards={this.toggledShowCards}
                />
              )}
            </SiteProvider>
          </MainContainer>
        </Row>
      );
    }

    const hash = path(['match', 'params', 'searchId'], this.props) as
      | string
      | null;

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}/study/:nctId`}
          component={SearchStudyPage}
        />
        <Route
          render={() => (
            <SiteProvider>
              {site => (
                <Row>
                  <SidebarContainer md={2}>
                    {this.renderAggs()}
                  </SidebarContainer>
                  <MainContainer md={10}>
                    {this.renderSearch(hash, site.siteView)}
                  </MainContainer>
                </Row>
              )}
            </SiteProvider>
          )}
        />
      </Switch>
    );
  }
}

export default SearchPage;
