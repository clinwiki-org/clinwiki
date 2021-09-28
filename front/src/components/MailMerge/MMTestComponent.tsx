import React, { useEffect, useState } from 'react';
import MailMergeView, {
    microMailMerge,
} from 'components/MailMerge/MailMergeView';
import CollapsiblePanel from 'components/CollapsiblePanel';
import MailMerge from './MailMerge';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getSearchQuery, getHasuraStudyQuery, getSearchQueryDIS, getHasuraStudyQueryDIS, getSearchNearbyQuery } from 'components/MailMerge/MailMergeUtils';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import useUrlParams from 'utils/UrlParamsProvider';
import { fetchSearchPageMM, fetchStudyPageHasura, fetchStudyPageHasuraDIS, fetchStudyPageNearby } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import { useHasuraFragment } from 'components/MailMerge/HasuraMMFragment';
import { introspectionQuery } from 'graphql/utilities';
import { fetchNodeIntrospection, fetchHasuraIntrospection } from 'services/introspection/actions';
import { fetchSearchParams } from 'services/search/actions';

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

    const studyData = useSelector((state: RootState) => state.study.studyPage);
    const studyList = useSelector((state: RootState) => state.study.studyList);
    const upsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel);
    const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
    const data = useSelector((state: RootState) => state.search.searchResults);
    const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
    const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
    const [template, setTemplate] = useState(currentPage?.template);

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

    const [hasuraFragmentName, hasuraFragment] = useHasuraFragment('ctgov_prod_studies', template || '');
    const HASURA_STUDY_QUERY = `${getHasuraStudyQuery(hasuraFragmentName, hasuraFragment)}`

    const [fragmentName, fragment] = useHasuraFragment(schemaType, template || '');
    const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`

    const [fragmentNameDis, fragmentDis] = useHasuraFragment(schemaType, template || '');
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
    console.log("Match?", match)
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

    const islands = pageType == 'Study' ? studyIslands : searchIslands;
  


  
    if (pageType == 'Study' && !studyData) {
        return <BeatLoader />
    }
    const introspection = pageType == 'Search_Study' ? nodeIntrospection : hasuraIntrospection;

if(!introspection){
  return <BeatLoader/>
}

    const types = introspection.data.__schema.types;

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
            {currentPage && studyData && <MailMergeView
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