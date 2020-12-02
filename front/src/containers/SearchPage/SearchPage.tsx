import React, { useState, useEffect, useRef } from 'react';
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
import { Query, QueryComponentOptions } from '@apollo/client/react/components';
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
import { useQuery, useMutation } from '@apollo/client';
import MemoizedSearchView from './SearchView2';
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
import { BeatLoader } from 'react-spinners';
import { debug } from 'console';

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
  console.log("CHANGE  Filter", aggName)
  const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
  const lens = lensPath([propName]);
  return (over(
    lens,
    //@ts-ignore
    (aggs: AggFilterInput[]) => {
      console.log("AGGGGS", aggs)
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
      //@ts-ignore
      ...params.current,
      page: 0,
    }
  ) as unknown) as SearchParams;
};




const paramsUrl = useUrlParams()

interface SearchPageProps {
  match: match<{ siteviewUrl: string, id: string }>;
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
  storeData: any;
  prevData: any;

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
  q: { children: [], key: 'AND' },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: defaultPageSize,
};

function SearchPage(props: SearchPageProps) {
  const params = useRef({
    q: { key: 'AND', children: [] },
    aggFilters: [],
    crowdAggFilters: [],
    sorts: [],
    page: 0,
    pageSize: defaultPageSize

  })

  console.log('params first', params.current)
  const [openedAgg, setOpenedAgg] = useState({ name: null, kind: null })
  const [removeSelectAll, setRemoveSelectAll] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [collapseFacetBar, setCollapseFacetBar] = useState(false)
  const [updateSearchPageHashMutation] = useMutation(SearchPageHashMutation, {
    variables: params.current

  })



  const getDefaultParams = (view: SiteViewFragment, email: string | undefined) => {
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

  const createPageName = () => {
    let searchParams = params.current;
    console.log('CREATE PAGE NAME', searchParams)
    let entries = 0 
    let result = ""
    if (searchParams!["q"]["children"][0]) {
      let search_term = searchParams["q"]["children"][0]["key"]
      result = result + `${search_term} | `
      entries = entries + 1 
    }
    if (searchParams!["crowd_agg_filters"]) {

      searchParams!["crowdAggFilters"].map((value) => {
        //@ts-ignore
        value!.values.map((subValue) => {
          result = result + `${subValue} | `
          entries = entries + 1 
        })
      })
    }
    if (searchParams!["aggFilters"]) {
      searchParams!["aggFilters"].map((value) => {
        //@ts-ignore
        value!.values.map((subValue) => {
          result = result + `${subValue} | `
          entries = entries + 1 
        })
      })
    }
    document.title = result.substring(0, result.length -2)
  }

  const searchParamsFromQuery = (
    params: SearchPageParamsQuery_searchParams | null | undefined,
    view: SiteViewFragment
  ): SearchParams => {
    const defaultParams = getDefaultParams(view, props.email);
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

  const transformFilters = (
    filters: AggFilterInput[]
  ): { [key: string]: Set<string> } => {
    return pipe(
      groupBy<AggFilterInput>(prop('field')),
      map(head),
      map(propOr([], 'values')),
      map(arr => new Set(arr))
    )(filters) as { [key: string]: Set<string> };
  };

  const handleResetFilters = (view: SiteViewFragment) => () => {
    updateSearchParams(getDefaultParams(view, props.email));
  };

  const handleClearFilters = () => {
    updateSearchParams(DEFAULT_PARAMS);
  };

  const resetSelectAll = () => {
    setRemoveSelectAll(false)
    // WE MAY NEED TO USE  use effect here as the update searchParams used to be in a setState callback. 
    updateSearchParams(params)

  };

  const isWorkflow = () => {
    return pipe(
      //@ts-ignore
      map(prop('field')),
      //@ts-ignore
      any(x => (x as string).toLowerCase().includes('wf_'))
      //@ts-ignore
    )(params?.crowdAggFilters || []);
  };

  const handleRowClick = (nctId: string) => {
    /// paramsURL used to be useUrlParams switching to paramsUrl to try and get around some hook conversion curveballs.
    let querystringParams = paramsUrl
    const suffix =
      isWorkflow() ? '/workflow' : '';
    props.history.push(
      `/study/${nctId}${suffix}${queryStringAll(querystringParams)}`
    );
  };

  const handleBulkUpdateClick = (hash: string, siteViewUrl: string) => {
    props.history.push(`/bulk?hash=${hash}&sv=${siteViewUrl}`);
  };

  const handleOpenAgg = (name: string, kind: AggKind) => {
    if (!openedAgg) {
      //@ts-ignore
      setOpenedAgg({ name: name, kind: kind });
      return;
    }
    const { name: currentName, kind: currentKind } = openedAgg;
    if (name === currentName && kind === currentKind) {
      setOpenedAgg({ name: null, kind: null });
      return;
    }
    //@ts-ignore 
    setOpenedAgg({ name: name, kind: kind });
  };


  const renderAggs = (siteView, searchParams) => {
    // console.log('redner aggs', params)
    const opened = openedAgg && openedAgg.name;
    const openedKind = openedAgg && openedAgg.kind;
    const { aggFilters = [], crowdAggFilters = [] } = searchParams || {};
    console.log('PROPS SITE', props.site)
    return (
      <Aggs
        filters={transformFilters(aggFilters)}
        crowdFilters={transformFilters(crowdAggFilters)}
        addFilter={newAddFilter}
        addFilters={newAddFilters}
        removeFilter={newRemoveFilter}
        removeFilters={newRemoveFilters}
        removeSelectAll={removeSelectAll}
        resetSelectAll={resetSelectAll}
        // @ts-ignore
        opened={opened}
        openedKind={openedKind}
        onOpen={handleOpenAgg}
        presentSiteView={siteView}
        searchParams={searchParams}
        updateSearchParams={updateSearchParams}
        site={props.site}
        getTotalResults={setTotalRecords}
      />
    );
  };

  const renderSearch = (searchParams) => {
    const hash = getHashFromLocation();
    const { presentSiteView } = props;
    console.log('SEARCH VIEW FROM SP', searchParams)
    return (
      <MemoizedSearchView
        key={`${hash}+${JSON.stringify(searchParams)}`}
        onBulkUpdate={handleBulkUpdateClick}
        onUpdateParams={updateSearchParams}
        onRowClick={handleRowClick}
        searchHash={hash || ''}
        searchParams={searchParams}
        presentSiteView={presentSiteView}
      />

    );
  };

  const getHashFromLocation = (): string | null => {
    let hash = new URLSearchParams(props.history.location.search).getAll(
      'hash'
    );
    return hash.toString();
  }

  const updateStateFromHash = (searchParams, view) => {
    const newParams: SearchParams = searchParamsFromQuery(searchParams, view);
    let searchTerm = new URLSearchParams(props.location?.search || '');

    if (searchTerm.has('q')) {
      console.log('HYOUYOYO')
      const defaultParams = getDefaultParams(view, props.email);
      let q = {
        key: 'AND',
        children: [{ children: [], key: searchTerm.getAll('q').toString() }],
      };
      let queryParams = { ...defaultParams, q: q }
      updateSearchParams(queryParams);
    }
    updateSearchParams(newParams)

    // console.log('UPDATE STATE FROM HASH 1')
    //Originally thought this should be an updateSearchParams call but seems to error out
    //Commented out the application seems to still function as inteded. All the aggs update appropriately with no hash, with a hash. So far has passed all my current tests.

  }

  const findFilter = (variable: string) => {

    //@ts-ignore
    let aggFilter = params?.aggFilters;
    let response = find(propEq('field', variable), aggFilter || []) as {
      field: string;
      gte: string;
      lte: string;
      values: any[];
    } | null;
    return response;
  };


  const getPageView = () => {
    const searchQueryString = new URLSearchParams(
      props.history.location.search
    );

    const providedPageView = props.site.pageView?.url;
    const defaultPageView = providedPageView ? providedPageView : 'default';
    const pageViewUrl =
      searchQueryString.getAll('pv').toString() || defaultPageView;
    return {
      searchQueryString: searchQueryString,
      pageViewUrl: pageViewUrl,
    };
  };

  const handlePresearchButtonClick = (hash, target, pageViewUrl) => {
    const url = `/search?hash=${hash}&sv=${target}&pv=${pageViewUrl}`;
    props.history.push(url);
  };

  const renderPresearch = (hash, searchParams) => {
    //@ts-ignore
    const { aggFilters = [], crowdAggFilters = [] } = searchParams || {};
    const { presentSiteView } = props;
    const preSearchAggs = presentSiteView.search.presearch.aggs.selected.values;
    const preSearchCrowdAggs =
      presentSiteView.search.presearch.crowdAggs.selected.values;
    const presearchButton = presentSiteView.search.presearch.button;
    const presearchText = presentSiteView.search.presearch.instructions;
    const opened = openedAgg && openedAgg.name;
    const openedKind = openedAgg && openedAgg.kind;

    const { pageViewUrl } = getPageView();

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
              handlePresearchButtonClick(
                hash,
                presearchButton.target,
                pageViewUrl
              )
            }
            style={{ width: 200, marginLeft: 13, marginTop: 13 }}>
            {presearchButton.name}
          </ThemedButton>
        )}
        <Aggs
          filters={transformFilters(aggFilters)}
          crowdFilters={transformFilters(crowdAggFilters)}
          addFilter={newAddFilter}
          addFilters={newAddFilters}
          removeFilter={newRemoveFilter}
          removeFilters={newRemoveFilters}
          removeSelectAll={removeSelectAll}
          resetSelectAll={resetSelectAll}
          // @ts-ignore
          searchParams={searchParams}
          presearch
          preSearchAggs={preSearchAggs}
          preSearchCrowdAggs={preSearchCrowdAggs}
          presentSiteView={presentSiteView}
          updateSearchParams={updateSearchParams}
          site={props.site}
          opened={opened}
          openedKind={openedKind}
          onOpen={handleOpenAgg}
          getTotalResults={setTotalRecords}
        />
        {presearchButton.name && (
          <ThemedButton
            onClick={() =>
              handlePresearchButtonClick(
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

  const renderCrumbs = (siteView: SiteViewFragment, searchParams) => {
    // const { totalRecords } = state;
    const q: string[] =
      searchParams?.q.key === '*'
        ? []
        : (searchParams?.q.children || []).map(prop('key'));

    const handledParams = {
      ...searchParams!,
      q,
    };

    console.log('crumbs params post q transform', handledParams)

    const { presentSiteView } = props;
    const hash = getHashFromLocation();
    return (
      <CrumbsBar
        searchParams={handledParams}
        onBulkUpdate={handleBulkUpdateClick}
        removeFilter={newRemoveFilter}
        addSearchTerm={newAddSearchTerm}
        removeSearchTerm={newRemoveSearchTerm}
        onReset={handleResetFilters(siteView)}
        onClear={handleClearFilters}
        addFilter={newAddFilter}
        presentSiteView={presentSiteView}
        totalResults={totalRecords}
        searchHash={hash || ''}
        updateSearchParams={updateSearchParams}
      />
    );
  };


  const afterSearchParamsUpdate = (data) => {
    // handles the query to get the hash and update the url. 
    createPageName()
    const variables = params.current;
    console.log('GETTING NEW HASH VARS', variables)
    const { searchQueryString, pageViewUrl } = getPageView();
    const siteViewUrl = searchQueryString.getAll('sv').toString() || 'default';
    // This assumes that the site provider is not passing a url into the page
    // view fragment portion of the query otherwise we would need to call the
    //  page view query without passing the url into it to retrieve the default url

    const userId = searchQueryString.getAll('uid').toString();

    if (data?.provisionSearchHash?.searchHash?.short) {
      if (props.match.path === '/profile') {
        props.history.push(
          `/profile?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=${siteViewUrl}&pv=${pageViewUrl}`
        );
        return;
      } else if (userId) {
        let profile = findFilter('wiki_page_edits.email');
        props.history.push(
          `/profile/user?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=${siteViewUrl}&pv=${pageViewUrl}&uid=${userId}&username=${profile && profile.values.toString()
          }`
        );
        return;
      } else if (props.match.path === '/intervention/:id') {
        props.history.push(
          //@ts-ignore
          `/intervention/${props.match.params.id}?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=intervention&pv=${pageViewUrl}`
        );
        return;
      } else {
        props.history.push(
          `/search?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=${siteViewUrl}&pv=${pageViewUrl}`
        );
        return;
      }
    }
  }

  const updateSearchParams = async (searchParams) => {
    console.log('1 updating searchParams passed', searchParams)
    console.log('2 updating - Params in state', params)
    // setParams({...params, ...searchParams})

    params.current = await { ...params.current, ...searchParams }
    console.log('3 params.current', params.current)

    //now that we are using ref not sure the useEffect was best placement for our updating. Instead called it at the end of this update. 
    const { data } = await updateSearchPageHashMutation();
    console.log("Data: ", data)

    await afterSearchParamsUpdate(data)
  };

  //Only run mutation query if params state changes
  // useEffect(() => {
  //   console.log('params in effect - there has been a change', params.current)
  //   afterSearchParamsUpdate()

  // }, [params.current])

  const newAddSearchTerm = (term: string) => {
    if (!term.replace(/\s/g, '').length) {
      return
    }
    // recycled code for removing repeated terms. might be a better way but I'm not sure.
    const children: any[] = reject(propEq('key', term), params.current.q.children || []);
    // setParams({
    //   ...params,
    //   //@ts-ignore
    //   q:  { ...params.q, children: [...(children || []), { key: term }] },
    // })

    params.current = {
      ...params.current,
      //@ts-ignore
      q: { ...params.current.q, children: [...(children || []), { key: term }] }
    }
    updateSearchParams(params.current)
    // return {
    //   ...params,
    //   q: { ...params.q, children: [...(children || []), { key: term }] },
    //   page: 0,
    // };
  }

  const newRemoveSearchTerm = (term: string) => {
    console.log('REMOVING CRUMBß', params.current)
    let currentParams = params.current;
    const children = reject(
      propEq('key', term),
      params.current.q.children || []
    ) as SearchQuery[];
    // return {
    //   ...params,
    //   q: { ...params.q, children },
    //   page: 0,
    // };
    currentParams = {
      ...params.current,
      //@ts-ignore
      q: { ...params.current.q, children }
    }
    updateSearchParams(currentParams)

  };

  const newChangeFilter = (add: boolean) => (
    aggName: string,
    key: string,
    isCrowd?: boolean
  ) => (params: SearchParams) => {
    console.log("CHANGE  Filter", aggName)
    const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
    const lens = lensPath([propName]);
    return (over(
      lens,
      //@ts-ignore
      (aggs: AggFilterInput[]) => {
        console.log("AGGGGS", aggs)
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
        //@ts-ignore
        ...params.current,
        page: 0,
      }
    ) as unknown) as SearchParams;
  };
  const newAddFilter = newChangeFilter(true);
  const newRemoveFilter = newChangeFilter(false);

  const newAddFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
    console.log('add filters')

    keys.forEach(k => {
      //@ts-ignore
      params.current = newAddFilter(aggName, k, isCrowd)(params);
    });
    newChangeFilter(true);
    console.log("AddFilters Params", params)
    updateSearchParams(params.current)
    return params;
  };

  const newRemoveFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
    keys.forEach(k => {
      //console.log("PARAMS  1",params)
      //@ts-ignore
      params.current = removeFilter(aggName, k, isCrowd)(params);
    });
    newChangeFilter(true);
    console.log("RemoveFilters Params", params)
    updateSearchParams(params.current)

    // changeFilter(true);
    return params;
  };
  /// this is everyting that used to be in componentDidMount
  useEffect(() => {
    let searchTerm = new URLSearchParams(props.location?.search || '');

    let initialLoadParams = {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(props.presentSiteView),
    };

    if (window.innerWidth < 768) {
      setCollapseFacetBar(true)
    }
    if (searchTerm.has('q')) {
      let q = {
        key: 'AND',
        children: [{ children: [], key: searchTerm.getAll('q').toString() }],
      };

      console.log('QQQQ', initialLoadParams)
      //@ts-ignore
      // setParams(
      //   {
      //     /// Q below is messed up and needs to get q from above. 
      //     //@ts-ignore
      //       q: {...q},
      //       aggFilters: [],
      //       crowdAggFilters: [],
      //       sorts: [],
      //       page: 0,
      //       pageSize: defaultPageSize,
      //     }
      // );
      let initialLoadParamsQ = {
        ...initialLoadParams,
        q
      }

      console.log('FILTERED PARAMS AFTER Q', initialLoadParamsQ)
      updateSearchParams(initialLoadParamsQ)
    }

    //// PROBABLY STILL NEEDS TO BE FIXED
    if (!searchTerm.has('hash')) {
      console.log("We don't have a hash, updating with intialLoad Params")
      updateSearchParams(initialLoadParams)

    }
    //// PROBABLY STILL NEEDS TO BE FIXED
    if (props.intervention) {
      //@ts-ignore
      setParams(props.searchParams);
    }

    return
  }, [])


  if (props.email && !props.match.params.id) {
    props.getTotalContributions(totalRecords);
  }
  const hash = getHashFromLocation();


  const { presentSiteView } = props;
  // const FILTERED_PARAMS = {
  //   ...DEFAULT_PARAMS,
  //   ...preselectedFilters(presentSiteView),
  // };

  /// SEARCH PAGE PARAMS QUERY
  const result = useQuery(SearchPageParamsQuery, {
    variables: { hash },
    onCompleted: () => updateStateFromHash(data.searchParams, presentSiteView)
  });

  let data = result.data
  if (data == undefined && result.previousData !== undefined) { data = result.previousData }
  if (result.error || (result.loading && data == undefined)) return <BeatLoader />;


  console.log('data from query component', result)
  // debugger

  const dataParams = searchParamsFromQuery(
    data!.searchParams,
    presentSiteView
  );
  return (
    <Switch>
      <Route
        render={() => {
          const { presentSiteView } = props;
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
                    {dataParams && renderAggs(presentSiteView, dataParams)}
                  </ThemedSidebarContainer>
                  <ThemedSideBarCollapse className={collapseFacetBar ? "collapsed" : "expanded"} >
                    <span className="collapse-icon-container">
                      <FontAwesome
                        name={collapseFacetBar ? "chevron-circle-right" : "chevron-circle-left"}
                        className="collapse-icon"
                        onClick={() => {
                          setCollapseFacetBar(!collapseFacetBar)
                        }}
                      />
                    </span>
                  </ThemedSideBarCollapse>
                </>
              )}

              <ThemedMainContainer>
                {showBreadCrumbs && renderCrumbs(presentSiteView, dataParams)}
                {showPresearch && dataParams ? renderPresearch(hash, dataParams) : null}
                {dataParams ? renderSearch(dataParams) : null}
              </ThemedMainContainer>
            </ThemedSearchPageWrapper>
          );
        }}
      />
    </Switch>
  )
}

// @ts-ignore too many decorators
export default withPresentSite2((SearchPage));
