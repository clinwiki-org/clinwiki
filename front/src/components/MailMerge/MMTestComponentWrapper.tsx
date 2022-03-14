import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import useUrlParams from 'utils/UrlParamsProvider';
import { find, propEq } from 'ramda';
import { fetchPageViewsHasura, fetchPageViewHasura } from 'services/study/actions';
import { fetchMMSchemas } from 'services/genericPage/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import MMTestComponent from './MMTestComponent';
import { fetchSearchParams } from 'services/search/actions';
import Unauthorized from 'components/ProtectedRoute/Unauthorized';
import { isAdmin } from 'utils/auth';
import { parseSchemaIds, templateSplit } from 'components/MailMerge/MailMergeFragment';
interface Props {
  url?: string;
  arg?: string;
}


export default function MMTestComponentWrapper(props: Props) {
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
  const user = useSelector((state: RootState) => state.user.current);
  const MMSchemas= useSelector((state: RootState) => state.genericPage.MMSchemas);
  const templates = currentPage && currentPage.template && templateSplit(currentPage.template)

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
    dispatch(fetchMMSchemas());
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(fetchPageViewHasura(site?.id, params.pv || defaultPage() || urlFinal));
  }, [dispatch, params.pv]);

  useEffect(() => {
    dispatch(fetchSearchParams(params.hash));
  }, [dispatch, params.hash]);

  if (!isAdmin(user)) {
    return <Unauthorized />
  }
  if (!currentPage) {
    return <BeatLoader />
  }
  if (!data) {
    return <BeatLoader />
  }
  const renderSchemaTokens = () => {


    return (<>

      {templates.map(((template, i) => {
        if(template !== ''){ 
          let schemaId = parseSchemaIds(template);
          let schemaValues= MMSchemas.mail_merge_schemas.filter(x=>x.id==schemaId)
          const templateTokens=schemaValues[0] && ['schema_id', schemaValues[0]['name'], schemaValues[0].pk_value, schemaValues[0].pk_type, schemaValues[0].end_point, schemaValues[0].options, schemaValues[0].parentQuery]
          return templateTokens.length > 0 && <MMTestComponent arg={match.params['nctId']} schemaTokens={templateTokens} template={template} />
        }
        }))
      
      }

    </>)
  }
  if(!MMSchemas){
    return <BeatLoader/>
  }
  return (
    <>
      {renderSchemaTokens()}
    </>
  );
}
