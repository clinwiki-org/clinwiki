import React, { useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router-dom';
import useUrlParams from 'utils/UrlParamsProvider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchParams, updateSearchParamsAction } from 'services/search/actions'
import { RootState } from 'reducers';
import { SearchQuery, SearchParams } from '../SearchPage/shared';
import {  SortInput } from 'types/globalTypes';
import aggToField from 'utils/aggs/aggToField';
import { MenuItem, DropdownButton } from 'react-bootstrap';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import { snakeCase } from 'utils/helpers';

import {
  AggBucket,
  AggCallback,
  AggregateAggCallback,
  AggKind,
  maskAgg,
  defaultPageSize
} from '../SearchPage/Types';

import {  map, dissoc, over, lensProp } from 'ramda';
import { BeatLoader } from 'react-spinners';
import { AggFilterInput } from 'types/globalTypes';
import {
  SearchPageParamsQuery_searchParams,
} from '../../services/search/model/SearchPageParamsQuery';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';
import * as FontAwesome from 'react-fontawesome';

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

function ResultSort(props: Props) {
  const theme = useTheme();
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
  const changeSorted = (sorts: [SortInput], params: SearchParams) => {
    const idSortedLens = lensProp('id');
    const snakeSorts = map(over(idSortedLens, snakeCase), sorts);
    const afterParams = { ...params, sorts: snakeSorts, page: 0 }
    return afterParams;
  };
  const sortHelper = (sorts) => {
    const newParams = () => changeSorted(sorts, searchParamsCurrent.current)
    dispatch(updateSearchParamsAction(newParams()));
  };
  const sortField = () => {
    if (searchParamsCurrent.current.sorts.length > 0) {
      return aggToField(
        searchParamsCurrent.current.sorts[0].id,
        searchParamsCurrent.current.sorts[0].id
      );
    }
    return ' ';
  };
  const reverseSort = () => {
    let desc = searchParamsCurrent.current.sorts[0].desc;
    let newSort: [SortInput] = [
      { id: searchParamsCurrent.current.sorts[0].id, desc: !desc },
    ];
    const newParams = () => changeSorted(newSort, searchParamsCurrent.current)
    dispatch(updateSearchParamsAction(newParams()));
  };
  const renderSortIcons = () => {
    let isDesc = searchParamsCurrent.current.sorts[0].desc;
    return (
      <div
        onClick={() => reverseSort()}
        style={{ display: 'flex', cursor: 'pointer' }}>
        {isDesc ? (
          <FontAwesome
            name={'sort-amount-desc'}
            style={{ color: theme && theme.button, fontSize: '26px' }}
          />
        ) : (
            <FontAwesome
              name={'sort-amount-asc'}
              style={{ color: theme && theme.button, fontSize: '26px' }}
            />
          )}
      </div>
    );
  };
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto' }}>
        <div style={{ display: 'flex' }}>
          <DropdownButton
            bsStyle="default"
            title={`Sort by: ${sortField()}`}
            key="default"
            id="dropdown-basic-default"
            style={{
              width: '200px',
              background: theme && theme.button,
            }}>
            {presentSiteView.search.sortables.map((field, index) => {
              let sorts = [{ id: field, desc: false }];
              return (
                <MenuItem
                  key={field + index}
                  name={field}
                  onClick={() => sortHelper(sorts)}>
                  {aggToField(field, field)}
                </MenuItem>
              );
            })}
          </DropdownButton>
          {sortField() !== ' ' ? renderSortIcons() : null}
        </div>
      </div>
    </>
  );
}
export default ResultSort;