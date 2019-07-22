import * as React from 'react';
import styled from 'styled-components';
import { Row, Col, Nav, NavItem, Panel, Button } from 'react-bootstrap';
import { find, propEq, equals } from 'ramda';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider/WorkflowsViewProvider';
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
import UpdateWorkflowsViewMutation, {
  UpdateWorkflowsViewMutationFn,
} from 'mutations/UpdateWorflowsViewMutation';

interface EditWorkflowsPageProps {}
interface EditWorkflowsPageState {
  currentWorkflowName: string | null;
  mutations: SiteViewMutationInput[];
}

const Container = styled.div`
  padding: 15px;
`;

const StyledPanel = styled(Panel)`
  padding: 15px;
`;

class EditWorkflowsPage extends React.Component<
  EditWorkflowsPageProps,
  EditWorkflowsPageState
> {
  state: EditWorkflowsPageState = { currentWorkflowName: null, mutations: [] };

  applyMutations = (
    workflowsView: WorkflowsViewFragment,
  ): WorkflowsViewFragment => {
    // @ts-ignore
    return updateView(workflowsView, this.state.mutations);
  };

  handleSave = (updateWorkflowsView: UpdateWorkflowsViewMutationFn) => () => {
    updateWorkflowsView({
      variables: {
        input: { mutations: this.state.mutations.map(serializeMutation) },
      },
    });
  };

  handleWorkflowSelect = (workflow: string) => {
    this.setState({ currentWorkflowName: workflow });
  };

  handleAddMutation = (workflowView: WorkflowsViewFragment) => (e: {
    currentTarget: { name: string; value: any };
  }) => {
    const { name, value } = e.currentTarget;
    const mutation = createMutation(name, value);
    const view = this.applyMutations(workflowView);
    // @ts-ignore
    const currentValue = getViewValueByPath(mutation.path, view);
    if (equals(value, currentValue)) return;
    this.setState({ mutations: [...this.state.mutations, mutation] });
  };

  render() {
    return (
      <WorkflowsViewProvider>
        {rawWorkflowsView => {
          if (!this.state.currentWorkflowName) {
            this.setState({
              currentWorkflowName: rawWorkflowsView.workflows[0].name,
            });
            return null;
          }

          const workflowsView = this.applyMutations(rawWorkflowsView);

          const workflow = find(
            propEq('name', this.state.currentWorkflowName),
            workflowsView.workflows,
          ) as WorkflowConfigFragment;
          console.log(this.state.currentWorkflowName, workflow);

          return (
            <Container>
              <Row>
                <Col md={2}>
                  <Nav
                    bsStyle="pills"
                    stacked
                    activeKey={this.state.currentWorkflowName}
                    onSelect={this.handleWorkflowSelect}
                  >
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
                      onAddMutation={this.handleAddMutation(workflowsView)}
                    />
                    <UpdateWorkflowsViewMutation>
                      {updateWorflowsView => (
                        <Button
                          style={{ marginTop: 15 }}
                          onClick={this.handleSave(updateWorflowsView)}
                        >
                          Save
                        </Button>
                      )}
                    </UpdateWorkflowsViewMutation>
                  </StyledPanel>
                </Col>
              </Row>
            </Container>
          );
        }}
      </WorkflowsViewProvider>
    );
  }
}

export default EditWorkflowsPage;
