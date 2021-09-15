import React, { useEffect } from 'react';
import {  useRouteMatch } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import useUrlParams from 'utils/UrlParamsProvider';
import { find, propEq } from 'ramda';
import { fetchPageViewsHasura, fetchPageViewHasura } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import MMTestComponent from './MMTestComponent';
import { fetchSearchParams } from 'services/search/actions';
interface Props {
  url?: string;
  arg?: string;
}


export default function GenericPageWrapper(props: Props) {
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

console.log(params)

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

  if (!currentPage) {
    return <BeatLoader />
  }
  if (!data) {
    return <BeatLoader />
  }


  return (
    <MMTestComponent/>
  );
}
