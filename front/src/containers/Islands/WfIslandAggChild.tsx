import React, { useState, useEffect, useRef } from 'react';
import useUrlParams from 'utils/UrlParamsProvider';
import SortKind from 'containers/AggDropDown/SortKind';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';
import * as R from 'remeda';
import {
  pipe,
  map,
  fromPairs,
  keys,
  defaultTo,
  uniq,
  dissoc
} from 'ramda';
import {
  SuggestedLabelsQuery_crowdAggFacets_aggs,
} from 'services/study/model/SuggestedLabelsQuery';
import { displayFields } from 'utils/siteViewHelpers';
import { fetchSuggestedLabels, upsertLabelMutation, deleteLabelMutation, setShowLoginModal } from '../../services/study/actions'


interface Props {
  aggId?: string;
  nctId: string;

}

function WfIslandAggChild(props: Props) {


  const { aggId, nctId } = props;
  const dispatch = useDispatch();
  const params = useUrlParams();

    const emptySet = new Set();
    
    const isLoading = useSelector((state: RootState) => state.study.isFetchingSuggestedLables);
    const suggestedLabels = useSelector((state: RootState) => state.study.suggestedLabels);
    const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
    const user = useSelector( (state: RootState) => state.user.current);
    const isUpsertingLabel = useSelector((state:RootState) => state.study.isUpsertingLabel)


    let getCurrentAgg = () => {
      let jsonConfig = islandConfig
      return aggId && jsonConfig[aggId]
    }
    let currentAgg = getCurrentAgg();


  useEffect(() => {
  dispatch(fetchSuggestedLabels(nctId));
  }, [dispatch, nctId])

  if (isLoading || !currentAgg) return <BeatLoader />;
  // if (error) return <Error message={error.message} />;
  if (!suggestedLabels) return <BeatLoader/>;
  const data = suggestedLabels.data
  let meta: Record<string, string> = {};
  try {
    meta = JSON.parse(data.study?.wikiPage?.meta || '{}');
  } catch (e) {
    // console.log(`Error parsing meta: ${meta}`);
  }

  const labels = fromPairs(
    keys(meta).map(key => [key, meta[key].split('|')])
  );

  const aggs = pipe(
    map((agg: SuggestedLabelsQuery_crowdAggFacets_aggs) => {
      const name = agg.name.substring(3);
      const existingLabels = labels[name] || [];
      return [
        name,
        agg.buckets.map(bucket => {
          return [
            defaultTo(bucket.key)(bucket.keyAsString),
            existingLabels.includes(bucket.key),
          ];
        }),
      ];
    }),
    // @ts-ignore
    fromPairs
    // @ts-ignore
  )(data?.crowdAggFacets?.aggs || []);

  const checkedValues = new Set(
    aggs[currentAgg?.name].filter(([_, checked]) => checked).map(([value, _]) => value)
  );

  const handleSelect = (key, value) => {

    if(!user || isUpsertingLabel){
      !user && dispatch(setShowLoginModal(true))
      return console.log(!user ? "Sorry, must be logged in to do this": "Sorry still upserting")
    }
    // console.log(key, value)

    // console.log(suggestedLabels)
    const meta = JSON.parse(suggestedLabels.data.study?.wikiPage?.meta || '{}')
    // console.log(meta)

    // console.log(checkedValues)
    let checked = checkedValues.has(key)
    // console.log("checked", checked)
    if (!checked) {

      // console.log(value, !value)
      if (!value) return;
      let val = value;
      // console.log(meta[currentAgg?.name])
      if (meta[currentAgg?.name]) {
        const oldVal = meta[currentAgg?.name];
        const entries = oldVal.split('|').filter((x) => x !== val);
        entries.push(key);
        val = uniq(entries).join('|');
        // console.log("VAl", val)
        dispatch(upsertLabelMutation(nctId, currentAgg?.name, val));
      }else{
      //handles case where meta is empty 
        dispatch(upsertLabelMutation(nctId, currentAgg?.name, key));
      }


      // console.log(nctId, currentAgg?.name, key)



    } else {
      const currentValue = meta[currentAgg?.name];


      // console.log(currentValue)
      if (!currentValue) return null;

      const newValue = uniq(
        currentValue.split('|').filter((x) => x !== key)
      ).join('|');
      if (newValue.length === 0) {
        const newMeta = dissoc(key, meta);
        // console.log(currentAgg?.name, nctId)
        dispatch(deleteLabelMutation(nctId, currentAgg?.name));
      } else {
        // console.log(nctId, currentAgg?.name, newValue)

        dispatch(upsertLabelMutation(
          nctId, currentAgg?.name, newValue
        ));
      }
    }
  }
  // console.log(suggestedLabels.data.crowdAggFacets.aggs)

  const currentAggBuckets = suggestedLabels.data.crowdAggFacets.aggs.filter(
    fm => fm.name === `fm_${currentAgg?.name}`
  )?.[0];
  // console.log(currentAggBuckets)
  const handleContainerToggle =()=>{
    if(aggId){
      islandConfig[aggId].defaultToOpen = !islandConfig[aggId].defaultToOpen
    }
  }
  console.log(currentAgg)
  return (
    <>
      <CustomDropDown
        buckets={currentAggBuckets.buckets || []}
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