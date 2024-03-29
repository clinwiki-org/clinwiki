import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getStudyQuery, getSearchQuery, getHasuraStudyQuery, getSearchQueryDIS, getHasuraStudyQueryDIS, getSearchNearbyQuery } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { useFragment } from 'components/MailMerge/MailMergeFragment';
import { fetchStudyPage, fetchSearchPageMM, fetchStudyPageHasura, fetchStudyPageHasuraDIS, fetchStudyPageNearby } from 'services/study/actions';

import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import { useHasuraFragment } from 'components/MailMerge/HasuraMMFragment';
import { insertPageViewLog } from 'services/genericPage/actions';


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
    const match = useRouteMatch();
    const dispatch = useDispatch();
    const params = useUrlParams();
    const studyData = useSelector((state: RootState) => state.study.studyPage);
    const studyList = useSelector((state: RootState) => state.study.studyList);
    const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
    const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
    const currentUser = useSelector((state:RootState)=> state.user.current);
    const isFetchingCurrentUser = useSelector((state:RootState)=> state.user.isLoading);
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

    const [fragmentName, fragment] = useFragment(schemaType, currentPage.template || '');
    const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`

    const [fragmentNameDis, fragmentDis] = useFragment(schemaType, currentPage.template || '');
    const HASURA_SEARCH_QUERY = `${getSearchQueryDIS(fragmentNameDis, fragmentDis)}`

    const [hasuraFragmentNameDis, hasuraFragmentDis] = useHasuraFragment('dis_prod_tbl_conditions', currentPage?.template || '');
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
                return studyData?.data?.dis_prod_tbl_conditions[0]
            default:
                console.log("No PAGE TYPE ")
                return
        }
    }

    const currentStudy = match.params['nctId']
    const nctIdObject = studyList?.data?.search?.studies?.find(study => study.nctId == currentStudy);
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

    useEffect(()=>{
      !isFetchingCurrentUser &&  dispatch(insertPageViewLog( currentUser?.id || null, window.location.href ))
    }, [dispatch, window.location.href, isFetchingCurrentUser,currentUser]);

    const islands = pageType == 'Study' ? studyIslands : searchIslands;
    if (pageType == 'Study' && !studyData) {
        return <BeatLoader />
    }
    return (
        <div>
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