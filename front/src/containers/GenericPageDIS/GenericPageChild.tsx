import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getStudyQuery, getSearchQuery, getHasuraStudyQueryDIS, getSearchQueryDIS } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands, commonIslands} from 'containers/Islands/CommonIslands'
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
type Mode = 'Disease' | 'Search';

function getClassForMode(mode: Mode) {
    switch (mode) {
        case 'Disease':
            return 'Disease';
        case 'Search':
            return 'ElasticStudyDIS';
    }
}


export default function GenericPageWrapperDIS(props: Props) {
    const match = useRouteMatch();
    const dispatch = useDispatch();
    const params = useUrlParams();
    const studyData = useSelector((state: RootState) => state.study.studyPage);
    // const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
    // const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
    // //Currently making assumption anything diplayed in our search route is of pageType study 
    // //Ideally should be set from PageView but was having issues , response was not saving
    const pageType = match.path == "/searchdis/" ? "Search" : "Study"
    const schemaType = getClassForMode("Search");
    const [fragmentName, fragment] = useFragment(schemaType, currentPage.template || '');
    const [hasuraFragmentName, hasuraFragment] = useHasuraFragment('disyii2_prod_20210704_2_tbl_conditions', currentPage?.template || '');

    useEffect(() => {

        let searchParams = pageType == "Search" ? { ...data.data.searchParams } : null;
        console.log("hi",searchParams.searchParams)

        // const HASURA_STUDY_QUERY = `${getHasuraStudyQueryDIS(hasuraFragmentName, hasuraFragment)}`
        // dispatch(fetchStudyPageHasuraDIS(props.arg ?? "", HASURA_SEARCH_QUERY));
        const HASURA_SEARCH_QUERY = `${getSearchQueryDIS(fragmentName, fragment)}`
       
       
       console.log("three,", HASURA_SEARCH_QUERY)
       
        dispatch(fetchSearchPageMM(searchParams.searchParams, HASURA_SEARCH_QUERY));

    }, [dispatch, currentPage, props.arg, params.hash, data]);


    const searchData = () => {
        let diseases: any[] = []
        studyData?.data?.searchDIS.diseases.map((study, index) => {
            diseases.push({ ...study, ALL: 'ALL', hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', })
        })
        return {
            diseases,
            recordsTotal: studyData?.data?.searchDIS.recordsTotal
        }
    }
    const title = microMailMerge(currentPage?.title, studyData?.data?.searchDIS.diseases[0] ) || "Add a Title";

    const islands = commonIslands;
    if (!studyData) {
        return <BeatLoader />
    }

    return (
        <div>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            { currentPage && studyData && <MailMergeView
                template={currentPage?.template || ''}
                context={ searchData()}
                islands={islands}
                // pageType={pageType}
            />}
        </div>
    );
    return(
        <h1>
            DIS
        </h1>
    )
}