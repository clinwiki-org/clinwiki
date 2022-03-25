import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import HtmlToReact from 'html-to-react';
import { useRouteMatch } from 'react-router-dom';
import  { applyTemplate, compileTemplate } from 'components/MailMerge/MailMergeView';
import { templateSplit } from 'components/MailMerge/MailMergeFragment';
import { updateSearchParamsAction } from 'services/search/actions'

type Mode = 'Study' | 'Search';

function getClassForMode(mode: Mode) {
  switch (mode) {
    case 'Study':
      return 'Study';
    case 'Search':
      return 'ElasticStudy';
  }
}

 function StudyInfiniteScroll() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const pageViewData = useSelector((state: RootState) => state.study.pageViewHasura);
  const currentPage = pageViewData ? pageViewData?.data?.page_views[0] : null;
  const currentPageFragName = useSelector((state:RootState) => state.genericPage.genericPageData?.currentPage)
  const templatePreSplit = templateSplit(currentPage.template);
  const template = templatePreSplit[0]
  const beginCardsTemplate = template.search('<div class="cards-container"')
  const endCardsTemplate = template.search("'></studyinfinitescroll>")
  const cardsTemplate = template.slice(beginCardsTemplate, endCardsTemplate).replace('{{#each studies }} ', '').replace('{{/each }} ', '')
  // const [fragmentName, fragment] = useFragment('search', currentPage.template|| '');

  // const beginFragment = fragment.search('{') + 1
  // const endFragment = fragment.search('}')
  // const itemFragment = fragment.slice(beginFragment, endFragment).split("\n")
  // const finalFragment = itemFragment.slice(1, itemFragment.length - 1).join(", ")
  const data = useSelector((state: RootState) => state.search.searchResults);
  const studyData = useSelector((state: RootState) => state.genericPage.genericPageData[currentPageFragName]?.data.search.studies) ;
  const recordsTotal = useSelector((state: RootState) => state.genericPage.genericPageData[currentPageFragName]?.data.search.recordsTotal)

  // const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`

  const renderStudyTemplate = (study) => {

    const compiled = compileTemplate(cardsTemplate)
    const raw = applyTemplate(compiled, study)
    const parser = new HtmlToReact.Parser();
    const reactElementHelperText = parser.parse(raw)
    return reactElementHelperText
  }

  const handleLoadMore = () => {
    const page = studyData.length / 25 + 1
    let variables = {
      ...data.data.searchParams.searchParams,
      pageSize: Math.floor(page * 25),
      page: 1,
    };
     dispatch(updateSearchParamsAction(variables));

    // dispatch(fetchSearchPageStudy(variables, SEARCH_QUERY));
  }

  const InfiniteScrollContainer = document.querySelector('.InfiniteScrollContainer');
  const InfiniteScrollContainerHeight = InfiniteScrollContainer?.scrollHeight;
  const [studyDocumentHeight, setStudyDocumentHeight] = useState(InfiniteScrollContainerHeight);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    const InfiniteScrollContainer = document.querySelector('.InfiniteScrollContainer');
    setStudyDocumentHeight(InfiniteScrollContainer?.scrollHeight);
    const shouldScroll = Number(InfiniteScrollContainerHeight) * 6 / 7

    if (studyData.length <= 25) {
      hasMoreHelper()
      InfiniteScrollContainer?.scrollTo(0, 0)
    } else {
      hasMoreHelper()
      InfiniteScrollContainer?.scrollTo(0, shouldScroll)
    }
    return () => {
      InfiniteScrollContainer?.scrollTo(0, 0)
    }
  }, [studyData?.length])

  const hasMoreHelper = () => {
    if (studyData.length % 25 !== 0 && studyData.length > 25) {
      setHasMore(false)
    } else if (studyData.length < 25) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }

  const handleLoadMoreHelper = () => {
    if (studyData.length >= 24 && studyData.length < recordsTotal) {
      handleLoadMore()
    } else {
      return
    }
  }

  return (
    <div className="InfiniteScrollContainer" style={{ height: '700px', overflow: 'auto' }}>
      <InfiniteScroll
        pageStart={0}
        loadMore={handleLoadMoreHelper}
        initialLoad={false}
        hasMore={hasMore}
        loader={<div key={0} style={{ display: 'flex', justifyContent: 'center' }}>
          <BeatLoader key="loader" />
        </div>}
        useWindow={false}
      >
        <div>{studyData.map && studyData.map((study, index) => {
          return (<div key={index}>
            {renderStudyTemplate(study)
            }
          </div>
          )
        })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default React.memo(StudyInfiniteScroll)