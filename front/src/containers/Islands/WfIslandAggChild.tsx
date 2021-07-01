import * as FontAwesome from 'react-fontawesome';

import { FormControl, Panel } from 'react-bootstrap';
// import aggToField from 'utils/aggs/aggToField';
// import { capitalize } from 'utils/helpers';
import {
  PresearchTitle,
  ThemedPresearchHeader,
} from 'components/StyledComponents';
import React, { useEffect, useRef, useState } from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';
import { deleteCrowdKeyValueId, insertCrowdKeyValueId } from '../../services/crowdKeys/actions'
import { deleteLabelMutation, fetchSuggestedLabels, setShowLoginModal, upsertLabelMutation } from '../../services/study/actions'
import { useDispatch, useSelector } from 'react-redux';

import { BeatLoader } from 'react-spinners';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { RootState } from 'reducers';
import SortKind from 'containers/AggDropDown/SortKind';
import ThemedButton from 'components/StyledComponents/index';

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

  const [editorText, setEditorText] = useState('EDITOR Text!');

  let getCurrentAgg = () => {
    let jsonConfig = islandConfig
    return aggId && jsonConfig[aggId]
  }
  let currentAgg = getCurrentAgg();


  if (isLoading || !currentAgg) return <BeatLoader />;
  // if (error) return <Error message={error.message} />;
  if (!suggestedLabels) return <BeatLoader />;
  const crowdKeyValueData = suggestedLabels?.data?.crowd_key_value_ids.filter(x => x.crowd_key == currentAgg.name) || [];
  //Believe this needs some work. Values being carried over
  let selectedCrowdValues = crowdKeyValueData.reduce((x, y, index) => ({ ...x, [index]: y.crowd_value }), {});

  // console.log("🚀 ~ WfIslandAggChild ~ selectedCrowdValues", selectedCrowdValues);

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
  let filteredArray = suggestedLabels?.data?.crowd_keys.filter(x => x.crowd_key == currentAgg.name);
  const currentAggBucketsData = filteredArray && filteredArray[0] ? filteredArray[0].crowd_values : [];

  let currentAggBuckets = [];
  //@ts-ignore
  currentAggBucketsData.map(a => currentAggBuckets.push({ "key": a.crowd_value, "docCount": null }));
  // console.log("🚀 ~ WfIslandAggChild ~ currentAggBuckets!!!!!!!!", currentAggBuckets);

  const handleContainerToggle = () => {
    if (aggId) {
      islandConfig[aggId].defaultToOpen = !islandConfig[aggId].defaultToOpen
    }
  }

  const handleEditorText = (e: any) => {
    setEditorText(e.currentTarget.value);
  };

  const handleEditSubmit = () => {
    console.log("EDIT!!!!!!!!!!!")
    let content = editorText;

    //   dispatch(updateCrowdKeyValueId(props.nctId, key, currentAgg.name))

  };

  if (currentAgg.display === "TEXT_EDITOR") {
    console.log("🚀 ~ WfIslandAggChild ~ currentAgg", currentAgg);

    let configuredLabel = currentAgg?.displayName || '';
    //const ThemedTitle = isPresearch ? PresearchTitle : ThemedFacetTitle


    return (

      <Panel>
        <ThemedPresearchHeader>
          <PresearchTitle style={{ textAlign: "center" }} >

            {configuredLabel.toUpperCase()}
          </PresearchTitle>
        </ThemedPresearchHeader>
        <Panel.Body>
          <FormControl
            style={{ minHeight: '150px', maxWidth: "auto" }}
            componentClass="textarea"
            defaultValue={editorText || ''}
            onChange={handleEditorText}
          />
        </Panel.Body>
        <ThemedButton
          onClick={() => { handleEditSubmit(); }}
          //disabled={editorTextState === editorTextData}
          style={{ margin: '7px' }}>
          Save <FontAwesome name="save" />
        </ThemedButton>
      </Panel>


    )
  }

  // <Panel>
  //   <Panel.Body>
  //     <RichTextEditor
  //       //readOnly={readOnly}
  //       onChange={handleRichEditorChange}
  //       value={richEditorText || RichTextEditor.createEmptyValue()}
  //     />
  //   </Panel.Body>
  // </Panel>

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