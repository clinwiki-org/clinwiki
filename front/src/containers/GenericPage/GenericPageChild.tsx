import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getStudyQuery, getSearchQuery } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { useFragment } from 'components/MailMerge/MailMergeFragment';
import { fetchStudyPage, fetchSearchPageMM } from 'services/study/actions';

import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';


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
    const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;

    //Currently making assumption anything diplayed in our search route is of pageType study 
    //Ideally should be set from PageView but was having issues , response was not saving
    const pageType = match.path == "/search/" ? "Search" : "Study"
    const schemaType = getClassForMode(pageType);
    const [fragmentName, fragment] = useFragment(schemaType, currentPage.template || '');

    useEffect(() => {
        let searchParams = pageType == "Search" ? { ...data.data.searchParams.searchParams } : null;
        const STUDY_QUERY = `${getStudyQuery(fragmentName, fragment)}`
        const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`
        dispatch(pageType == "Study" ? fetchStudyPage(props.arg ?? "", STUDY_QUERY) : fetchSearchPageMM(searchParams, SEARCH_QUERY));
    }, [dispatch, currentPage, props.arg, upsertingLabel, params.hash, data]);


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
    const title = microMailMerge(currentPage?.title, studyData?.data?.study || searchData()) || "Add a Title";

    const islands = pageType == 'Study' ? studyIslands : searchIslands;
    if (pageType == 'Study' && !studyData) {
        return <BeatLoader />
    }
    return (
        <div>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            { currentPage && <MailMergeView
                template={currentPage?.template || ''}
                context={studyData?.data?.study || searchData()}
                islands={islands}
                pageType={pageType}
            />}
        </div>
    );
}