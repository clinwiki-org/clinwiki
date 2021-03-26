import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import useUrlParams from 'utils/UrlParamsProvider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchParams, fetchFacetConfig } from 'services/search/actions'
import { RootState } from 'reducers';
import { SearchParams } from '../SearchPage/shared';

import { defaultPageSize } from '../SearchPage/Types';
import { BeatLoader } from 'react-spinners';
import IslandAggChild  from './IslandAggChild'

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

function IslandAggWrapper(props: Props) {
  const { aggId } = props;
  const dispatch = useDispatch();
  const params = useUrlParams();
  const hash = params.hash



  const data = useSelector((state: RootState) => state.search.searchResults); 
  const facetConfig = useSelector((state: RootState) => state.search.facetConfig);
  const isFetchingFacetConfig = useSelector((state: RootState) => state.search.isFetchingFacetConfig);
  const isFetchingSearchParams = useSelector((state: RootState) => state.search.isFetchingSearchParams);
  const searchParams = data?.data?.searchParams;
  const match = useRouteMatch();

  useEffect(() => {
    match.path == "/search2/" && !data && !isFetchingSearchParams && !isFetchingFacetConfig && dispatch(fetchSearchParams(hash));
  }, [dispatch, hash]);

  useEffect(() => {
    !facetConfig &&  !isFetchingFacetConfig && !isFetchingSearchParams && dispatch(fetchFacetConfig());
  }, [dispatch, facetConfig]);

  if (!searchParams || !aggId || !facetConfig ) {
    return <BeatLoader />
  }
 
  return (
    <IslandAggChild
    aggId={props.aggId}
    />
  );
}
export default IslandAggWrapper;