import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import useUrlParams from 'utils/UrlParamsProvider';
import { find, propEq } from 'ramda';
import { fetchPageViews, fetchPageView, fetchPageViewsHasura, fetchPageViewHasura } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchPresentSiteProvider } from 'services/site/actions';
import GenericPageChild from './GenericPageChild';
import { fetchSearchParams } from 'services/search/actions';
interface Props {
  url?: string;
  arg?: string;
}


export default function GenericPageWrapper(props: Props) {
  const history = useHistory();
  const match = useRouteMatch();
  const defaultPage = () => {
    if (props.url) {
      return props.url
    }
    if (params.pv && pageViewsData) {
      const defaultPageView = find(propEq('url', params.pv))(pageViewsData?.data?.page_views)
      if (defaultPageView) {
        return defaultPageView.url
      }
    }
    if (pageViewsData) {
      const defaultPageView = find(propEq('default', true))(pageViewsData?.data?.page_views)
      return defaultPageView.url
    }
  }
  // When we add more page types we need to refactor this a little bit and pull out the query/nctid
  const dispatch = useDispatch();
  const params = useUrlParams();
  const site = useSelector((state: RootState) => state.site.hasuraPresentSiteProvider.sites[0]);
  const pageViewsData = useSelector((state: RootState) => state.study.pageViewsHasura);
  const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
  const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
  const data = useSelector((state: RootState) => state.search.searchResults);

  //Currently making assumption anything diplayed in our search route is of pageType study 
  //Ideally should be set from PageView but was having issues , response was not saving 
  const pageType = match.path == "/search/" ? "Search" : "Study"

  /*   useEffect(() => {
      dispatch(fetchHasuraPresentSiteProvider(undefined, params.sv));
    }, [dispatch, params.sv])
    console.log("SITE ID ON GenericPage Wrappp", site?.id)
   */


  const url =
    window.location.search;
  const urlName = new URLSearchParams(url)
    .getAll('sv')
    .toString();
  const urlFinal = urlName ? urlName : "default";

  useEffect(() => {
    dispatch(fetchPageViewsHasura(site?.id));
  }, [dispatch, site.id]);

  useEffect(() => {
    dispatch(fetchPageViewHasura(site?.id, params.pv || defaultPage() || urlFinal));
  }, [dispatch, params.pv]);
  useEffect(() => {
    dispatch(fetchSearchParams(params.hash));
  }, [dispatch, params.hash]);

  if (!params.hash && pageType == "Search") {
    history.push(`/search?hash=${site.default_hash}&pv=${site.default_search_page}`)
    //window.location.reload()
  }
  if (!currentPage) {
    return <BeatLoader />
  }
  if (!data) {
    return <BeatLoader />
  }
  if (!props.arg && pageType == "Study") {
    return <h1>Missing NCTID in URL</h1>;
  }
  if (!params.pv && pageType == "Search") {
    return <h1>Missing PageView in URL</h1>;
  }

  return (
    <GenericPageChild
      arg={props.arg} />
  );
}
