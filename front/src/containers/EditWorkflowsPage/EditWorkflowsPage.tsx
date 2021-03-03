import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';
import { Row, Col, Nav, NavItem, Panel } from 'react-bootstrap';
import { find, propEq, equals } from 'ramda';
import WorkflowForm from './WorkflowForm';
import { SiteViewMutationInput } from 'types/globalTypes';
import {
  createMutation,
  updateView,
  getViewValueByPath,
  serializeMutation,
} from 'utils/siteViewUpdater';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import ThemedButton from 'components/StyledComponents';
import { MutationSource } from 'containers/SearchPage/shared';
import { fetchAllWorkFlows, updateWorkflowPage } from 'services/study/actions';
import { BeatLoader } from 'react-spinners';

interface EditWorkflowsPageProps {
  fetchAllWorkFlows: any;
  allWorkflows: any;
}

const Container = styled.div`
  padding: 15px;
`;

const StyledPanel = styled(Panel)`
  padding: 15px;
`;

function EditWorkflowsPage(props: EditWorkflowsPageProps) {
const [currentWorkFlowName, setCurrentWorkFlowName] = useState("");
const [mutations, setMutations] = useState([]);
const allWorkflows = useSelector((state: RootState) => state.study.allWorkFlows);
const isFetchingWorkflows = useSelector((state: RootState) => state.study.isFetchingAllWorkFlows);

const dispatch = useDispatch();
useEffect(()=>{

  dispatch(fetchAllWorkFlows())
}, [dispatch])

  const applyMutations = (
    workflowsView: WorkflowsViewFragment
  ): WorkflowsViewFragment => {
    return updateView(workflowsView, mutations);
  };

  const handleSave = () => () => {
    dispatch(updateWorkflowPage({
        input: { mutations: mutations.map(serializeMutation) },
    }));
  };

  const handleWorkflowSelect = (workflow: string) => {
    setCurrentWorkFlowName(workflow);
  };

  const handleAddMutations = (workflowView: WorkflowsViewFragment) => (
    ee: MutationSource[]
  ) => {
    let mutations = [];
    let view = applyMutations(workflowView);
    for (const e of ee) {
      const { name, value } = e.currentTarget;
      const mut = createMutation(name, value);
      const currentValue = getViewValueByPath(mut.path, view);
      // If a mutation would have no do not apply it
      if (mut.operation !== 'SET' || !equals(mut.payload, currentValue)) {
        view = updateView(view, [mut]);
        //@ts-ignore
        mutations.push(mut);
      }
    }
    setMutations([...mutations, ...mutations]);
  };

  const handleAddMutation = (workflowView: WorkflowsViewFragment) => (
    e: MutationSource
  ) => {
    handleAddMutations(workflowView)([e]);
  };

    if(!allWorkflows || isFetchingWorkflows){
      return <BeatLoader/>
    }
    const rawWorkflowsView = allWorkflows?.data?.workflowsView

    if (
            !currentWorkFlowName &&
            rawWorkflowsView.workflows &&
            rawWorkflowsView.workflows.length > 0
            && !isFetchingWorkflows
          ) {
            setCurrentWorkFlowName(rawWorkflowsView.workflows[0].name);
            return null;
          }

          const workflowsView = applyMutations(rawWorkflowsView);

          const workflow = find(
            propEq('name', currentWorkFlowName),
            workflowsView.workflows
          ) as WorkflowConfigFragment;

          if (workflow == null)
            return (
              <Container>
                <Row>No Workflows</Row>
              </Container>
            );
          else
            return (
              <Container>
                <Row>
                  <Col md={2}>
                    <Nav
                      bsStyle="pills"
                      stacked
                      activeKey={currentWorkFlowName}
                      onSelect={handleWorkflowSelect}>
                      {workflowsView.workflows.map(workflow => (
                        <NavItem key={workflow.name} eventKey={workflow.name}>
                          {workflow.name}
                        </NavItem>
                      ))}
                    </Nav>
                  </Col>
                  <Col md={10}>
                    <StyledPanel>
                      <WorkflowForm
                        workflow={workflow}
                        onAddMutations={handleAddMutations(workflowsView)}
                      />
                          <ThemedButton
                            style={{ marginTop: 15 }}
                            onClick={handleSave()}>
                            Save
                          </ThemedButton>
                    </StyledPanel>
                  </Col>
                </Row>
              </Container>
            );
}

export default EditWorkflowsPage;
