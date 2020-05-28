import * as React from 'react';
import { gql } from 'apollo-boost';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  DeleteSiteViewMutation as DeleteSiteViewMutationType,
  DeleteSiteViewMutationVariables,
} from 'types/DeleteSiteViewMutation';
import SiteProvider from '../containers/SiteProvider';

interface DeleteSiteViewMutationProps {
  children: (
    mutate: DeleteSiteViewMutationFn,
    result: MutationResult<DeleteSiteViewMutationType>
  ) => React.ReactNode;
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

class DeleteSiteViewMutationComponent extends Mutation<
  DeleteSiteViewMutationType,
  DeleteSiteViewMutationVariables
> {}
export type DeleteSiteViewMutationFn = MutationFn<
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
