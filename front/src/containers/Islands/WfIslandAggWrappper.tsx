import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import WfIslandAggChild from './WfIslandAggChild'
import { fetchIslandConfig } from 'services/search/actions'

interface Props {
  aggId?: string;
  nctId?: string;

}

function IslandAggWrapper(props: Props) {
  const { aggId } = props;
  const dispatch = useDispatch();

  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const isFetchingFacetConfig = useSelector((state: RootState) => state.search.isFetchingFacetConfig);
  const isFetchingSearchParams = useSelector((state: RootState) => state.search.isFetchingSearchParams);
  const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);



  useEffect(() => {
    !islandConfig && !isFetchingFacetConfig && !isFetchingSearchParams && dispatch(fetchIslandConfig(aggId));
  }, [dispatch, islandConfig]);

  if (!aggId || !islandConfig || !suggestedLabels) {
    return <BeatLoader />
  }

  return (
    <WfIslandAggChild
      aggId={props.aggId}
      nctId={props.nctId || ""}
      suggestedLabels={suggestedLabels}
    />
  );
}
export default IslandAggWrapper;