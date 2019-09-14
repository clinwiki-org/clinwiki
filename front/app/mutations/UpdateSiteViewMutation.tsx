import * as React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  UpdateSiteViewMutation as UpdateSiteViewMutationType,
  UpdateSiteViewMutationVariables,
} from 'types/UpdateSiteViewMutation';
import SiteProvider from 'containers/SiteProvider';

interface UpdateSiteViewMutationProps {
  children: (
    mutate: UpdateSiteViewMutationFn,
    result: MutationResult<UpdateSiteViewMutationType>,
  ) => React.ReactNode;
  onCompleted?: (data: UpdateSiteViewMutationType) => void;
  onError?: (e: ApolloError) => void;
}

const UPDATE_SITE_VIEW_MUTATION = gql`
  mutation UpdateSiteViewMutation($input: UpdateSiteViewInput!) {
    updateSiteView(input: $input) {
      siteView {
        ...SiteViewFragment
      }
      errors
    }
  }

  ${SiteProvider.siteViewFragmemt}
`;

class UpdateSiteViewMutationComponent extends Mutation<
  UpdateSiteViewMutationType,
  UpdateSiteViewMutationVariables
> {}
export type UpdateSiteViewMutationFn = MutationFn<
  UpdateSiteViewMutationType,
  UpdateSiteViewMutationVariables
>;

class UpdateSiteViewMutation extends React.PureComponent<
  UpdateSiteViewMutationProps
> {
  render() {
    return (
      <UpdateSiteViewMutationComponent
        mutation={UPDATE_SITE_VIEW_MUTATION}
        onCompleted={this.props.onCompleted}
        onError={this.props.onError}
      >
        {this.props.children}
      </UpdateSiteViewMutationComponent>
    );
  }
}

export default UpdateSiteViewMutation;
