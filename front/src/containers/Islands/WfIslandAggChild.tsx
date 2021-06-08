import React, { useState, useEffect, useRef } from 'react';
import SortKind from 'containers/AggDropDown/SortKind';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';
import { fetchSuggestedLabels, upsertLabelMutation, deleteLabelMutation, setShowLoginModal } from '../../services/study/actions'
import { insertCrowdKeyValueId, deleteCrowdKeyValueId } from '../../services/crowdKeys/actions'

interface Props {
  aggId?: string;
  nctId: string;
}

function WfIslandAggChild(props: Props) {

  const { aggId, nctId } = props;
  const dispatch = useDispatch();
  const emptySet = new Set();

  const isLoading = useSelector((state: RootState) => state.study.isFetchingSuggestedLables);
  const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const user = useSelector((state: RootState) => state.user.current);
  const isUpsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel)


  let getCurrentAgg = () => {
    let jsonConfig = islandConfig
    return aggId && jsonConfig[aggId]
  }
  let currentAgg = getCurrentAgg();


  if (isLoading || !currentAgg) return <BeatLoader />;
  // if (error) return <Error message={error.message} />;
  if (!suggestedLabels) return <BeatLoader />;
  const crowdKeyValueData = suggestedLabels.data.crowd_key_value_ids
//Believe this needs some work. Values being carried over
  let selectedCrowdValues = crowdKeyValueData.reduce((x, y, index) => ({ ...x, [index]: y.crowd_value }), {});

  //console.log("🚀 ~ WfIslandAggChild ~ selectedCrowdValues", selectedCrowdValues);

  let selectedValues = Object.values(selectedCrowdValues);
  const checkedValues = new Set(
    selectedValues
  );

  const handleSelect = (key, value) => {
    if (!user || isUpsertingLabel) {
      !user && dispatch(setShowLoginModal(true))
      return console.log(!user ? "Sorry, must be logged in to do this" : "Sorry still upserting")
    }
    // console.log(checkedValues)
    let checked = checkedValues.has(key)
    // console.log("checked", checked)
    if (!checked) {
      // console.log(value, !value)
      if (!value) return;
      let val = value;
      // console.log(meta[currentAgg?.name])
      dispatch(insertCrowdKeyValueId(props.nctId, key, currentAgg.name, user.id, false, false))

      // console.log(nctId, currentAgg?.name, key)
    } else {
      dispatch(deleteCrowdKeyValueId(props.nctId, key, currentAgg.name))
    }
  }
  let filteredArray = suggestedLabels.data.crowd_keys.filter(x=> x.crowd_key == currentAgg.name);
  const currentAggBucketsData = filteredArray[0].crowd_value !==0 ?  filteredArray[0].crowd_values : [];

  let currentAggBuckets = [];
  //@ts-ignore
  currentAggBucketsData.map(a => currentAggBuckets.push({ "key": a.crowd_value, "docCount": null }));
  // console.log("🚀 ~ WfIslandAggChild ~ currentAggBuckets!!!!!!!!", currentAggBuckets);

  const handleContainerToggle = () => {
    if (aggId) {
      islandConfig[aggId].defaultToOpen = !islandConfig[aggId].defaultToOpen
    }
  }
  //console.log(currentAgg)
  return (
    <>
      <CustomDropDown
        buckets={currentAggBuckets || []}
        isPresearch={true}
        selectedKeys={checkedValues || emptySet}
        field={currentAgg}
        onContainerToggle={() => handleContainerToggle()}
        handleLoadMore={() => console.log("Hi")}
        hasMore={false}
        onCheckBoxToggle={handleSelect}
        handleSelectAll={() => console.log("Hi")}
        filter={''}
        desc={true}
        sortKind={SortKind.Alpha}
        selectAll={() => console.log("Hi")}
        checkSelect={() => console.log("Hi")}
        checkboxValue={false}
        removeSelectAll={() => console.log("Hi")}
        showLabel={false}
        handleFilterChange={() => console.log("Hi")}
        toggleAlphaSort={() => console.log("Hi")}
        toggleNumericSort={() => console.log("Hi")}
        setShowLabel={() => console.log("Hi")}
        isOpen={true}
        fromAggField={false}
        disabled={!user || isUpsertingLabel}
      />
    </>
  );
}
export default WfIslandAggChild;