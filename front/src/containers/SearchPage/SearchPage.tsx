import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import {
  SearchPageParamsQuery as SearchPageParamsQueryType,
  SearchPageParamsQueryVariables,
  SearchPageParamsQuery_searchParams,
} from 'types/SearchPageParamsQuery';
import { MAX_WINDOW_SIZE } from 'utils/constants';
import { SearchParams, AggKind, SearchQuery } from './shared';
import { Query, graphql, QueryComponentOptions } from 'react-apollo';
import { ThemedButton, ThemedSearchContainer } from '../../components/StyledComponents';
import {
  map,
  dissoc,
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
  find,
} from 'ramda';
import SearchView2 from './SearchView2';
import CrumbsBar from './components/CrumbsBar';
import { AggFilterInput, SortInput } from 'types/globalTypes';
import Aggs from './components/Aggs';
import {
  SearchPageSearchQuery_search_studies,
} from 'types/SearchPageSearchQuery';
import { AggBucketMap, defaultPageSize } from './Types';
import { SiteViewFragment } from 'types/SiteViewFragment';
import {
  PresentSiteFragment,
  PresentSiteFragment_siteView,
} from 'types/PresentSiteFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';
import { match } from 'react-router';
import SearchPageHashMutation from 'queries/SearchPageHashMutation';
import SearchPageParamsQuery from 'queries/SearchPageParamsQuery';
import withTheme from 'containers/ThemeProvider';
import SearchParamsContext from './components/SearchParamsContext';
import RichTextEditor from 'react-rte';
import { withPresentSite2 } from "../PresentSiteProvider/PresentSiteProvider";
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';

const ParamsQueryComponent = (
  props: QueryComponentOptions<
    SearchPageParamsQueryType,
    SearchPageParamsQueryVariables
  >
) => Query(props);

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
  flex: 1;
  overflow:auto;
  @media (max-width: 768px) {
    flex-direction: column;
    min-width:100vw;
  }

  .rt-th {
    text-transform: capitalize;
    padding: 15px !important;
    background: ${(props) =>
    props.theme.searchResults.resultsHeaderBackground} !important;
    color: #fff;
  }

  .ReactTable .-pagination .-btn {
    background: ${(props) =>
    props.theme.searchResults.resultsPaginationButtons} !important;
  }

  div.rt-tbody div.rt-tr:hover {
    background: ${(props) =>
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

  .side-bar-conatiner{
    display: none;
  }
  .collapsed{
    margin-left: 0;
    border-left 15px solid ${(props) => props.theme.aggSideBar.sideBarBackground};
  }
  .expanded{
    margin-left: 235px;

  }
`;
const ThemedSearchPageWrapper = withTheme(SearchPageWrapper)
const ThemedMainContainer = withTheme(MainContainer);
const SideBarCollapse = styled.div`
  min-height: 100%;
  position: fixed;
  top: 0;
  min-width:7vh;
  z-index:1029;

  .collapse-icon-container{
    background: ${(props) => props.theme.aggSideBar.sideBarBackground};
    position: absolute;
    margin-top: 10vh;
    margin-left: -15px;
    min-width: 27;
    max-height: 24px;
    border-radius: 50%;
    box-shadow: 0px 0px 28px grey;
  }
  .collapse-icon{
    color: #eaedf4;
    margin-left: 3px;
    margin-top: -3px;
    font-size: 30px;
    &:hover {
      color: ${(props) => props.theme.button};
    }
  }
`
const ThemedSideBarCollapse = withTheme(SideBarCollapse)
const SidebarContainer = styled(Col)`
  padding-right: 0px !important;
  padding-top: 10px;
  box-sizing: border-box;
  width: 235px;
  min-width: 235px;
  min-height: 100%;
  background: ${props => props.theme.aggSideBar.sideBarBackground};
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
`;
const ThemedSidebarContainer = withTheme(SidebarContainer);



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
  console.log("REMOVe  Filter")

  console.log("AggName", aggName)
  console.log("key", key)
  console.log("isCrowd", isCrowd)
  console.log("params",params)

  const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
  const lens = lensPath([propName]);
  return (over(
    lens,
    //@ts-ignore
    (aggs: AggFilterInput[]) => {
     //console.log("AGGGGS", aggs)
      const index = findIndex(propEq('field', aggName), aggs);
      if (index === -1 && add) {
        //console.log("HIT IF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ")
        return [...aggs, { field: aggName, values: [key] }];
      }
      const aggLens = lensPath([index, 'values']);
      const updater = (values: string[]) => (
        //console.log("VALUES",values), Values coming from AGGS above
        add ? [...values, key] : reject(x => x === key, values))
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
  ) as unknown) as SearchParams;
};
const addFilter = changeFilter(true);
const removeFilter = changeFilter(false);
const addFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
  return (params: SearchParams) => {
    keys.forEach(k => {
      params = addFilter(aggName, k, isCrowd)(params);
    });
    // changeFilter(true);
    return params;
  };
};

const removeFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
  return (params: SearchParams) => {
    keys.forEach(k => {
      //console.log("PARAMS  1",params)
      params = removeFilter(aggName, k, isCrowd)(params);
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
  match: match<{ siteviewUrl: string, id : string }>;
  history: any;
  location: any;
  searchParams?: SearchParams;
  userId?: string;
  profileParams?: any;
  site: PresentSiteFragment;
  presentSiteView: PresentSiteFragment_siteView;
  mutate: any;
  email?: string;
  intervention?: boolean;
  getTotalContributions?: any;
}

interface SearchPageState {
  params: SearchParams | null;
  openedAgg: {
    name: string;
    kind: AggKind;
  } | null;
  removeSelectAll: boolean;
  totalRecords: number;
  collapseFacetBar: boolean;
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
    removeSelectAll: false,
    totalRecords: 0,
    collapseFacetBar:false
    };



  getDefaultParams = (view: SiteViewFragment, email: string | undefined) => {
    if (email) {
      const profileViewParams = preselectedFilters(view);
      profileViewParams.aggFilters.push({
        field: 'wiki_page_edits.email',
        values: [email],
      });

      return { ...DEFAULT_PARAMS, ...profileViewParams };
    }
    return {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(view),
    };
  };

  searchParamsFromQuery = (
    params: SearchPageParamsQuery_searchParams | null | undefined,
    view: SiteViewFragment
  ): SearchParams => {
    const defaultParams = this.getDefaultParams(view, this.props.email);
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
      //page and pageSize no longer exists since it was removed from the shortlink hash
      //defaulting to page 0 and defaultPageSize(100) to recieve the first 100 results for
      page: 0,
      pageSize: defaultPageSize,
    };
  };

  transformFilters = (
    filters: AggFilterInput[]
  ): { [key: string]: Set<string> } => {
    return pipe(
      groupBy<AggFilterInput>(prop('field')),
      map(head),
      map(propOr([], 'values')),
      map(arr => new Set(arr))
    )(filters) as { [key: string]: Set<string> };
  };

  handleResetFilters = (view: SiteViewFragment) => () => {
    this.updateSearchParams(this.getDefaultParams(view, this.props.email));
  };

  handleClearFilters = () => {
    this.updateSearchParams(DEFAULT_PARAMS);
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
    //console.log("Search Page handle update params", params)
    if (!equals(params.q, this.state.params && this.state.params.q)) {
      // For now search doesn't work well with args list
      // Therefore we close it to refresh later on open
      this.setState({ openedAgg: null });
    }
    this.setState({ params }, () => this.updateSearchParams(this.state.params));
  };

  isWorkflow = () => {
    return pipe(
      //@ts-ignore
      map(prop('field')),
      //@ts-ignore
      any(x => (x as string).toLowerCase().includes('wf_'))
      //@ts-ignore
    )(this.state.params?.crowdAggFilters || []);
  };

  handleRowClick = (nctId: string) => {
    let querystringParams = useUrlParams()
    const suffix =
      this.isWorkflow() ? '/workflow' : '';
    this.props.history.push(
      `/study/${nctId}${suffix}${queryStringAll(querystringParams)}`
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


  renderAggs = siteView => {
    const opened = this.state.openedAgg && this.state.openedAgg.name;
    const openedKind = this.state.openedAgg && this.state.openedAgg.kind;
    const { aggFilters = [], crowdAggFilters = [] } = this.state.params || {};
    return (
      <Aggs
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
        presentSiteView={siteView}
      />
    );
  };

  renderSearch = () => {
    const hash = this.getHashFromLocation();
    const { presentSiteView } = this.props;
    const FILTERED_PARAMS = {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(presentSiteView),
    };
    return (
      <ParamsQueryComponent
        fetchPolicy={"network-only"}
        key={`${hash}+${JSON.stringify(this.state?.params)}`}
        query={SearchPageParamsQuery}
        variables={{ hash }}
        onCompleted={async (data: any) => {
          this.updateStateFromHash(data.searchParams, presentSiteView);
        }}>
        {({ data, loading, error }) => {
          if (error || loading) return null;
          // if(!hash && !loading){

          //   this.updateSearchParams(DEFAULT_PARAMS)          
          //   //Breaks when passing FILTERED_PARAMS
          //   // this.updateSearchParams(FILTERED_PARAMS)          
          // }

          const params: SearchParams = this.searchParamsFromQuery(
            data!.searchParams,
            presentSiteView
          );
          // hydrate state params from hash
          if (!this.state.params) {
            this.setState({ params });
            return null;
          }
          return (
            <SearchView2
              key={`${hash}+${JSON.stringify(params)}`}
              params={params}
              onBulkUpdate={this.handleBulkUpdateClick}
              onUpdateParams={this.handleUpdateParams}
              onRowClick={this.handleRowClick}
              searchHash={hash || ''}
              searchParams={this.state.params}
              presentSiteView={presentSiteView}
              getTotalResults={this.getTotalResults}
            />
          );
        }}
      </ParamsQueryComponent>
    );
  };


  componentDidMount() {
    let searchTerm = new URLSearchParams(this.props.location?.search || '');
    const FILTERED_PARAMS = {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(this.props.presentSiteView),
    };
                                                                                
    if (window.innerWidth < 768) {
      this.setState({ collapseFacetBar: true })
    }
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
    if(!searchTerm.has('hash') ){
      this.updateSearchParams(FILTERED_PARAMS)

    }
    if (this.props.intervention) {
      //@ts-ignore
      this.setState({ params: this.props.searchParams });
    }

  }

  componentWillUnmount() {
  }


  getHashFromLocation(): string | null {
    let hash = new URLSearchParams(this.props.history.location.search).getAll(
      'hash'
    );
    return hash.toString();
  }

  updateStateFromHash(searchParams, view) {
    const params: SearchParams = this.searchParamsFromQuery(searchParams, view);
    let searchTerm = new URLSearchParams(this.props.location?.search || '');

    if (searchTerm.has('q')) {
      const defaultParams = this.getDefaultParams(view, this.props.email);
      let q = {
        key: 'AND',
        children: [{ children: [], key: searchTerm.getAll('q').toString() }],
      };
      let queryParams = { ...defaultParams, q: q }
      this.updateSearchParams(queryParams);
    }
    //Originally thought this should be an updateSearchParams call but seems to error out
    //Commented out the application seems to still function as inteded. All the aggs update appropriately with no hash, with a hash. So far has passed all my current tests.
    // Will leave it in and commented out for now as a reminder to come back and look into it.
     this.setState({
      params: {
        ...params,
       },
     });
  }

  findFilter = (variable: string) => {
    let aggFilter = this.state.params?.aggFilters;
    let response = find(propEq('field', variable), aggFilter || []) as {
      field: string;
      gte: string;
      lte: string;
      values: any[];
    } | null;
    return response;
  };
  updateSearchParams = async params => {
    this.setState({
      ...this.state,
      params: { ...(this.state?.params || {}), ...params },
    });
    const variables = { ...this.state.params, ...params };
    const { data } = await this.props.mutate({ variables });

    const { searchQueryString, pageViewUrl } = this.getPageView();
    const siteViewUrl = searchQueryString.getAll('sv').toString() || 'default';
    // This assumes that the site provider is not passing a url into the page
    // view fragment portion of the query otherwise we would need to call the
    //  page view query without passing the url into it to retrieve the default url

    const userId = searchQueryString.getAll('uid').toString();

    if (data?.provisionSearchHash?.searchHash?.short) {
      if (this.props.match.path === '/profile') {
        this.props.history.push(
          `/profile?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=${siteViewUrl}&pv=${pageViewUrl}`
        );
        return;
      } else if (userId) {
        let profile = this.findFilter('wiki_page_edits.email');
        this.props.history.push(
          `/profile/user?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=${siteViewUrl}&pv=${pageViewUrl}&uid=${userId}&username=${profile && profile.values.toString()
          }`
        );
        return;
      } else if (this.props.match.path === '/intervention/:id') {
        this.props.history.push(
          //@ts-ignore
          `/intervention/${this.props.match.params.id}?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=intervention&pv=${pageViewUrl}`
        );
        return;
      } else {
        this.props.history.push(
          `/search?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=${siteViewUrl}&pv=${pageViewUrl}`
        );
        return;
      }
    }
  };

  getPageView = () => {
    const searchQueryString = new URLSearchParams(
      this.props.history.location.search
    );

    const providedPageView = this.props.site.pageView?.url;
    const defaultPageView = providedPageView ? providedPageView : 'default';
    const pageViewUrl =
      searchQueryString.getAll('pv').toString() || defaultPageView;
    return {
      searchQueryString: searchQueryString,
      pageViewUrl: pageViewUrl,
    };
  };

  getTotalResults = total => {
    if (total) {
      this.setState({
        totalRecords: total,
      });
    }
    return null;
  };
  handlePresearchButtonClick = (hash, target, pageViewUrl) => {
    const url = `/search?hash=${hash}&sv=${target}&pv=${pageViewUrl}`;
    this.props.history.push(url);
  };

  renderPresearch = hash => {
    const { aggFilters = [], crowdAggFilters = [] } = this.state.params || {};
    const { presentSiteView } = this.props;
    const preSearchAggs = presentSiteView.search.presearch.aggs.selected.values;
    const preSearchCrowdAggs =
      presentSiteView.search.presearch.crowdAggs.selected.values;
    const presearchButton = presentSiteView.search.presearch.button;
    const presearchText = presentSiteView.search.presearch.instructions;

    const { pageViewUrl } = this.getPageView();

    return (
      <ThemedSearchContainer>
        <InstructionsContainer>
          {presearchText && (
            <Instructions>
              <RichTextEditor
                readOnly
                editorClassName="rich-text"
                value={RichTextEditor.createValueFromString(
                  presearchText,
                  'markdown'
                )}
              />
            </Instructions>
          )}
        </InstructionsContainer>
        {presearchButton.name && (
            <ThemedButton
                onClick={() =>
                    this.handlePresearchButtonClick(
                        hash,
                        presearchButton.target,
                        pageViewUrl
                    )
                }
                style={{ width: 200, marginLeft: 13, marginTop: 13}}>
              {presearchButton.name}
            </ThemedButton>
        )}
        <Aggs
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
          presentSiteView={presentSiteView}
        />
        {presearchButton.name && (
          <ThemedButton
            onClick={() =>
              this.handlePresearchButtonClick(
                hash,
                presearchButton.target,
                pageViewUrl
              )
            }
            style={{ width: 200, marginLeft: 13 }}>
            {presearchButton.name}
          </ThemedButton>
        )}
      </ThemedSearchContainer>
    );
  };
  renderCrumbs = (siteView: SiteViewFragment) => {
    const { totalRecords } = this.state;
    const q: string[] =
      this.state.params?.q.key === '*'
        ? []
        : (this.state.params?.q.children || []).map(prop('key'));

    const searchParams = {
      ...this.state.params!,
      q,
    };

    const { presentSiteView } = this.props;
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
        onReset={this.handleResetFilters(siteView)}
        onClear={this.handleClearFilters}
        addFilter={pipe(addFilter, this.handleUpdateParams)}
        presentSiteView={presentSiteView}
        totalResults={totalRecords}
        searchHash={hash || ''}
      />
    );
  };

  render() {
    const { totalRecords, collapseFacetBar } = this.state;
    if (this.props.email && !this.props.match.params.id) {
      this.props.getTotalContributions(totalRecords);
    }

    const hash = this.getHashFromLocation();
    return (
      <SearchParamsContext.Provider
        value={{
          searchParams: this.state.params,
          updateSearchParams: this.updateSearchParams,
        }}>
        <Switch>
          <Route
            render={() => {
              const { presentSiteView } = this.props;
              const {
                showPresearch,
                showFacetBar,
                showBreadCrumbs,
              } = presentSiteView.search.config.fields;
              return (
                <ThemedSearchPageWrapper>
                  {showFacetBar && (
                    <>
                    <ThemedSidebarContainer md={2} className={collapseFacetBar ? "side-bar-conatiner" : null}>
                      {this.renderAggs(presentSiteView)}
                    </ThemedSidebarContainer>
                  <ThemedSideBarCollapse className={collapseFacetBar ? "collapsed" : "expanded"} >
                    <span className="collapse-icon-container">
                      <FontAwesome
                        name={collapseFacetBar ? "chevron-circle-right" : "chevron-circle-left"}
                        className="collapse-icon"
                        onClick={() => {
                          this.setState({ collapseFacetBar: !collapseFacetBar })
                        }}
                      />
                    </span>
                  </ThemedSideBarCollapse>
                  </>
                  )}

                  <ThemedMainContainer>
                    {showBreadCrumbs && this.renderCrumbs(presentSiteView)}
                    {showPresearch && this.renderPresearch(hash)}
                    {this.renderSearch()}
                  </ThemedMainContainer>
                </ThemedSearchPageWrapper>
              );
            }}
          />
        </Switch>
      </SearchParamsContext.Provider>
    );
  }
}

// @ts-ignore too many decorators
export default withPresentSite2(graphql(SearchPageHashMutation)(SearchPage));
