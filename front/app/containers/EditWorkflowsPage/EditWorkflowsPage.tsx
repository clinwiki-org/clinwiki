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
import ThemedButton from 'components/StyledComponents';
import { MutationSource } from 'containers/SearchPage/shared';

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
    workflowsView: WorkflowsViewFragment
  ): WorkflowsViewFragment => {
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

  handleAddMutations = (workflowView: WorkflowsViewFragment) => (
    ee: MutationSource[]
  ) => {
    let mutations: SiteViewMutationInput[] = [];
    let view = this.applyMutations(workflowView);
    for (const e of ee) {
      const { name, value } = e.currentTarget;
      const mut = createMutation(name, value);
      const currentValue = getViewValueByPath(mut.path, view);
      // If a mutation would have no do not apply it
      if (mut.operation != 'SET' || !equals(mut.payload, currentValue)) {
        view = updateView(view, [mut]);
        mutations.push(mut);
      }
    }
    this.setState({ mutations: [...this.state.mutations, ...mutations] });
  };

  handleAddMutation = (workflowView: WorkflowsViewFragment) => (
    e: MutationSource
  ) => {
    this.handleAddMutations(workflowView)([e]);
  };

  render() {
    return (
      <WorkflowsViewProvider>
        {rawWorkflowsView => {
          if (
            !this.state.currentWorkflowName &&
            rawWorkflowsView.workflows &&
            rawWorkflowsView.workflows.length > 0
          ) {
            this.setState({
              currentWorkflowName: rawWorkflowsView.workflows[0].name,
            });
            return null;
          }

          const workflowsView = this.applyMutations(rawWorkflowsView);

          const workflow = find(
            propEq('name', this.state.currentWorkflowName),
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
                      activeKey={this.state.currentWorkflowName}
                      onSelect={this.handleWorkflowSelect}>
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
                        onAddMutations={this.handleAddMutations(workflowsView)}
                      />
                      <UpdateWorkflowsViewMutation>
                        {updateWorflowsView => (
                          <ThemedButton
                            style={{ marginTop: 15 }}
                            onClick={this.handleSave(updateWorflowsView)}>
                            Save
                          </ThemedButton>
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
