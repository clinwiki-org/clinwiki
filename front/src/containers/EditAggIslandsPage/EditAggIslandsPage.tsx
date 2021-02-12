import * as React from 'react';
import styled from 'styled-components';
import { Row, Col, Nav, NavItem, Panel } from 'react-bootstrap';
import { find, propEq, equals } from 'ramda';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider/WorkflowsViewProvider';
import EditIslandForm from './EditIslandForm';
import { SiteViewMutationInput } from 'types/globalTypes';
import {
  createMutation,
  updateView,
  getViewValueByPath,
  serializeMutation,
} from 'utils/siteViewUpdater';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import UpdateWorkflowsViewMutation, {
  UpdateWorkflowsViewMutationFn,
} from 'mutations/UpdateWorflowsViewMutation';
import ThemedButton from 'components/StyledComponents';
import { MutationSource } from 'containers/SearchPage/shared';

interface EditWorkflowsPageProps {}
interface EditWorkflowsPageState {
  currentAggName: string | null;
}

const Container = styled.div`
  padding: 15px;
`;

const StyledPanel = styled(Panel)`
  padding: 15px;
`;

function EditAggIslandsPage(props: EditWorkflowsPageProps) {
  // state: EditWorkflowsPageState = { currentAggName: null};
let aggs : any[]= [{name:"Status", id: 1}];
  if (aggs == null)
  return (
    <Container>
      <Row>No Aggs</Row>
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
            activeKey={ null}
            onSelect={()=>console.log("HI")}>
            {/* {workflowsView.workflows.map(workflow => (
              <NavItem key={workflow.name} eventKey={workflow.name}>
                {workflow.name}
              </NavItem>
            ))} */}

            {
            aggs.map(agg=>(
          <NavItem key={agg.name} eventKey={agg.name}>
          {agg.name}
        </NavItem>
            ))}

          </Nav>
        </Col>
        <Col md={10}>
          <StyledPanel>
          <div>Our Config goes here</div>
          {/* <EditIslandForm/> */}
                <ThemedButton
                  style={{ marginTop: 15 }}
                  onClick={()=>console.log("Save")}>
                  Save
                </ThemedButton>
              
          </StyledPanel>
        </Col>
      </Row>
    </Container>
  )
}

export default EditAggIslandsPage;
