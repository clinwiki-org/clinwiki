import React, { useEffect, useState } from 'react';
import MailMergeView, {
  microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getStudyQuery } from 'components/MailMerge/MailMergeUtils';
import { BeatLoader } from 'react-spinners';
import { studyIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { find, propEq } from 'ramda';
//import {usePresentSite} from "../PresentSiteProvider/PresentSiteProvider";
import { useFragment } from 'components/MailMerge/MailMergeFragment';
import StudyViewLogMutaion from 'queries/StudyViewLogMutation';
import { fetchPageViews, fetchPageView, fetchStudyPage, updateStudyViewLogCount } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import {RootState} from 'reducers';
import { fetchPresentSiteProvider } from 'services/site/actions';


interface Props {
  url?: string;
  arg?: string;
}
export default function GenericPage(props: Props) {
  const history = useHistory();
  const match = useRouteMatch();
  const defaultPage =()=>{
    if(props.url){
      return props.url
    }
    if(params.pv && pageViewsData){
      const defaultPageView= find(propEq('url', params.pv))(pageViewsData?.data.site?.pageViews)
      if (defaultPageView){
        return defaultPageView.url
      }
    }
    if(pageViewsData){
     const defaultPageView= find(propEq('default', true))(pageViewsData?.data.site?.pageViews)
      return defaultPageView.url
    }
  }
  // When we add more page types we need to refactor this a little bit and pull out the query/nctid
  const params = useUrlParams();
  
  const dispatch = useDispatch();
  const site = useSelector((state : RootState ) => state.site.presentSiteProvider.site)
  const studyData = useSelector((state:RootState) => state.study.studyPage);
  const loading = useSelector((state:RootState) => state.study.isFetchingStudyPage)
  const pageViewsData = useSelector((state:RootState) => state.study.pageViews);
  const pageViewData = useSelector((state:RootState) => state.study.pageView);
  const currentPage = pageViewData ?  pageViewData?.data.site?.pageView: null;
  
  const [ fragmentName, fragment ] = useFragment('Study', currentPage?.template || '');
  
  useEffect(() => {
  dispatch(fetchPresentSiteProvider( undefined , params.sv));
  }, [dispatch, params.sv])

  useEffect(()=>{
    dispatch(fetchPageViews(site?.id));
   },[dispatch, site.id]);

  useEffect(()=>{
    dispatch(fetchPageView( params.pv || defaultPage() ));
   },[dispatch, params.pv]);

  useEffect(()=>{
    const QUERY = `${getStudyQuery(fragmentName, fragment)}`
    dispatch(fetchStudyPage(props.arg ?? "", QUERY));
   },[dispatch, currentPage, props.arg]);
   
  console.log(props.arg)
  if (!props.arg) {
    return <h1>Missing NCTID in URL</h1>;
  }
  if (loading || !pageViewData || !studyData || !site) {
    return <BeatLoader />;
  }
  if (!studyData.data) {
    return <BeatLoader />
  }
console.log(studyData.data)
  const title = microMailMerge(currentPage?.title, studyData?.data.study);
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <MailMergeView
        template={currentPage?.template || ''}
        context={studyData?.data.study}
        islands={studyIslands}
      />
    </div>
  );
}
