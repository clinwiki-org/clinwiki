import React, { useState, useEffect, useRef } from 'react';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import {
  SearchPageParamsQuery_searchParams,
} from 'types/SearchPageParamsQuery';
import { SearchParams, AggKind, SearchQuery } from './shared';
import { ThemedButton, ThemedSearchContainer, ThemedMainContainer } from '../../components/StyledComponents';
import Collapser from '../../components/Collapser'
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
import { defaultPageSize } from './Types';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import {
  PresentSiteFragment,
  PresentSiteFragment_siteView,
} from 'services/site/model/PresentSiteFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';
import { match } from 'react-router';
import SearchPageHashMutation from 'queries/SearchPageHashMutation';
import withTheme from 'containers/ThemeProvider';
import RichTextEditor, { EditorValue, getTextAlignClassName, getTextAlignStyles } from 'react-rte';
//import { withPresentSite2 } from "../PresentSiteProvider/PresentSiteProvider";
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import { BeatLoader } from 'react-spinners';
import { assertNullableType } from 'graphql';
import HtmlToReact from 'html-to-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPresentSiteProvider } from 'services/site/actions';
import { fetchSearchParams, updateSearchParamsAction } from 'services/search/actions'
import {RootState} from 'reducers';

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
  padding-left: 0px !important;
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
  width: 100%;
`;
const Instructions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 2em 0;
  .RichTextEditor__root___2QXK- {
    width: 100%;
    border: none;
  }
`;


interface SearchPageProps {
  match: match<{ siteviewUrl: string, id: string }>;
  history: any;
  location: any;
  searchParams?: SearchParams;
  userId?: string;
  profileParams?: any;
  mutate: any;
  email?: string;
  intervention?: boolean;
  getTotalContributions?: any;
  storeData: any;
  prevData: any;

}

const DEFAULT_PARAMS: SearchParams = {
  q: { children: [], key: 'AND' },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: defaultPageSize,
};
interface OpenedAgg{
  name: string | null;
  kind: AggKind | null;
}
function SearchPage(props: SearchPageProps) {
  const params = useRef({
    q: { key: 'AND', children: [] as SearchQuery[] },
    aggFilters: [] as AggFilterInput[],
    crowdAggFilters: [] as AggFilterInput[],
    sorts: [] as SortInput[],
    page: 0,
    pageSize: defaultPageSize

  })

  const [openedAgg, setOpenedAgg] = useState<OpenedAgg>({ name: null, kind: null })
  const [removeSelectAll, setRemoveSelectAll] = useState(false)
  // const [shouldRender, setShouldRender] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [collapseFacetBar, setCollapseFacetBar] = useState(false)
  const [collapsePresearch, setCollapsePresearch] = useState(false)
  const [collapseCrumbs, setCollapseCrumbs] = useState(false)

  
  
  const paramsUrl = useUrlParams();
  const dispatch = useDispatch();
  
  //Update SearchPageHashMutation 
  const isUpdatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  const isFetchingSearchParams = useSelector((state: RootState) => state.search.isFetchingSearchParams);
  const searchHash = useSelector((state : RootState ) => state.search.searchHash);
  const data = useSelector((state : RootState ) => state.search.searchResults);

  // const [updateSearchPageHashMutation] = useMutation(SearchPageHashMutation, {
    //   variables: params.current,
    //   onCompleted: (data)=> afterSearchParamsUpdate(data)
    // })


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
    let entries = 0 
    let result = ""
    if (searchParams!["q"]["children"][0]) {
      let search_term = searchParams["q"]["children"][0]["key"]
      result = result + `${search_term} | `
      entries = entries + 1 
    }
    if (searchParams!["crowd_agg_filters"]) {

      searchParams!["crowdAggFilters"].map((value) => {
        if(!value) return
        value!.values?.map((subValue) => {
          result = result + `${subValue} | `
          entries = entries + 1 
        })
      })
    }
    if (searchParams!["aggFilters"]) {
      searchParams!["aggFilters"].map((value) => {
        if(value.values==undefined) return
        value!.values?.map((subValue) => {
          result = result + `${subValue} | `
          entries = entries + 1 
        })
      })
    }
    document.title = result.substring(0, result.length -2)
  }

  const url =
  window.location.search;
  const urlName = new URLSearchParams(url)
  .getAll('sv')
  .toString();
  const urlFinal = urlName ? urlName : "default";

  useEffect(() => {
  dispatch(fetchPresentSiteProvider( undefined , urlFinal ));
  }, [])

  const site = useSelector((state : RootState ) => state.site.presentSiteProvider.site)
  const presentSiteView = site?.siteView;

  useEffect(() => {
    let searchTerm = new URLSearchParams(props.location?.search || '');

    let initialLoadParams = {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(presentSiteView),
    };

    if (window.innerWidth < 768) {
      setCollapseFacetBar(true)
    }
    if (searchTerm.has('q')) {
      const children = [] as SearchQuery[];
      let q = {
        key: 'AND',
        children: [{ children: children, key: searchTerm.getAll('q').toString() }],
      };

      let initialLoadParamsQ = {
        ...initialLoadParams,
        q
      }

      updateSearchParams(initialLoadParamsQ)
    }

    //// PROBABLY STILL NEEDS TO BE FIXED
    if (!searchTerm.has('hash')) {
      // setShouldRender(true)

      updateSearchParams(initialLoadParams)

    }
    //// PROBABLY STILL NEEDS TO BE FIXED
    if (props.intervention) {
      updateSearchParams(props.searchParams || initialLoadParams)
    }if(searchTerm.has('hash')){
      // setShouldRender(false)
      return
    }
    updateSearchParams(initialLoadParams)

    return
  }, [])

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
    updateSearchParams(params.current)

  };

  const isWorkflow = () => {
    return pipe(
      map(prop('field')),
      any(x => (x as string).toLowerCase().includes('wf_'))
    )(params?.current.crowdAggFilters || []);
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

  const handleOpenAgg = (name, kind) => {
    if (!openedAgg) {
      setOpenedAgg({ name: name, kind: kind });
      return;
    }
    const { name: currentName, kind: currentKind } = openedAgg;
    if (name === currentName && kind === currentKind) {
      setOpenedAgg({ name: null, kind: null });
      return;
    }
    setOpenedAgg({ name: name, kind: kind });
  };


  const renderAggs = (siteView, searchParams) => {
    const opened = openedAgg && openedAgg.name;
    const openedKind = openedAgg && openedAgg.kind;
    const { aggFilters = [], crowdAggFilters = [] } = searchParams || {};
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
        opened={opened}
        openedKind={openedKind}
        onOpen={handleOpenAgg}
        presentSiteView={siteView}
        searchParams={searchParams}
        updateSearchParams={updateSearchParams}
        site={site}
        getTotalResults={setTotalRecords}
      />
    );
  };

  const renderSearch = (searchParams) => {
    const hash = getHashFromLocation();
    return  presentSiteView.search.config.fields.showResults ? (
      <MemoizedSearchView
        key={`${hash}+${JSON.stringify(params.current)}`}
        onBulkUpdate={handleBulkUpdateClick}
        onUpdateParams={updateSearchParams}
        onRowClick={handleRowClick}
        searchHash={hash || ''}
        searchParams={params.current}
        presentSiteView={presentSiteView}
      />
    ) : null;
  };

  const getHashFromLocation = (): string | null => {
    let hash = new URLSearchParams(props.history.location.search).getAll(
      'hash'
    );
    return hash.toString();
  }


  const findFilter = (variable: string) => {
    let aggFilter = params?.current.aggFilters;
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

    const providedPageView = site.pageView?.url;
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
    const { aggFilters = [], crowdAggFilters = [] } = searchParams || {};
    const preSearchAggs = presentSiteView.search.presearch.aggs.selected.values;
    const preSearchCrowdAggs =
      presentSiteView.search.presearch.crowdAggs.selected.values;
    const presearchButton = presentSiteView.search.presearch.button;
    const presearchText = presentSiteView.search.presearch.instructions;
    const opened = openedAgg && openedAgg.name;
    const openedKind = openedAgg && openedAgg.kind;
    const { pageViewUrl } = getPageView();
    const presearchButtonOptions = {
      hash, presearchButton, pageViewUrl
    }
    //console.log("PRESEARCH INST TEXT", presearchText)
    const parser = new HtmlToReact.Parser();
    const instructionsDiv = parser.parse(presearchText);

    return (
      <ThemedSearchContainer>
        {/* <div className="collapse-container"><div>{collapsePresearch ? "Presearch" : ""}</div><div className="collapser" onClick={() => setCollapsePresearch(!collapsePresearch)}>{collapsePresearch ? <FontAwesome name={"chevron-up"} /> : <FontAwesome name={"chevron-down"} />}</div></div> */}
        <Collapser title="Presearch" collapse={()=> setCollapsePresearch(!collapsePresearch)} state={collapsePresearch}/>
        {!collapsePresearch ? 
        <div>
        <InstructionsContainer>
          {presearchText && (
            <Instructions>
             <div  style={{
                    width: "100%"
                  }} >
               {instructionsDiv}
             </div>
            </Instructions>
          )}
        </InstructionsContainer>
        {/* {presearchButton.name && (
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
        )} */}
        <Aggs
          filters={transformFilters(aggFilters)}
          crowdFilters={transformFilters(crowdAggFilters)}
          addFilter={newAddFilter}
          addFilters={newAddFilters}
          removeFilter={newRemoveFilter}
          removeFilters={newRemoveFilters}
          removeSelectAll={removeSelectAll}
          resetSelectAll={resetSelectAll}
          searchParams={searchParams}
          presearch
          preSearchAggs={preSearchAggs}
          preSearchCrowdAggs={preSearchCrowdAggs}
          presentSiteView={presentSiteView}
          updateSearchParams={updateSearchParams}
          site={site}
          opened={opened}
          openedKind={openedKind}
          onOpen={handleOpenAgg}
          getTotalResults={setTotalRecords}
          handlePresearchButtonClick={handlePresearchButtonClick}
          presearchButtonOptions={presearchButtonOptions}
        />
  
        </div> : null}
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


    const hash = getHashFromLocation();
    return (
      <ThemedSearchContainer>
       <Collapser title="Filter Bar" collapse={()=> setCollapseCrumbs(!collapseCrumbs)} state={collapseCrumbs}/>
        {!collapseCrumbs ? 
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
      /> : null}
      </ThemedSearchContainer>
    );
  };


 

  const updateSearchParams = (searchParams: SearchParams) => {
    params.current =   { ...params.current, ...searchParams }  
    dispatch( updateSearchParamsAction(params.current));

  };

  // TO DO -- this logic needs to br handled in the sagas. Currently only handling search
  const afterSearchParamsUpdate = () => {

    // handles the query to get the hash and update the url. 
    createPageName()
    const variables = params.current;
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
          `/intervention/${props.match.params.id}?hash=${data!.provisionSearchHash!.searchHash!.short
          }&sv=intervention&pv=${pageViewUrl}`
        );
        return;
      }
      //Done in the updateSearchParams saga
      // else {
      //   props.history.push(
      //     `/search?hash=${data!.provisionSearchHash!.searchHash!.short
      //     }&sv=${siteViewUrl}&pv=${pageViewUrl}`
      //   );
      //   return;
      // }
    }
  }
  const newAddSearchTerm = (term: string) => {
    if (!term.replace(/\s/g, '').length) {
      return
    }
    // recycled code for removing repeated terms. might be a better way but I'm not sure.
    const children: SearchQuery[]  = reject(propEq('key', term), params.current.q.children || []);
    params.current = {
      ...params.current,
      q: { ...params.current.q, children: [...(children || []), { key: term }] as SearchQuery[] }
    }
    updateSearchParams(params.current)
  }

  const newRemoveSearchTerm = (term: string) => {
    let currentParams:SearchParams = params.current;
    const children = reject(
      propEq('key', term),
      params.current.q.children || []
    ) as SearchQuery[];
    currentParams = {
      ...params.current,
      q: { ...params.current.q, children }
    }
    updateSearchParams(currentParams)

  };

  const newChangeFilter = (add: boolean) => (
    aggName: string,
    key: string,
    isCrowd?: boolean
  ) => (params: SearchParams) => {
    const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
    const lens = lensPath([propName]);
    return (over(
      lens,
      (aggs: AggFilterInput[]) => {
        const index = findIndex(propEq('field', aggName), aggs);
        if (index === -1 && add) {
          return [...aggs, { field: aggName, values: [key] }];
        }
        const aggLens = lensPath([index, 'values']);
        const updater = (values: string[]) => (
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
  const newAddFilter = newChangeFilter(true);
  const newRemoveFilter = newChangeFilter(false);

  const newAddFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {

    keys.forEach(k => {
      params.current = newAddFilter(aggName, k, isCrowd)(params.current);
    });
    newChangeFilter(true);
    updateSearchParams(params.current)
    return params.current;
  };

  const newRemoveFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
    keys.forEach(k => {
      params.current = newRemoveFilter(aggName, k, isCrowd)(params.current);
    });
    newChangeFilter(false);
    updateSearchParams(params.current)

    // changeFilter(true);
    return params;
  };
  /// this is everyting that used to be in componentDidMount


  if (props.email && !props.match.params.id) {
    props.getTotalContributions(totalRecords);
  }
  const hash = getHashFromLocation();

/// SEARCH PAGE PARAMS QUERY
useEffect(()=>{
 dispatch(fetchSearchParams(hash));
},[dispatch]);

if(data == undefined) return <BeatLoader/>
// searchParamsQueryHelper(data);
const dataParams = searchParamsFromQuery(
  data.data!.searchParams,
  presentSiteView
);
params.current= dataParams;
// updateSearchParamsAction(params.current)
  return (
    <Switch>
      <Route
        render={() => {
          const {
            showPresearch,
            showFacetBar,
            showBreadCrumbs,
          } = presentSiteView.search.config.fields;
        return(  
            <ThemedSearchPageWrapper>
              {showFacetBar && (
                <>
                  <ThemedSidebarContainer md={2} className={collapseFacetBar ? "side-bar-conatiner" : null}>
                    {params.current && renderAggs(presentSiteView, params.current)}
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
                {showBreadCrumbs && renderCrumbs(presentSiteView, params.current)}
                {showPresearch && params.current ? renderPresearch(hash, params.current) : null}
                {renderSearch (params.current)}
              </ThemedMainContainer>
            </ThemedSearchPageWrapper>
          )
        }
      }
      />
    </Switch>
  )
}

export default (SearchPage);
