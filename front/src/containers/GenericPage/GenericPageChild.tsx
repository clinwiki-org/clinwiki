import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getStudyQuery, getSearchQuery, getHasuraStudyQuery, getSearchNearbyQuery } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { useFragment } from 'components/MailMerge/MailMergeFragment';
import { fetchStudyPage, fetchSearchPageMM, fetchStudyPageHasura, fetchStudyPageNearby } from 'services/study/actions';

import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import { useHasuraFragment } from 'components/MailMerge/HasuraMMFragment';


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
    //Currently making assumption anything diplayed in our search route is of pageType study 
    //Ideally should be set from PageView but was having issues , response was not saving
    const pageType = match.path == "/search/" ? "Search" : "Study"
    const schemaType = getClassForMode(pageType);
    const [fragmentName, fragment] = useFragment(schemaType, currentPage.template || '');
    const [hasuraFragmentName, hasuraFragment] = useHasuraFragment('ctgov_prod_studies', currentPage?.template || '');

    useEffect(() => {
        let searchParams = { ...data.data.searchParams };
        console.log('searchParams', searchParams);
        const HASURA_STUDY_QUERY = `${getHasuraStudyQuery(hasuraFragmentName, hasuraFragment)}`
        // const STUDY_QUERY = `${getStudyQuery(fragmentName, fragment)}`
        const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`
        const SEARCH_NEARBY_QUERY = `${getSearchNearbyQuery()}`

        if (pageType == "Study") {
            dispatch(fetchStudyPageHasura(props.arg ?? "", HASURA_STUDY_QUERY))
            const pageSize = searchParams.searchParams.pageSize = studyList?.data?.search?.recordsTotal
            const finalPageSize = pageSizeHelper(pageSize)
            console.log("finalPageSize", finalPageSize);

            dispatch(fetchStudyPageNearby({ ...searchParams.searchParams, pageSize: finalPageSize }, SEARCH_NEARBY_QUERY))
            // dispatch(fetchStudyPageNearby(searchParams.searchParams, SEARCH_NEARBY_QUERY))
        } else {
            dispatch(fetchSearchPageMM(searchParams.searchParams, SEARCH_QUERY))
        }
    }, [dispatch, currentPage, props.arg, upsertingLabel, params.hash, data, suggestedLabels, studyList?.data?.search?.recordsTotal]);

    const pageSizeHelper = (pageSize) => {
        if (pageSize > 10000) {
            return 10000
        } else {
            return pageSize
        }
    }

    const searchData = () => {
        let studies: any[] = []
        studyData?.data?.search?.studies?.map((study, index) => {
            studies.push({ ...study, ALL: 'ALL', hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', })
        })
        return {
            studies,
            recordsTotal: studyData?.data?.search?.recordsTotal
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

    const title = microMailMerge(currentPage?.title, pageType == 'Study' ? studyData?.data?.ctgov_prod_studies[0] : searchData()) || "Add a Title";

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
                context={studyData?.data?.ctgov_prod_studies ? { ...studyData?.data?.ctgov_prod_studies[0], nextStudy, previousStudy } : searchData()}
                islands={islands}
                pageType={pageType}
            />}
        </div>
    );
}