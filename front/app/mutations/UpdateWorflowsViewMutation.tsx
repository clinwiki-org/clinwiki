import * as React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  UpdateWorkflowsViewMutation as UpdateWorkflowsViewMutationType,
  UpdateWorkflowsViewMutationVariables,
} from 'types/UpdateWorkflowsViewMutation';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider';

interface UpdateWorkflowsViewMutationProps {
  children: (
    mutate: UpdateWorkflowsViewMutationFn,
    result: MutationResult<UpdateWorkflowsViewMutationType>
  ) => React.ReactNode;
  onCompleted?: (data: UpdateWorkflowsViewMutationType) => void;
  onError?: (e: ApolloError) => void;
}

const UPDATE_WORKFLOWS_VIEW_MUTATION = gql`
  mutation UpdateWorkflowsViewMutation($input: UpdateWorkflowsViewInput!) {
    updateWorkflowsView(input: $input) {
      workflowsView {
        ...WorkflowsViewFragment
      }
      errors
    }
  }

  ${WorkflowsViewProvider.fragment}
`;

class UpdateWorkflowsViewMutationComponent extends Mutation<
  UpdateWorkflowsViewMutationType,
  UpdateWorkflowsViewMutationVariables
> {}
export type UpdateWorkflowsViewMutationFn = MutationFn<
  UpdateWorkflowsViewMutationType,
  UpdateWorkflowsViewMutationVariables
>;

class UpdateWorkflowsViewMutation extends React.PureComponent<
  UpdateWorkflowsViewMutationProps
> {
  render() {
    return (
      <UpdateWorkflowsViewMutationComponent
        mutation={UPDATE_WORKFLOWS_VIEW_MUTATION}
        onCompleted={this.props.onCompleted}
        onError={this.props.onError}>
        {this.props.children}
      </UpdateWorkflowsViewMutationComponent>
    );
  }
}

export default UpdateWorkflowsViewMutation;
