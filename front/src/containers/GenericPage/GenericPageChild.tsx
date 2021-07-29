import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getStudyQuery, getSearchQuery, getHasuraStudyQuery, getSearchQueryDIS, getHasuraStudyQueryDIS } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { useFragment } from 'components/MailMerge/MailMergeFragment';
import { fetchStudyPage, fetchSearchPageMM, fetchStudyPageHasura, fetchStudyPageHasuraDIS } from 'services/study/actions';

import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import { useHasuraFragment } from 'components/MailMerge/HasuraMMFragment';


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
    const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
    const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);

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

    const [hasuraFragmentNameDis, hasuraFragmentDis] = useHasuraFragment('disyii2_prod_20210704_2_tbl_conditions', currentPage?.template || '');
    const HASURA_STUDY_QUERY_DIS = `${getHasuraStudyQueryDIS(hasuraFragmentNameDis, hasuraFragmentDis)}`

    useEffect(() => {

        let searchParams = { ...data?.data?.searchParams };

        switch (pageType) {
            case 'Study':

                dispatch(fetchStudyPageHasura(props.arg ?? "", HASURA_STUDY_QUERY));

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
    }, [dispatch, currentPage, props.arg, upsertingLabel, params.hash, data, suggestedLabels]);


    const searchData = (pageType) => {
        switch (pageType) {
            case 'Study':
                return studyData?.data?.ctgov_prod_studies[0]
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
                return
            default:
                console.log("No PAGE TYPE ")
                return
        }
    }
    const pageType = getPageType(currentPage?.page_type);


    //console.log("STUDY DATA", studyData)
    const title = microMailMerge(currentPage?.title, searchData(pageType) || "Add a Title");

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