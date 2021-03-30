import React, { useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router-dom';
import useUrlParams from 'utils/UrlParamsProvider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchParams } from 'services/search/actions'
import { RootState } from 'reducers';
import { SearchQuery, SearchParams } from '../SearchPage/shared';
import {  SortInput } from 'types/globalTypes';
import SaveSearch from '../SearchPage/components/SaveSearch';

import { defaultPageSize } from '../SearchPage/Types';

import { map, dissoc } from 'ramda';
import { BeatLoader } from 'react-spinners';
import { AggFilterInput } from 'types/globalTypes';
import {
  SearchPageParamsQuery_searchParams,
} from '../../services/search/model/SearchPageParamsQuery';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';

const DEFAULT_PARAMS: SearchParams = {
  q: { children: [], key: 'AND' },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: defaultPageSize,
};
interface Props {
  aggId?: string;

}

function SaveSearchIsland(props: Props) {
  const dispatch = useDispatch();
  const params = useUrlParams();
  const hash = params.hash
  const PAGE_SIZE = 25;

  const emptySet = new Set();
  const searchParamsCurrent = useRef({
    q: { key: 'AND', children: [] as SearchQuery[] },
    aggFilters: [] as AggFilterInput[],
    crowdAggFilters: [] as AggFilterInput[],
    sorts: [] as SortInput[],
    page: 0,
    pageSize: defaultPageSize

  })

  



  const data = useSelector((state: RootState) => state.search.searchResults);
  const site = useSelector((state: RootState) => state.site.presentSiteProvider.site)
  const searchParams = data?.data?.searchParams;
  const match = useRouteMatch();
  const user = useSelector((state: RootState) => state.user.current);
  const presentSiteView = site?.siteView;
  useEffect(() => {
    match.path == "/search2/" && dispatch(fetchSearchParams(hash));
  }, [dispatch]);


  
  const searchParamsFromQuery = (
    params: SearchPageParamsQuery_searchParams | null | undefined,
    view: SiteViewFragment
  ): SearchParams => {
    const defaultParams = {
      ...DEFAULT_PARAMS,
      ...preselectedFilters(view),
    };
    if (!params) return defaultParams;

    const q = params.q
      ? (JSON.parse(params.q) as SearchQuery)
      : defaultParams.q;

    const aggFilters = map(
      dissoc('__typename'),
      params.aggFilters || []
    ) as AggFilterInput[];
    const crowdAggFilters = map(
      dissoc('__typename'),
      params.crowdAggFilters || []
    ) as AggFilterInput[];
    const sorts = map(dissoc('__typename'), params.sorts || []) as SortInput[];
    return {
      aggFilters,
      crowdAggFilters,
      sorts,
      q,
      //page and pageSize no longer exists since it was removed from the shortlink hash
      //defaulting to page 0 and defaultPageSize(100) to recieve the first 100 results for
      page: 0,
      pageSize: defaultPageSize,
    };
  };

  const dataParams = searchParamsFromQuery(
    searchParams,
    presentSiteView
  );
  searchParamsCurrent.current= dataParams;
  if(!data || !searchParams){
    return <BeatLoader/>
  }
  return (
    <>
          <SaveSearch
            params={searchParamsCurrent}
            user={user}
            siteView={presentSiteView}
            searchHash={hash}
          />
    </>
  );
}
export default SaveSearchIsland;