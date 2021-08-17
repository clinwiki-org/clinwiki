import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BeatLoader } from 'react-spinners';
import { RootState } from 'reducers';
import WfIslandAggChild from './WfIslandAggChild'
import { fetchIslandConfig } from 'services/search/actions'
import { fetchWorkFlowPage } from 'services/study/actions';

interface Props {
  aggId?: string;
  context?: any;

}

function IslandAggWrapper(props: Props) {
  const { aggId, context } = props;
  const dispatch = useDispatch();

  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const isFetchingFacetConfig = useSelector((state: RootState) => state.search.isFetchingFacetConfig);
  const isFetchingSearchParams = useSelector((state: RootState) => state.search.isFetchingSearchParams);
  const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);

  // useEffect(() => {  //! No Rails
  //   dispatch(fetchWorkFlowPage( nctId || "" ));
  //   }, [dispatch, nctId])


  useEffect(() => {
    !islandConfig && !isFetchingFacetConfig && !isFetchingSearchParams && dispatch(fetchIslandConfig());
  }, [dispatch, islandConfig]);

  if (!aggId || !islandConfig || !suggestedLabels) {
    return <BeatLoader />
  }

  //console.log("suggestedLabels", suggestedLabels)
  return (
    <WfIslandAggChild
      aggId={props.aggId}
      documentId={context?.nct_id ||context?.condition_id || ""}
      suggestedLabels={suggestedLabels}
    />
  );
}
export default IslandAggWrapper;