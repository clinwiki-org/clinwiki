import * as React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  UpdateWorkflowsViewMutation as UpdateWorkflowsViewMutationType,
  UpdateWorkflowsViewMutationVariables,
} from 'types/UpdateWorkflowsViewMutation';
import { mutation } from 'queries/WorkflowsViewProviderquery'

interface UpdateWorkflowsViewMutationProps {
  children: (
    mutate: UpdateWorkflowsViewMutationFn,
    result: MutationResult<UpdateWorkflowsViewMutationType>
  ) => React.ReactNode;
  onCompleted?: (data: UpdateWorkflowsViewMutationType) => void;
  onError?: (e: ApolloError) => void;
}


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
        mutation={mutation}
        onCompleted={this.props.onCompleted}
        onError={this.props.onError}>
        {this.props.children}
      </UpdateWorkflowsViewMutationComponent>
    );
  }
}

export default UpdateWorkflowsViewMutation;
