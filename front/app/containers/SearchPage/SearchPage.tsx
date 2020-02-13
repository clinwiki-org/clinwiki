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
import BulkEditPage from 'containers/BulkEditPage';
import { Query, ApolloConsumer } from 'react-apollo';
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
import { AggFilterInput, SortInput } from 'types/globalTypes';
import Aggs from './components/Aggs';
import {
  SearchPageSearchQuery_search_aggs,
  SearchPageSearchQuery_search_aggs_buckets,
  SearchPageSearchQuery_crowdAggs_aggs,
  SearchPageSearchQuery_search_studies
} from "types/SearchPageSearchQuery";
import { AggBucketMap } from "./Types";
import SiteProvider from "containers/SiteProvider";
import { SiteViewFragment } from "types/SiteViewFragment";
import { preselectedFilters } from "utils/siteViewHelpers";
import { stack as Menu } from "react-burger-menu";
import { match } from "react-router";

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

export const PARAMS_QUERY = gql`
  query SearchSearchPageParamsQuery($hash: String) {
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
      (params = addFilter(aggName, k, isCrowd)(params) as SearchParams),
        console.log(k);
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
  removeSelectAll:boolean;
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
    showCards: localStorage.getItem('showCards') === 'true' ? true : false,
    removeSelectAll:false
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

  toggledShowCards = (showCards: Boolean) => {
    localStorage.setItem('showCards', showCards.toString());
    const params: any = { ...this.state.params, page: 0 };
    this.previousSearchData = [];
    this.setState({ showCards, params });
  };

  previousSearchData: Array<SearchPageSearchQuery_search_studies> = [];
  returnPreviousSearchData = (
    previousSearchData: Array<SearchPageSearchQuery_search_studies>
  ) => {
    this.previousSearchData = previousSearchData;
  };

  getDefaultParams = (view: SiteViewFragment) => {
    return { ...DEFAULT_PARAMS, ...preselectedFilters(view) };
  };

  searchParamsFromQuery = (
    view: SiteViewFragment,
    params: SearchPageParamsQuery_searchParams | null | undefined
  ): SearchParams => {
    const defaultParams = this.getDefaultParams(view);
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
      pageSize: params.pageSize || 25,
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

  handleResetFilters = (view: SiteViewFragment) => () => {
    this.setState({ 
      params: this.getDefaultParams(view),
      removeSelectAll: true,
    });
  };
  
  handleClearFilters=()=>{
    this.setState({
      params: DEFAULT_PARAMS, 
      removeSelectAll: true
    })
  }

  resetSelectAll = () => {
    this.setState({
      removeSelectAll: false
    })
  }

  handleUpdateParams = (updater: (params: SearchParams) => SearchParams) => {
    const params = updater(this.state.params!);
    this.previousSearchData = [];
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
      any(x => (x as string).toLowerCase().includes('wf_'))
    )(this.state);
  };

  handleRowClick = (nctId: string) => {
    const suffix =
      this.isWorkflow() && !this.props.ignoreUrlHash ? '/workflow' : '';
    const prefix = this.props.ignoreUrlHash ? '' : this.props.match.url;
    this.props.history.push(`${prefix}/study/${nctId}${suffix}`);
  };

  handleBulkUpdateClick = () => {
    this.props.history.push(`${this.props.match.url}/bulk`);
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
    searchCrowdAggs: AggBucketMap
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
        addFilter={pipe(addFilter, this.handleUpdateParams)}
        addFilters={pipe(addFilters, this.handleUpdateParams)}
        removeFilter={pipe(removeFilter, this.handleUpdateParams)}
        removeFilters={pipe(removeFilters, this.handleUpdateParams)}
        updateParams={this.handleUpdateParams}
        removeSelectAll={this.state.removeSelectAll}
        resetSelectAll={this.resetSelectAll}
        // @ts-ignore
        searchParams={this.state.params}
        opened={opened}
        openedKind={openedKind}
        onOpen={this.handleOpenAgg}
      />
    );
  };

  renderSearch = (
    hash: string | null,
    view: SiteViewFragment,
    siteViews: SiteViewFragment[]
  ) => {
    return (
      <ParamsQueryComponent
        query={PARAMS_QUERY}
        variables={{ hash }}
        onCompleted={(data: any) => {
          if (!this.state.params) {
            const params: SearchParams = this.searchParamsFromQuery(
              view,
              data && data.searchParams
            );
            this.setState({
              params: {
                ...params,
                page: 0,
                pageSize: 25,
              },
            });
            return null;
          }
        }}>
        {({ data, loading, error }) => {
          if (error || loading) return null;

          const params: SearchParams = this.searchParamsFromQuery(
            view,
            data && data.searchParams
          );
          // hydrate state params from hash
          if (!this.state.params) {
            // this.setState({ params });
            return null;
          }

          // current site view url should match w/one of the site views url
          const checkUrls = filter(
            siteViews => siteViews.url === this.props.match.params.siteviewUrl,
            siteViews
          );

          const siteViewUrl =
            checkUrls.length === 1 // not sure if I should be checking for duplicates
              ? this.props.match.params.siteviewUrl
              : "default";

          return (
            <HashQueryComponent
              query={HASH_QUERY}
              variables={this.state.params || undefined}
            >
              {({ data, loading, error }) => {
                if (error || loading || !data) return null;

                // We have a mismatch between url and params in state
                if (data.searchHash !== hash) {
                  return (
                    <Redirect
                      to={`/search/${siteViewUrl}/${data.searchHash}`}
                    />
                  );
                }

                return (
                  <SearchView
                      params={params}
                      onBulkUpdate={this.handleBulkUpdateClick}
                      openedAgg={this.state.openedAgg}
                      onUpdateParams={this.handleUpdateParams}
                      onRowClick={this.handleRowClick}
                      onOpenAgg={this.handleOpenAgg}
                      onAggsUpdate={this.handleAggsUpdate}
                      onResetFilters={this.handleResetFilters(view)}
                      onClearFilters={this.handleClearFilters}
                      previousSearchData={this.previousSearchData}
                      returnPreviousSearchData={this.returnPreviousSearchData}
                      searchHash={data.searchHash}
                      showCards={this.state.showCards}
                      toggledShowCards={this.toggledShowCards}
                      returnNumberOfPages={this.returnNumberOfPages}
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
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
      this.state.params!.page < this.numberOfPages - 1 &&
      this.state.showCards
    ) {
      window.removeEventListener('scroll', this.handleScroll);

      const params: any = {
        ...this.state.params,
        page: this.state.params!.page + 1,
      };
      this.setState({ params });

      setTimeout(() => {
        window.addEventListener('scroll', this.handleScroll);
      }, 1000);

      return null;
    }
  };

  componentDidMount() {
    if (this.state.showCards) {
      window.addEventListener("scroll", this.handleScroll);
    } else {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate() {
    if (this.state.showCards) {
      window.addEventListener("scroll", this.handleScroll);
    } else {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  render() {
    if (this.props.ignoreUrlHash) {
      return (
        <Row>
          <SidebarContainer md={2}>{this.renderAggs()}</SidebarContainer>
          <SiteProvider>
            {site => (
              <MainContainer md={10}>
                <SearchView
                  params={this.state.params as any}
                  onBulkUpdate={this.handleBulkUpdateClick}
                  openedAgg={this.state.openedAgg}
                  onUpdateParams={this.handleUpdateParams}
                  onRowClick={this.handleRowClick}
                  onOpenAgg={this.handleOpenAgg}
                  onAggsUpdate={this.handleAggsUpdate}
                  onResetFilters={this.handleResetFilters(site.siteView)}
                  onClearFilters={this.handleClearFilters}
                  previousSearchData={this.previousSearchData}
                  returnPreviousSearchData={() => this.returnPreviousSearchData}
                  searchHash={''}
                  showCards={this.state.showCards}
                  toggledShowCards={this.toggledShowCards}
                  returnNumberOfPages={this.returnNumberOfPages}
                />
              </MainContainer>
            )}
          </SiteProvider>
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
          path={`${this.props.match.path}/bulk/`}
          component={BulkEditPage}
        />
        <Route
          render={() => (
            <SiteProvider>
              {site => (
                <Row>
                  <SidebarContainer md={2}>
                    {this.renderAggs()}
                  </SidebarContainer>
                  <div id="main_search" style={{ overflowY: 'auto' }}>
                    <MainContainer style={{ width: '100%' }}>
                      {this.renderSearch(hash, site.siteView)}
                    </MainContainer>
                  </div>
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
