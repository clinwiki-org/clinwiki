import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import { useWorkflowsView } from 'containers/WorkflowsViewProvider/WorkflowsViewProvider';
import { displayFields } from 'utils/siteViewHelpers';
import * as R from 'remeda';
import { fromPairs } from 'ramda';
import {
  DELETE_LABEL_MUTATION,
  DeleteMutationFn,
} from 'mutations/CrowdPageDeleteWikiLabelMutation';
import {
  UPSERT_LABEL_MUTATION,
  UpsertMutationFn,
} from 'mutations/CrowdPageUpsertWikiLabelMutation';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import QUERY from 'queries/WorkflowPageQuery';
import { useQuery, useMutation } from '@apollo/client';
import { WorkflowPageQuery } from 'types/WorkflowPageQuery';
import SuggestedLabels from 'containers/WorkflowPage/SuggestedLabels';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import CrowdPage from 'containers/CrowdPage';
import { BeatLoader } from 'react-spinners';
import WorkFlowAnimation from '../StudyPage/components/StarAnimation';
import { deleteLabelMutation, fetchWorkFlowPage, upsertLabelMutation } from 'services/study/actions';


interface Props {
  name: string;
  nctId?: string;
  onChange:string;
}

const StyledPanel = styled(Panel)`
  padding: 16px;
`;

const handleSelect = (
  meta: {},
  nctId: string,
  upsertLabel: UpsertMutationFn,
  deleteLabel: DeleteMutationFn
) => (key: string, value: string, checked: boolean) => {
  console.log("META",meta)
  if (checked) {
    CrowdPage.addLabel(key, value, meta, nctId, upsertLabel);
  } else {
    CrowdPage.deleteLabel(key, value, meta, nctId, upsertLabel, deleteLabel);
  }
};

export default function WorkflowIsland(props: Props) {
  const { name, nctId } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: allWorkflows } = useWorkflowsView();
  const workflow = allWorkflows?.workflowsView.workflows.filter(
    wf => wf.name === name
  )?.[0];

  // TODO: This query should be pushed up as a fragment to the Page
  // const { data: studyData } = useQuery<WorkflowPageQuery>(QUERY, {
  //   variables: { nctId },
  // });

  useEffect(() => {
    dispatch(fetchWorkFlowPage( nctId || "" ));
    }, [dispatch])

  const studyData = useSelector((state: RootState) => state.study.workflowPage);
  const user = useSelector( (state: RootState) => state.user.current);
  // const [upsertMutation] = useMutation(UPSERT_LABEL_MUTATION, {
  //   refetchQueries: [{ query: QUERY, variables: { nctId } }],
  // });
  const upsertMutation = (action)=>{
    if(!action.variables.key) return
    return dispatch( upsertLabelMutation(action.variables.nctId,action.variables.key, action.variables.value ))}
  const [deleteMutation] = useMutation(DELETE_LABEL_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { nctId } }],
  });

  const [flashAnimation, setFlashAnimation] = useState(false);


  if (!workflow || !nctId || !studyData) return <BeatLoader />;

  const allowedSuggestedLabels = displayFields(
    workflow.suggestedLabelsFilter.kind,
    workflow.suggestedLabelsFilter.values,
    workflow.allSuggestedLabels.map(name => ({
      name,
      rank: null,
    }))
  ).map(R.prop('name'));

  const suggestedLabelsConfig = fromPairs(
    workflow.suggestedLabelsConfig.map(c => [c.name, c])
  );
  const resetHelper = ()=>{
    setFlashAnimation(false)
    //refetch()
    // props.onChange()
  }
  const handleResetAnimation=()=>{
    setTimeout(  resetHelper, 6500);
  }
  return (
  <>
    {flashAnimation == true? 
    <WorkFlowAnimation
      resetAnimation={handleResetAnimation}
      rankColor={theme? theme.button: 'default'}
    /> :null}
    <div>
      <StyledPanel>
        <SuggestedLabels
          nctId={nctId}
          onSelect={handleSelect(
            JSON.parse(studyData?.data.study?.wikiPage?.meta || '{}'),
            nctId,
          //@ts-ignore
            upsertMutation,
            deleteMutation
          )}
          allowedSuggestedLabels={allowedSuggestedLabels}
          suggestedLabelsConfig={suggestedLabelsConfig}
          disabled={!user}
          showAnimation={() =>
            setFlashAnimation(true)
          }
        />
      </StyledPanel>
    </div>
  </>
  );
}
