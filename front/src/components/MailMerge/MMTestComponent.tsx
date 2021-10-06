import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import CollapsiblePanel from 'components/CollapsiblePanel';
import MailMerge from './MailMerge';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getMyQuery } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { fetchSearchPageMM, fetchStudyPageHasura, fetchStudyPageHasuraDIS, fetchStudyPageNearby } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import { useFragment, schemaTokens } from 'components/MailMerge/MailMergeFragment';
import { introspectionQuery } from 'graphql/utilities';
import { fetchNodeIntrospection, fetchHasuraIntrospection } from 'services/introspection/actions';
import { fetchSearchParams } from 'services/search/actions';
import {  useRef } from 'react';
import  {  applyTemplate, compileTemplate } from 'components/MailMerge/MailMergeView';
import { convertDisplayName, fetchIslandConfig, fetchSearchPageAggBuckets } from 'services/search/actions'
import { fetchSuggestedLabels, setShowLoginModal } from '../../services/study/actions';
import {  getSearchQuery, getHasuraStudyQuery, getSearchQueryDIS, getHasuraStudyQueryDIS, getSearchNearbyQuery } from 'components/MailMerge/MailMergeUtils';
import { islandTokens } from 'components/MailMerge/MailMergeFragment';
import {fetchGenericPage, insertPageViewLog } from 'services/genericPage/actions';
import LoginModal from 'components/LoginModal';
import { uniq } from 'ramda';
import useHandlebars from 'hooks/useHandlebars';
interface Props {
    url?: string;
    arg?: string;
}
type Mode = 'Study' | 'Search_Study' | 'Condition' | 'Search_Condition';

function getClassForMode(mode: Mode) {
    switch (mode) {
        case 'Study':
            return 'ctgov_prod_studies';
        case 'Search_Study':
            return 'ElasticStudy';
        case 'Condition':
            return 'Condition';
        case 'Search_Condition':
            return 'ElasticStudyDIS';
    }
}

export default function GenericPageWrapper(props: Props) {
    const match = useRouteMatch();
    const dispatch = useDispatch();
    const params = useUrlParams();
    const hasuraIntrospection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);
    const nodeIntrospection = useSelector((state: RootState) => state.introspection.nodeIntrospection);
    const genericPageData = useSelector((state: RootState) => state.genericPage.genericPageData);

    const studyList = useSelector((state: RootState) => state.study.studyList);
    const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
    const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
    const [template, setTemplate] = useState(currentPage?.template);

    const currentUser = useSelector((state: RootState) => state.user.current);
    const isFetchingCurrentUser = useSelector((state: RootState) => state.user.isLoading);
    const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
    const searchHash = useSelector((state: RootState) => state.search.searchHash);
    const searchParams = data?.data?.searchParams;
    const showLoginModal = useSelector((state: RootState) => state.study.showLoginModal);
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

    useEffect(() => {
      dispatch(fetchSearchParams(params.hash));
    }, [dispatch, params.hash]);
  
    const currentPageType = getPageType(currentPage?.page_type);
    const schemaType = getClassForMode(currentPageType);
    const templateSchemaTokens = schemaTokens(currentPage?.template)

    const [fragmentName, fragment] = useFragment(templateSchemaTokens[1], template || '');
    const GENERIC_QUERY = `${getMyQuery(fragmentName, fragment, templateSchemaTokens[1], templateSchemaTokens[2],templateSchemaTokens[3], templateSchemaTokens[4], templateSchemaTokens[5], templateSchemaTokens[6] && templateSchemaTokens[6]  )}`

    useEffect(() => {

        let searchParams = { ...data?.data?.searchParams };
        dispatch(fetchGenericPage(templateSchemaTokens[2]== 'params' ? searchParams.searchParams: currentDoc, templateSchemaTokens[2], GENERIC_QUERY, templateSchemaTokens[6] ? false:true));

    }, [dispatch, currentPage, props.arg, upsertingLabel, params.hash, data, suggestedLabels, studyList?.data?.search?.recordsTotal]);

    useEffect(() => {
      const QUERY = introspectionQuery
      pageType == "Search_Study" ? dispatch(fetchNodeIntrospection(QUERY)): dispatch(fetchHasuraIntrospection(QUERY));
    }, [dispatch]);
  
    const pageSizeHelper = (pageSize) => {
        if (pageSize > 500) {
            return 500
        } else {
            return pageSize
        }
    }

    const searchData = (pageType) => {
        // For first pass, working under the assumption that if given a value for parentQuery it is an elastic value with recordsTotal
         if(templateSchemaTokens[6] && genericPageData?.data){
            let documentsArray: any[] = []
            let arrayToMap: any[] = genericPageData?.data[templateSchemaTokens[4]][templateSchemaTokens[6]] ? genericPageData?.data[templateSchemaTokens[4]][templateSchemaTokens[6]]: [];
            arrayToMap.map((document, index) => {
                    documentsArray.push({ ...document, ALL: 'ALL', hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', })
                })
                let documentsObject = {};
                documentsObject[templateSchemaTokens[6]]= documentsArray

                return {
                    ...documentsObject                 ,
                    recordsTotal: genericPageData?.data[templateSchemaTokens[4]]?.recordsTotal
                }
        
                } else{

                let documents = genericPageData?.data ? genericPageData.data[templateSchemaTokens[4]][0] : []
                // Currently commented out until generalized otherwise breaks dis 
                // return { ...documents, nextStudy, previousStudy }
                return { ...documents }
        }
    }

    const currentDoc = match.params['docId']
    console.log("Match?", match)
    const nctIdObject = studyList?.data?.search?.studies?.find(study => study.nctId == currentDoc);
    const currentIndexOfStudyList = studyList?.data?.search?.studies?.indexOf(nctIdObject)
    // console.log('studyList?.data?.search?.studies', studyList?.data?.search?.studies.length);

    const nextStudy = () => {
        const nextNctId = studyList?.data?.search?.studies[currentIndexOfStudyList + 1]
        console.log("currentIndexOfStudyList", currentIndexOfStudyList);
        if (nextNctId && nextNctId.nctId) {
            console.log("nextNctId is", nextNctId.nctId);
            return nextNctId.nctId
        } else {
            console.log("adjust nextButton");
            return document.querySelector(".next-btn")?.classList.add("disabled-btn")
        }
    }

    const previousStudy = () => {
        const previousNctId = studyList?.data?.search?.studies[currentIndexOfStudyList - 1]
        if (previousNctId && previousNctId.nctId) {
            return previousNctId.nctId
        } else {
            return document.querySelector('.prev-btn')?.classList.add('disabled-btn')
        }
    }

    const pageType = getPageType(currentPage?.page_type);

    const title = microMailMerge(currentPage?.title, searchData(pageType)) || "Add a Title";

    useEffect(() => {
        !isFetchingCurrentUser && dispatch(insertPageViewLog(currentUser?.id || null, window.location.href))
    }, [dispatch, window.location.href, isFetchingCurrentUser, currentUser]);

    const islands = pageType == 'Study' ? studyIslands : searchIslands;


    const islandKeys = new Set(Object.keys(islands || {}));
    const aggIslandsCurrent = useRef({
        currentAggIslands: [] as any[]
    })
    const wfIslandsCurrent = useRef({
        currentWFIslands: [] as any[]
    })

    console.log(islandKeys)



    const isAgg = island => island.name == "agg";
    const isWFAgg = island => island.name == "wfagg";

    // FETCH ISLAND CONFIG FOR UNIQUE AGG ISLAND IDs AND WF ISLAND IDs
    useEffect(() => {
        const islandKeys = islandTokens(currentPage.template)

        aggIslandsCurrent.current.currentAggIslands = islandKeys.filter(isAgg, islandKeys);
        wfIslandsCurrent.current.currentWFIslands = islandKeys.filter(isWFAgg, islandKeys);
        let uniqueAggs = uniq(aggIslandsCurrent.current.currentAggIslands);
        let aggIdArray: any[] = [];
        let uniqueWFIds = uniq(wfIslandsCurrent.current.currentWFIslands);
        let wfLabels: any[] = [];

        uniqueWFIds.map((WF) => {
            wfLabels.push(parseInt(WF.attribs.id))
        });

        uniqueAggs.map((agg) => {
            aggIdArray.push(parseInt(agg.attribs.id))

        });
        !islandConfig && dispatch(fetchIslandConfig(aggIdArray.concat(wfLabels)));
    }, [dispatch, currentPage]);
    // END 

    // FETCH BUCKETS FOR ISLANDS 
    useEffect(() => {
        // Duplicate code// Refactor // IslandsAggChild is other file
        let uniqueAggs = uniq(aggIslandsCurrent.current.currentAggIslands);
        let aggArray: any[] = [];
        let aggIdArray: any[] = [];
        let aggBucketsWanted: any[] = [];
        let aggSortArray: any[] = [];
        let crowdAggArray: any[] = [];
        let crowdAggIdArray: any[] = [];
        let crowdBucketsWanted: any[] = [];
        let crowdAggSortArray: any[] = [];

        islandConfig && uniqueAggs.map((agg) => {
            const aggID = agg.attribs.id;
            if (islandConfig[aggID]?.defaultToOpen == true) {
                let sort = {
                    id: islandConfig[aggID].order.sortKind,
                    desc: islandConfig[aggID].order.desc
                };

                islandConfig[aggID].aggKind == 'crowdAggs' && crowdAggArray.push(islandConfig[aggID].name);
                islandConfig[aggID].aggKind == 'crowdAggs' && crowdAggIdArray.push({ id: aggID, name: islandConfig[aggID].name });
                islandConfig[aggID].aggKind == 'crowdAggs' && crowdBucketsWanted.push(islandConfig[aggID].visibleOptions);
                islandConfig[aggID].aggKind == 'crowdAggs' && crowdAggSortArray.push(sort);
                islandConfig[aggID].aggKind == 'aggs' && aggArray.push(islandConfig[aggID].name);
                islandConfig[aggID].aggKind == 'aggs' && aggIdArray.push({ id: aggID, name: islandConfig[aggID].name });
                islandConfig[aggID].aggKind == 'aggs' && aggBucketsWanted.push(islandConfig[aggID].visibleOptions);
                islandConfig[aggID].aggKind == 'aggs' && aggSortArray.push(sort);
            }
        });


        if (searchParams && crowdAggArray.length !== 0 || searchParams && aggArray.length !== 0) {

            crowdAggArray.forEach((agg, i) => {

                const variables = {
                    ...searchParams.searchParams,
                    url: params.sv,
                    configType: 'presearch',
                    returnAll: false,
                    agg: `fm_${agg}`,
                    aggOptionsSort: crowdAggSortArray[i],
                    pageSize: 100,
                    page: 1,
                    q: searchParams.searchParams.q,
                    aggBucketsWanted: crowdBucketsWanted[i]

                };

                dispatch(fetchSearchPageAggBuckets(variables, crowdAggIdArray[i].id))
            });
            aggArray.forEach((agg, i) => {

                const variables = {
                    ...searchParams.searchParams,
                    url: params.sv,
                    configType: 'presearch',
                    returnAll: false,
                    agg: agg,
                    aggOptionsSort: aggSortArray[i],
                    pageSize: 25,
                    page: 1,
                    q: searchParams.searchParams.q,
                    aggBucketsWanted: aggBucketsWanted[i]

                };

                dispatch(fetchSearchPageAggBuckets(variables, aggIdArray[i].id))
            });
        }

    }, [dispatch, islandConfig, searchHash, searchParams])
    // END 

    // FETCH BUCKETS FOR WF 
    useEffect(() => {
        let uniqueWFIds = uniq(wfIslandsCurrent.current.currentWFIslands);
        let wfLabels: any[] = [];

        islandConfig && uniqueWFIds.map((WF) => {
            const wfID = WF.attribs.id;
            if (islandConfig[wfID]?.defaultToOpen == true) {
                islandConfig[wfID] && wfLabels.push(islandConfig[wfID].name);
            }
        })

        if (wfLabels) {
            //@ts-ignore
            wfLabels[0] && dispatch(fetchSuggestedLabels(searchData(pageType)?.nct_id, wfLabels));

        }


    }, [dispatch, islandConfig])
    // END
    // WFISLANDS CONVERTDISPLAY NAME 

    useEffect(() => {
        let uniqueWFIds = uniq(wfIslandsCurrent.current.currentWFIslands);

        suggestedLabels && uniqueWFIds.map((WF) => {
            const wfID = WF.attribs.id;
            let currentKeyObjects = suggestedLabels?.data?.crowd_keys.filter((x) => x.crowd_key === islandConfig[wfID].name)

            if (islandConfig[wfID]?.defaultToOpen == true) {
                const compiled = islandConfig[wfID] && compileTemplate(islandConfig[wfID].displayName)
                const raw = currentKeyObjects && applyTemplate(compiled, currentKeyObjects[0])
                if (raw !== islandConfig[wfID].displayName) {
                    dispatch(convertDisplayName(raw, wfID))
                }
            }
        })

    }, [suggestedLabels])  


  
    if (pageType == 'Study' && !genericPageData) {
        return <BeatLoader />
    }
    const introspection = pageType == 'Search_Study' ? nodeIntrospection : hasuraIntrospection;

if(!introspection){
  return <BeatLoader/>
}

    const types = introspection.data.__schema.types;
console.log(searchData(pageType))
    return (
      <>  
        <div>
        <MailMerge
          schema={ { kind: 'graphql', typeName: schemaType, types } }
          sample={searchData(pageType)}
          template={template}
          onTemplateChanged={setTemplate}
          islands={islands}
        />
        </div>

        <CollapsiblePanel
        header={"TEMPLATE RENDERED "}
        collapsed={false}
        id='template'>
        {
        
        <div>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {currentPage && genericPageData && <MailMergeView
                template={template}
                context={searchData(pageType)}
                islands={islands}
                />}
        </div>
              }
            </CollapsiblePanel>
            <CollapsiblePanel
        header={"TEMPLATE FRAGMENT & RAW RESPONSE"}
        collapsed={false}
        id="frag">{
          
        }
      <h2>Fragment</h2>
      <pre>{fragment}</pre>
      <h2>Response</h2>
      <pre>
        {JSON.stringify(searchData(pageType), null, 2)}
      </pre>
          </CollapsiblePanel>  
      </>
    );
}