import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import CollapsiblePanel from 'components/CollapsiblePanel';
// import MailMerge from './MailMerge';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getMyQuery } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { fetchStudyPageNearby } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import { useFragment } from 'components/MailMerge/MailMergeFragment';
import { fetchSearchParams } from 'services/search/actions';
import { useRef } from 'react';
import { applyTemplate, compileTemplate } from 'components/MailMerge/MailMergeView';
import { convertDisplayName, fetchIslandConfig, fetchSearchPageAggBuckets } from 'services/search/actions'
import { fetchSuggestedLabels, setShowLoginModal } from '../../services/study/actions';
import { getSearchNearbyQuery } from 'components/MailMerge/MailMergeUtils';
import { islandTokens } from 'components/MailMerge/MailMergeFragment';
import { fetchGenericPage, insertPageViewLog } from 'services/genericPage/actions';
import LoginModal from 'components/LoginModal';
import { uniq } from 'ramda';
import useHandlebars from 'hooks/useHandlebars';
import Unauthorized from 'components/ProtectedRoute/Unauthorized';
import { isAdmin } from 'utils/auth';
interface Props {
    url?: string;
    arg?: string;
    schemaTokens: any;
    template: any;
}
type Mode = 'Study' | 'Search_Study' | 'Condition' | 'Search_Condition' | 'Admin';

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

export default function GenericPageChild(props: Props) {
    useHandlebars();

    const match = useRouteMatch();
    const dispatch = useDispatch();
    const params = useUrlParams();
    const genericPageData = useSelector((state: RootState) => state.genericPage.genericPageData);

    const studyList = useSelector((state: RootState) => state.study.studyList);
    const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
    const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
    const user = useSelector((state: RootState) => state.user.current);

    const currentUser = useSelector((state: RootState) => state.user.current);
    const isFetchingCurrentUser = useSelector((state: RootState) => state.user.isLoading);
    const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
    const searchHash = useSelector((state: RootState) => state.search.searchHash);
    const searchParams = data?.data?.searchParams;
    const showLoginModal = useSelector((state: RootState) => state.study.showLoginModal);
    const savedDocs = useSelector((state: RootState) => state.search.savedDocs);
    const savedSearches = useSelector((state: RootState) => state.search.savedSearches);

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
            case 5:
                return 'Admin'
            default:
                return 'Admin'
        }
    }

    useEffect(() => {
       params.hash &&  dispatch(fetchSearchParams(params.hash));
    }, [dispatch, params.hash]);

    const currentPageType = getPageType(currentPage?.page_type);
    const currentDocId = match.params['docId'] && match.params['docId']
    const currentDoc=currentDocId  &&  currentDocId[0] == 'N' ? currentDocId:parseInt(currentDocId);
    const schemaType = getClassForMode(currentPageType);
    const templateSchemaTokens = props.schemaTokens

    const [fragmentName, fragment] = useFragment(templateSchemaTokens[1], props.template, templateSchemaTokens );
    const GENERIC_QUERY = `${getMyQuery(fragmentName, fragment, templateSchemaTokens[1], templateSchemaTokens[2], templateSchemaTokens[3], templateSchemaTokens[4], templateSchemaTokens[5], templateSchemaTokens[6] && templateSchemaTokens[6])}`
    const currentPageData = genericPageData && genericPageData[fragmentName]?.data; 
    useEffect(() => {
        let searchParams = { ...data?.data?.searchParams };

        dispatch(fetchGenericPage(fragmentName, templateSchemaTokens[2]== 'params' ? searchParams.searchParams: currentDoc || undefined, templateSchemaTokens[2], GENERIC_QUERY,( templateSchemaTokens[6] && templateSchemaTokens[2]== 'params' ? false :true)));
    }, [dispatch, props.template, currentPage, props.arg, upsertingLabel, params.hash, data, suggestedLabels, studyList?.data?.search?.recordsTotal]);


    const pageSizeHelper = (pageSize) => {
        if (pageSize > 500) {
            return 500
        } else {
            return pageSize
        }
    }

    const searchData = (pageType) => {
        // For first pass, working under the assumption that if given a value for parentQuery it is an elastic value with recordsTotal
        if (templateSchemaTokens[6] && currentPageData && templateSchemaTokens[6] !== templateSchemaTokens[4]) {
            let documentsArray: any[] = []
            let arrayToMap: any[] = currentPageData[templateSchemaTokens[4]][templateSchemaTokens[6]] ? currentPageData[templateSchemaTokens[4]][templateSchemaTokens[6]] : [];
            arrayToMap.map((document, index) => {
                documentsArray.push({ ...document, ALL: 'ALL', hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', })
            })
            let documentsObject = {};
            documentsObject[templateSchemaTokens[6]] = documentsArray

            return {
                ...documentsObject,
                recordsTotal: currentPageData[templateSchemaTokens[4]]?.recordsTotal
            }
        } else if (templateSchemaTokens[6] && currentPageData) {
            let documentsArray: any[] = []
            let arrayToMap: any[] = currentPageData[templateSchemaTokens[4]] ? currentPageData[templateSchemaTokens[4]] : [];
            arrayToMap.map((document, index) => {
                documentsArray.push({ ...document, ALL: 'ALL', hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', })
            })
            let documentsObject = {};
            documentsObject[templateSchemaTokens[4]] = documentsArray

            return {
                ...documentsObject,
                recordsTotal: currentPageData[templateSchemaTokens[4]]?.recordsTotal
            }
        } else {
            let documents = currentPageData ? currentPageData[templateSchemaTokens[4]][0] : []
            // Currently commented out until generalized otherwise breaks dis 
            // return { ...documents, nextStudy, previousStudy }
            return { ...documents }
        }

    }

    const nctIdObject = studyList?.data?.search?.studies?.find(study => study.nctId == currentDoc);
    const currentIndexOfStudyList = studyList?.data?.search?.studies?.indexOf(nctIdObject)
    // console.log('studyList?.data?.search?.studies', studyList?.data?.search?.studies.length);

    const nextStudy = () => {
        const nextNctId = studyList?.data?.search?.studies[currentIndexOfStudyList + 1]
        if (nextNctId && nextNctId.nctId) {
            return nextNctId.nctId
        } else {
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

    const displayAlert = () => {
        let message = "Did you know you can subscribe to your favorite searches and studies?";
        let callToAction = "Learn More!"
        if (savedDocs?.data?.saved_documents?.length == 0 || savedSearches?.data?.saved_searches?.length == 0)
            return (
                pageType !== "Admin" && <div className="flex items-center bg-blue-400 text-white text-xl font-bold px-4 py-3" role="alert">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
                    <p>{message} <a href="/profile?sv=user" className='underline'>{callToAction}</a></p>
                </div>
            )
        return
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

    if (!currentPageData) {
        return <BeatLoader />
    }
    if (!isAdmin(user) && pageType == "Admin") {
        return <Unauthorized />
    }

    return (

        <div>
            {displayAlert()}
            <LoginModal
                show={showLoginModal}
                cancel={() => dispatch(setShowLoginModal(false))}
            />
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {<MailMergeView
                template={props.template}
                context={searchData(pageType)}
                islands={islands}
            />}
        </div>
    );
}