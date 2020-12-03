import React, { useState } from 'react';
import { usePageView, usePageViews } from 'queries/PageViewQueries';
import MailMergeView, {
  microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-apollo';
import { getStudyQuery } from 'components/MailMerge/MailMergeUtils';
import { BeatLoader } from 'react-spinners';
import { studyIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { find, propEq } from 'ramda';
import {usePresentSite} from "../PresentSiteProvider/PresentSiteProvider";
import { useFragment } from 'components/MailMerge/MailMergeFragment';


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
      const defaultPageView= find(propEq('url', params.pv))(pageViewsData?.site?.pageViews)
      if (defaultPageView){
        return defaultPageView.url
      }
    }
    if(pageViewsData){
     const defaultPageView= find(propEq('default', true))(pageViewsData?.site?.pageViews)
      return defaultPageView.url
    }
  }
  // When we add more page types we need to refactor this a little bit and pull out the query/nctid
  const params = useUrlParams();
  const { site } = usePresentSite({ url: params.sv});
  const { data: pageViewsData } = usePageViews(site?.id);
  const { data: pageViewData } = usePageView(defaultPage());
  const currentPage = pageViewData?.site?.pageView;
  const [ fragmentName, fragment ] = useFragment('Study', currentPage?.template || '');
  const { data: studyData, loading } = useQuery(
    getStudyQuery(fragmentName, fragment),
    {
      skip: fragment == '' || !props.arg,
      variables: { nctId: props.arg ?? '' },
    }
  );

  if (!props.arg) {
    return <h1>Missing NCTID in URL</h1>;
  }
  if (loading || !pageViewData) {
    return <BeatLoader />;
  }

  const title = microMailMerge(currentPage?.title, studyData?.study);
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <MailMergeView
        template={currentPage?.template || ''}
        context={studyData?.study}
        islands={studyIslands}
      />
    </div>
  );
}
