import React, { useEffect, useRef } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { convertDisplayName, fetchIslandConfig, fetchSearchPageAggBuckets } from 'services/search/actions'
import { fetchSuggestedLabels, setShowLoginModal } from '../../services/study/actions';
import {  getSearchQuery, getHasuraStudyQuery, getSearchQueryDIS, getHasuraStudyQueryDIS, getSearchNearbyQuery } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import {  fetchSearchPageMM, fetchStudyPageHasura, fetchStudyPageHasuraDIS, fetchStudyPageNearby } from 'services/study/actions';

import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import { useHasuraFragment } from 'components/MailMerge/HasuraMMFragment';
import { insertPageViewLog } from 'services/genericPage/actions';
import LoginModal from 'components/LoginModal';

import { uniq } from 'ramda';
import Handlebars from 'handlebars';
import useHandlebars from 'hooks/useHandlebars';
interface Props {
    url?: string;
    arg?: string;
}
type Mode = 'Study' | 'Search_Study' | 'Condition' | 'Search_Condition';

function getClassForMode(mode: Mode) {
    switch (mode) {
        case 'Study':
            return 'Study';
        case 'Search_Study':
            return 'ElasticStudy';
        case 'Condition':
            return 'Condition';
        case 'Search_Condition':
            return 'ElasticStudyDIS';
    }
}

export default function GenericPageWrapper(props: Props) {
    useHandlebars();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const params = useUrlParams();

    const currentUser = useSelector((state: RootState) => state.user.current);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const isFetchingCurrentUser = useSelector((state: RootState) => state.user.isLoading);
    const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const searchHash = useSelector((state: RootState) => state.search.searchHash);
    const searchParams = data?.data?.searchParams;
    const showLoginModal = useSelector((state: RootState) => state.study.showLoginModal);
    const studyData = useSelector((state: RootState) => state.study.studyPage);
    const studyList = useSelector((state: RootState) => state.study.studyList);
    const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
    const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
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


    const currentPageType = getPageType(currentPage?.page_type);
    const schemaType = getClassForMode(currentPageType);

    const [hasuraFragmentName, hasuraFragment] = useHasuraFragment('ctgov_prod_studies', currentPage?.template || '');
    const HASURA_STUDY_QUERY = `${getHasuraStudyQuery(hasuraFragmentName, hasuraFragment)}`

    const [fragmentName, fragment] = useHasuraFragment(schemaType, currentPage.template || '');
    const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`

    const [fragmentNameDis, fragmentDis] = useHasuraFragment(schemaType, currentPage.template || '');
    const HASURA_SEARCH_QUERY = `${getSearchQueryDIS(fragmentNameDis, fragmentDis)}`

    const [hasuraFragmentNameDis, hasuraFragmentDis] = useHasuraFragment('disyii2_prod_20210704_2_tbl_conditions', currentPage?.template || '');
    const HASURA_STUDY_QUERY_DIS = `${getHasuraStudyQueryDIS(hasuraFragmentNameDis, hasuraFragmentDis)}`

    useEffect(() => {

        let searchParams = { ...data?.data?.searchParams };

        switch (pageType) {
            case 'Study':
                dispatch(fetchStudyPageHasura(props.arg ?? "", HASURA_STUDY_QUERY));
                const SEARCH_NEARBY_QUERY = `${getSearchNearbyQuery()}`
                const pageSize = searchParams.searchParams.pageSize = studyList?.data?.search?.recordsTotal
                const finalPageSize = pageSizeHelper(pageSize)
                dispatch(fetchStudyPageNearby({ ...searchParams.searchParams, pageSize: finalPageSize }, SEARCH_NEARBY_QUERY))
                return
            case 'Search_Study':
                dispatch(fetchSearchPageMM(searchParams.searchParams, SEARCH_QUERY));
                return
            case 'Search_Condition':
                dispatch(fetchSearchPageMM(searchParams.searchParams, HASURA_SEARCH_QUERY));
                return
            case 'Condition':
                dispatch(fetchStudyPageHasuraDIS(props.arg ?? "", HASURA_STUDY_QUERY_DIS));
                return
            default:
                console.log("No PAGE TYPE ")
                return
        }
    }, [dispatch, currentPage, props.arg, upsertingLabel, params.hash, data, suggestedLabels, studyList?.data?.search?.recordsTotal]);


    const pageSizeHelper = (pageSize) => {
        if (pageSize > 500) {
            return 500
        } else {
            return pageSize
        }
    }

    const searchData = (pageType) => {
        switch (pageType) {
            case 'Study':
                return { ...studyData?.data?.ctgov_prod_studies[0], nextStudy, previousStudy }
            case 'Search_Study':
                let studies: any[] = []
                studyData?.data?.search?.studies?.map((study, index) => {
                    studies.push({ ...study, ALL: 'ALL', hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', })
                })
                return {
                    studies,
                    recordsTotal: studyData?.data?.search?.recordsTotal
                }
            case 'Search_Condition':
                let diseases: any[] = []
                studyData?.data?.searchDIS.diseases.map((disease, index) => {
                    diseases.push({ ...disease, ALL: 'ALL', hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', })
                })
                return {
                    diseases,
                    recordsTotal: studyData?.data?.searchDIS.recordsTotal
                }
            case 'Condition':
                return studyData?.data?.disyii2_prod_20210704_2_tbl_conditions[0]
            default:
                console.log("No PAGE TYPE ")
                return
        }
    }

    const currentStudy = match.params['nctId']
    const nctIdObject = studyList?.data?.search?.studies?.find(study => study.nctId == currentStudy);
    const currentIndexOfStudyList = studyList?.data?.search?.studies?.indexOf(nctIdObject)

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
    function islandTokens(input: string) {
        let tokens: any[] = [];
        const yeet = (t: string) => {
            //replace() to remove any line breaks \n
            if (t !== '') {
                t = t.replace(/[\r\n]+/gm, "");
                if (t.startsWith('<')) {
                    const parts = t.split(/\s/).filter(id => id);
                    let object = {}
                    if (parts.length > 1) {
                        object['name'] = parts[0].slice(1)
                        let attributesArray = parts[1].split("=")
                        let attributes = {};
                        attributes[attributesArray[0]] = attributesArray[1] ?
                            attributesArray[1]
                                .replace(/\"/g, "")
                                .replace(/\'/g, "") : attributesArray[1]
                        object['attribs'] = attributes
                        tokens.push(object)
                    } else {
                        object['name'] = parts[0].slice(1)
                        tokens.push(object)
                    }

                }

            }
        };
        let current = '';
        let last = '';
        let inside = false;
        for (const ch of input) {
            if (ch === '<') {
                // Begin <
                inside = true;
                current = ch;
            } else if (ch === '>' && current[1] !== '/') {
                inside = false;
                // Begin >
                yeet(current);
                current = ch;
            } else {
                current += ch;
            }
            last = ch;
        }
        return tokens;
    }



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
    function compileTemplate(template: string) {
        try {
            return Handlebars.compile(template);
        } catch (e) {
            const errMsg = `Template error: ${e}`;
            return _ => errMsg;
        }
    }
    function randomIdentifier() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
        const randomChar = () => chars[Math.floor((Math.random() * chars.length))]
        return Array.from({ length: 12 }, randomChar).join('');
    }
    function applyTemplate(
        template: HandlebarsTemplateDelegate<any>,
        context?: object,
    ) {
        try {
            context = { ...context, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' }
            return template(context);
        } catch (e) {
            return `#Template apply error:\n   ${e}`;
        }
    }
    // WFISLANDS CONVERTDISPLAY NAME 

    useEffect(() => {
        let uniqueWFIds = uniq(wfIslandsCurrent.current.currentWFIslands);

        suggestedLabels && uniqueWFIds.map((WF) => {
            const wfID = WF.attribs.id;
            let currentKeyObjects = suggestedLabels.data.crowd_keys.filter((x) => x.crowd_key === islandConfig[wfID].name)

            if (islandConfig[wfID]?.defaultToOpen == true) {
                const compiled = islandConfig[wfID] && compileTemplate(islandConfig[wfID].displayName)
                const raw = applyTemplate(compiled, currentKeyObjects[0])
                if (raw !== islandConfig[wfID].displayName) {
                    dispatch(convertDisplayName(raw, wfID))
                }
            }
        })

    }, [suggestedLabels])

    if (pageType == 'Study' && !studyData || !searchParams) {
        return <BeatLoader />
    }


    return (

        <div>
            <LoginModal
                show={showLoginModal}
                cancel={() => dispatch(setShowLoginModal(false))}
            />
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {currentPage && studyData && <MailMergeView
                template={currentPage?.template || ''}
                context={searchData(pageType)}
                islands={islands}
            />}
        </div>
    );
}