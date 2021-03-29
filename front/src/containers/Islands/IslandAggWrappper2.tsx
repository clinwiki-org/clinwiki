import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import useUrlParams from 'utils/UrlParamsProvider';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';
import IslandAggChild2  from './IslandAggChild2'
import { fetchAllWorkFlows } from 'services/study/actions';
import { deleteLabelMutation, fetchWorkFlowPage, upsertLabelMutation } from 'services/study/actions';


interface Props {
  aggId?: string;
  nctId?: string;

}

function IslandAggWrapper(props: Props) {
  const { aggId, nctId } = props;
  const dispatch = useDispatch();
  const params = useUrlParams();
  const hash = params.hash



  const data = useSelector((state: RootState) => state.search.searchResults); 
  const allWorkFlows = useSelector((state:RootState)=> state.study.allWorkFlows)
  
  useEffect(() => {
    dispatch(fetchWorkFlowPage( nctId || "" ));
    }, [dispatch, nctId])


  useEffect(() => {
    dispatch(fetchAllWorkFlows());
  }, [dispatch, nctId])

  if (!allWorkFlows || !aggId  ) {
    return <BeatLoader />
  }
 
  return (
    <IslandAggChild2
    aggId={props.aggId}
    nctId={props.nctId || ""}
    />
  );
}
export default IslandAggWrapper;