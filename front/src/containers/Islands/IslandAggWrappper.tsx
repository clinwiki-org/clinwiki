import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';
import IslandAggChild  from './IslandAggChild'

interface Props {
  aggId?: string;
}

function IslandAggWrapper(props: Props) {
  const { aggId } = props;



  const data = useSelector((state: RootState) => state.search.searchResults); 
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const searchParams = data?.data?.searchParams;



  if (!searchParams || !aggId || !islandConfig ) {
    return <BeatLoader />
  }

  return (
    <IslandAggChild
    aggId={props.aggId}
    />
  );
}
export default IslandAggWrapper;