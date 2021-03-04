import React, { useEffect, useState } from 'react';
import MailMergeView, {
  microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@apollo/client';
import { getStudyQuery, getSearchQuery } from 'components/MailMerge/MailMergeUtils';
import { BeatLoader } from 'react-spinners';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { find, propEq } from 'ramda';
//import {usePresentSite} from "../PresentSiteProvider/PresentSiteProvider";
import { useFragment } from 'components/MailMerge/MailMergeFragment';
import StudyViewLogMutaion from 'queries/StudyViewLogMutation';
import { fetchPageViews, fetchPageView, fetchStudyPage, fetchStudyPageHash, updateStudyViewLogCount } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchPresentSiteProvider } from 'services/site/actions';
import { DocumentNode } from 'graphql';

interface Props {
  url?: string;
  arg?: string;
}
type Mode = 'Study' | 'Search';

function getClassForMode(mode: Mode) {
  switch (mode) {
    case 'Study':
      return 'Study';
    case 'Search':
      return 'ElasticStudy';
  }
}


export default function GenericPage(props: Props) {
  const history = useHistory();
  const match = useRouteMatch();
  const defaultPage = () => {
    if (props.url) {
      return props.url
    }
    if (params.pv && pageViewsData) {
      const defaultPageView = find(propEq('url', params.pv))(pageViewsData?.data.site?.pageViews)
      if (defaultPageView) {
        return defaultPageView.url
      }
    }
    if (pageViewsData) {
      const defaultPageView = find(propEq('default', true))(pageViewsData?.data.site?.pageViews)
      return defaultPageView.url
    }
  }
  // When we add more page types we need to refactor this a little bit and pull out the query/nctid
  const dispatch = useDispatch();
  const params = useUrlParams();
  const site = useSelector((state: RootState) => state.site.presentSiteProvider.site)
  const studyData = useSelector((state: RootState) => state.study.studyPage);
  const loading = useSelector((state: RootState) => state.study.isFetchingStudyPage)
  const pageViewsData = useSelector((state: RootState) => state.study.pageViews);
  const pageViewData = useSelector((state: RootState) => state.study.pageView);
  const currentPage = pageViewData ? pageViewData?.data.site?.pageView : null;

//Currently making assumption anything diplayed in our search2 route is of pageType study 
//Ideally should be set from PageView but was having issues , response was not saving 
  const pageType = match.path = "/search2/" ? "Search" : "Study"
  const schemaType = getClassForMode(pageType);
  const [fragmentName, fragment] = useFragment(schemaType, currentPage?.template || '');

  useEffect(() => {
    dispatch(fetchPresentSiteProvider(undefined, params.sv));
  }, [dispatch, params.sv])

  useEffect(() => {
    dispatch(fetchPageViews(site?.id));
  }, [dispatch, site.id]);

  useEffect(() => {
    dispatch(fetchPageView(params.pv || defaultPage()));
  }, [dispatch, params.pv]);

  useEffect(() => {
    const STUDY_QUERY = `${getStudyQuery(fragmentName, fragment)}`
    const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`
    dispatch(pageType == "Study" ? fetchStudyPage(props.arg ?? "", STUDY_QUERY) : fetchStudyPageHash(params.hash ?? "", SEARCH_QUERY));
  }, [dispatch, currentPage, props.arg, params.hash]);

  const searchData = () => {
    let studies: any[] = []
    studyData.data?.search?.studies?.map((study, index) => {
      studies.push({ ...study, ALL: 'ALL' })
    })
    return {
      studies,
      recordsTotal: studyData.data?.search?.recordsTotal
    }
  }
  if (loading || !pageViewData || !studyData || !site) {
    return <BeatLoader />;
  }
  if (!studyData.data) {
    return <BeatLoader />
  }
  if (!props.arg && pageType == "Study") {
    return <h1>Missing NCTID in URL</h1>;
  }
  const title = microMailMerge(currentPage?.title, studyData?.data.study || searchData());
  // const context = pageType=="Study"? { ...studyData?.data.study, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' }
  // :{ hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL', studies:  searchData() }

  const islands = pageType == 'Study' ? studyIslands : searchIslands;
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <MailMergeView
        template={currentPage?.template || ''}
        context={studyData?.data.study || searchData()}
        islands={islands}
        pageType={pageType}
      />
    </div>
  );
}
