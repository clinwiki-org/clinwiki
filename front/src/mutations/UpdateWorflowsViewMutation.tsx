import * as React from 'react';
import { ApolloError } from 'apollo-boost';
import {
  Mutation,
  MutationComponentOptions,
  MutationFunction,
  MutationResult,
} from 'react-apollo';
import {
  UpdateWorkflowsViewMutation as UpdateWorkflowsViewMutationType,
  UpdateWorkflowsViewMutationVariables,
} from 'types/UpdateWorkflowsViewMutation';
import { mutation } from 'queries/WorkflowsViewProviderquery';

interface UpdateWorkflowsViewMutationProps {
  children: (
    mutate: UpdateWorkflowsViewMutationFn,
    result: MutationResult<UpdateWorkflowsViewMutationType>
  ) => JSX.Element;
  onCompleted?: (data: UpdateWorkflowsViewMutationType) => void;
  onError?: (e: ApolloError) => void;
}

const UpdateWorkflowsViewMutationComponent = (
  props: MutationComponentOptions<
    UpdateWorkflowsViewMutationType,
    UpdateWorkflowsViewMutationVariables
  >
) => Mutation(props);
export type UpdateWorkflowsViewMutationFn = MutationFunction<
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
