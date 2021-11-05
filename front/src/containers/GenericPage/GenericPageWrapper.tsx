import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import useUrlParams from 'utils/UrlParamsProvider';
import { find, propEq } from 'ramda';
import { fetchPageViewsHasura, fetchPageViewHasura } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import GenericPageChild from './GenericPageChild';
import { fetchSearchParams } from 'services/search/actions';
import { fetchMMSchemas } from 'services/genericPage/actions';
import { parseSchemaIds, templateSplit } from 'components/MailMerge/MailMergeFragment';

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
  // const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
  const MMSchemas= useSelector((state: RootState) => state.genericPage.MMSchemas);
  const templates = currentPage && currentPage.template && templateSplit(currentPage.template)

  const getPageType = (val) => {
    switch (val) {
      case 1:
        return 'Study'
      case 2:
        return 'Search_Study'
      case 3:
        return 'Condition'
      case 4:
        return 'Search_Condition'
      default:
        return "Search_Study"
    }
  }
  //Currently making assumption anything diplayed in our search route is of pageType study 
  //Ideally should be set from PageView but was having issues , response was not saving 
  // const pageType = match.path == "/search/" ? "Search" : "Study"
  const pageType = getPageType(currentPage?.page_type);
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
    dispatch(fetchMMSchemas());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchPageViewHasura(site?.id, params.pv || defaultPage() || urlFinal));
  }, [dispatch, params.pv]);
  useEffect(() => {
    dispatch(fetchSearchParams(params.hash));
  }, [dispatch, params.hash]);

  if (!params.hash && pageType == "Search_Study") {
    history.push(`/search?hash=${site.default_hash}&pv=${site.default_search_page}`)
    //window.location.reload()
  }
  if (!currentPage) {
    return <BeatLoader />
  }
  if (!data) {
    return <BeatLoader />
  }
  // if (!props.arg && pageType == "Study") {
  //   return <h1>Missing NCTID in URL</h1>;
  // }
  // if (!params.pv && pageType == "Search_Study") {
  //   return <h1>Missing PageView in URL</h1>;
  // }

  const renderSchemaTokens = () => {
    return (
      <span>
        {templates.map((template => {
 let schemaId = parseSchemaIds(template);
 let schemaValues= MMSchemas.mail_merge_schemas.filter(x=>x.id==schemaId)
 const templateTokens=schemaValues[0] && ['schema_id', schemaValues[0]['name'], schemaValues[0].pk_value, schemaValues[0].pk_type, schemaValues[0].end_point, schemaValues[0].options, schemaValues[0].parentQuery]
          return templateTokens && templateTokens.length > 0 && <GenericPageChild arg={match.params['nctId']} schemaTokens={templateTokens} template={template} />
        }))}
      </span>
    )
  }
  if(!MMSchemas){
    return <BeatLoader/>
  }
  return (
    <span>
      {renderSchemaTokens()}
    </span>
  );
}
