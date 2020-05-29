import * as React from 'react';
import { gql } from 'apollo-boost';
import {
  Mutation,
  MutationComponentOptions,
  MutationFunction,
  MutationResult,
} from 'react-apollo';
import {
  DeleteSiteViewMutation as DeleteSiteViewMutationType,
  DeleteSiteViewMutationVariables,
} from 'types/DeleteSiteViewMutation';

interface DeleteSiteViewMutationProps {
  children: (
    mutate: DeleteSiteViewMutationFn,
    result: MutationResult<DeleteSiteViewMutationType>
  ) => JSX.Element;
}

const DELETE_SITE_VIEW_MUTATION = gql`
  mutation DeleteSiteViewMutation($input: DeleteSiteViewInput!) {
    deleteSiteView(input: $input) {
      siteView {
        name
        id
      }
      error
    }
  }
`;

const DeleteSiteViewMutationComponent = (
  props: MutationComponentOptions<
    DeleteSiteViewMutationType,
    DeleteSiteViewMutationVariables
  >
) => Mutation(props);
export type DeleteSiteViewMutationFn = MutationFunction<
  DeleteSiteViewMutationType,
  DeleteSiteViewMutationVariables
>;

class DeleteSiteViewMutation extends React.PureComponent<
  DeleteSiteViewMutationProps
> {
  render() {
    return (
      <DeleteSiteViewMutationComponent mutation={DELETE_SITE_VIEW_MUTATION}>
        {this.props.children}
      </DeleteSiteViewMutationComponent>
    );
  }
}

export default DeleteSiteViewMutation;
