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
import { deleteCrowdKeyValueId, insertCrowdKeyValueId, updateCrowdKeyValueId } from '../../services/crowdKeys/actions'
import { deleteLabelMutation, fetchSuggestedLabels, setShowLoginModal, upsertLabelMutation } from '../../services/study/actions'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';

import { BeatLoader } from 'react-spinners';
import { CurrentUserQuery_me } from 'services/user/model/CurrentUserQuery';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import HtmlToReact from 'html-to-react';
import { RootState } from 'reducers';
import SortKind from 'containers/AggDropDown/SortKind';
import ThemedButton from 'components/StyledComponents/index';
import styled from 'styled-components';

interface Props {
  aggId?: string;
  nctId: string;
  suggestedLabels: any;
}

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

function WfIslandAggChild(props: Props) {

  let match = useRouteMatch();
  let history = useHistory();
  const params = useUrlParams();

  const { aggId, nctId, suggestedLabels } = props;
  const dispatch = useDispatch();
  const emptySet = new Set();

  const isLoading = useSelector((state: RootState) => state.study.isFetchingSuggestedLables);
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const user = useSelector((state: RootState) => state.user.current);
  const isUpsertingLabel = useSelector((state: RootState) => state.study.isUpsertingLabel)

  let getCurrentAgg = () => {
    let jsonConfig = islandConfig
    return aggId && jsonConfig[aggId]
  }
  let currentAgg = getCurrentAgg();

  const crowdKeyValueData = suggestedLabels?.data?.crowd_key_value_ids.filter(x => x.crowd_key == currentAgg.name) || [];
  let crowdKeyValueTitle = null;

  if (currentAgg?.display === "TEXT_EDITOR" && crowdKeyValueData.length > 0) {
    crowdKeyValueTitle = crowdKeyValueData[0].crowd_value
  }

  const [editorText, setEditorText] = useState(crowdKeyValueTitle ? crowdKeyValueTitle : "Enter title value");
  const [richEditorText, setRichEditorText] = useState(RichTextEditor.createValueFromString(editorText, 'markdown'));
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    if (currentAgg?.display === "TEXT_EDITOR" && crowdKeyValueData.length > 0) {
      // setEditorText(crowdKeyValueData[0].crowd_value)
      setRichEditorText(RichTextEditor.createValueFromString(crowdKeyValueData[0].crowd_value, 'markdown'));
    }
  }, [suggestedLabels]);

  if (isLoading || !currentAgg) return <BeatLoader />;
  // if (error) return <Error message={error.message} />;

  // if (!suggestedLabels) return <BeatLoader />;
  // const crowdKeyValueData = suggestedLabels?.data?.crowd_key_value_ids.filter(x => x.crowd_key == currentAgg.name) || [];

  //Believe this needs some work. Values being carried over
  let selectedCrowdValues = crowdKeyValueData.reduce((x, y, index) => ({ ...x, [index]: y.crowd_value }), {});

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
  currentAggBucketsData.map(a => currentAggBuckets.push({ "key": a.crowd_value, "docCount": null, "crowd_value_helper_text": a.crowd_value_helper_text }));

  const handleContainerToggle = () => {
    if (aggId) {
      islandConfig[aggId].defaultToOpen = !islandConfig[aggId].defaultToOpen
    }
  }

  const handleEditorText = (e: any) => {
    setEditorText(e.currentTarget.value);
    //console.log(editorText)
  };

  const handleRichEditorChange = (richEditorText: EditorValue) => {
    setRichEditorText(richEditorText);
  };

  const handleEdit = () => {
    setIsEditing(true)
  };

  const handleEditSubmit = () => {
    let rteText = richEditorText.toString('markdown');
    if (!user || isUpsertingLabel) {
      setIsEditing(false)
      !user && dispatch(setShowLoginModal(true))
      return console.log(!user ? "Sorry, must be logged in to do this" : "Sorry still saving value")
    }
    if (crowdKeyValueData.length === 1) {
      let idToUpdate = crowdKeyValueData[0].id
      //let updatedContent = richEditorText//.toString('markdown');
      dispatch(updateCrowdKeyValueId(idToUpdate, rteText, props.nctId))
      setIsEditing(false)

      return;
    }
    dispatch(insertCrowdKeyValueId(props.nctId, rteText, currentAgg.name, user.id, false, false))
    setIsEditing(false)
  };

  const handleCancelEdit = () => {
    setIsEditing(false)
    //history.push(`${match.url}${queryStringAll(params)}`);
  };


  const parser = new HtmlToReact.Parser();

  const renderToolbar = (
    user: CurrentUserQuery_me | null | undefined,
    isEditing: boolean
  ) => {
    const isAuthenticated = user !== null;
    if (!isAuthenticated) return false;
    //const editorTextState = getEditorText();
    // const editorTextData =
    //   data && data.wiki_pages[0] && data.wiki_pages[0].text // data.study && data.study.wikiPage && data.study.wikiPage.content;

    let editMessage = `Changes not saved. Are you sure you want to leave while editing?`;
    return (
      <Toolbar>
        {isEditing ?
          <div>
            <ThemedButton
              onClick={() => { editMessage = "Save changes?"; handleCancelEdit(); }}
              style={{ marginLeft: '10px', background: 'white', color: '#6BA5D6', border: "1px solid #6BA5D6" }}>
              Cancel <FontAwesome name="X" />
            </ThemedButton>
            <ThemedButton
              onClick={() => { editMessage = "Save changes?"; handleEditSubmit(); }}
              // disabled={editorTextState === editorTextData}
              style={{ marginLeft: '10px' }}>
              Save <FontAwesome name="pencil" />
            </ThemedButton>
          </div> :
          <div>
            <ThemedButton
              type="button"
              onClick={isAuthenticated ? () => handleEdit() : () => setShowLoginModal(true)}
              style={{ marginLeft: '10px' }}>
              Edit <FontAwesome name="edit" />
            </ThemedButton>
          </div>
        }



      </Toolbar>
    );
  };

  if (currentAgg?.display === "TEXT_EDITOR") {
    let editorValue = editorText;
    if (currentAgg?.display === "TEXT_EDITOR" && crowdKeyValueData.length > 0) {
      // setEditorText(crowdKeyValueData[0].crowd_value)
      editorValue = crowdKeyValueData[0].crowd_value
    }

    let configuredLabel = currentAgg?.displayName || '';
    //const ThemedTitle = isPresearch ? PresearchTitle : ThemedFacetTitle
    //const rteText = RichTextEditor.createValueFromString(editorValue, 'markdown');

    const reactElement = parser.parse(configuredLabel)

    //OLD { configuredLabel.toUpperCase() }

    return (
      <Panel>
        <ThemedPresearchHeader>
          <PresearchTitle style={{ textAlign: "center" }} >
            {reactElement}


          </PresearchTitle>
        </ThemedPresearchHeader>
        <Panel.Body>
          <RichTextEditor
            //readOnly={!user}
            readOnly={!isEditing}
            onChange={handleRichEditorChange}
            value={richEditorText || RichTextEditor.createEmptyValue()}
          />
          {/* <FormControl
            style={{ minHeight: '150px', maxWidth: "auto" }}
            componentClass="textarea"
            defaultValue={editorValue || ''}
            onChange={handleEditorText}
            disabled={!user}
          /> */}
        </Panel.Body>

        {renderToolbar(user, isEditing)}


        {/* <ThemedButton
          onClick={() => { handleEditSubmit(); }}
          disabled={!user} //{editorTextState === editorTextData}
          style={{ margin: '7px' }}>
          Save <FontAwesome name="save" />
        </ThemedButton> */}

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