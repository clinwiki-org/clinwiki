import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';
import WfIslandAggChild from './WfIslandAggChild'
import { fetchWorkFlowPage } from 'services/study/actions';
import { fetchIslandConfig } from 'services/search/actions'


interface Props {
  aggId?: string;
  nctId?: string;

}

function IslandAggWrapper(props: Props) {
  const { aggId, nctId } = props;
  const dispatch = useDispatch();

  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const isFetchingFacetConfig = useSelector((state: RootState) => state.search.isFetchingFacetConfig);
  const isFetchingSearchParams = useSelector((state: RootState) => state.search.isFetchingSearchParams);

  // useEffect(() => {  //! No Rails
  //   dispatch(fetchWorkFlowPage( nctId || "" ));
  //   }, [dispatch, nctId])


  useEffect(() => {
    !islandConfig && !isFetchingFacetConfig && !isFetchingSearchParams && dispatch(fetchIslandConfig());
  }, [dispatch, islandConfig]);

  if (!aggId || !islandConfig) {
    return <BeatLoader />
  }

  return (
    <WfIslandAggChild
      aggId={props.aggId}
      nctId={props.nctId || ""}
    />
  );
}
export default IslandAggWrapper;