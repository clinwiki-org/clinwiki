import * as React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import {
  Mutation,
  MutationComponentOptions,
  MutationFunction,
  MutationResult,
} from 'react-apollo';
import {
  UpdateSiteViewMutation as UpdateSiteViewMutationType,
  UpdateSiteViewMutationVariables,
} from 'types/UpdateSiteViewMutation';
import SiteProvider from 'containers/SiteProvider';

interface UpdateSiteViewMutationProps {
  children: (
    mutate: UpdateSiteViewMutationFn,
    result: MutationResult<UpdateSiteViewMutationType>
  ) => JSX.Element;
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

  ${SiteProvider.siteViewFragment}
`;

const UpdateSiteViewMutationComponent = (
  props: MutationComponentOptions<
    UpdateSiteViewMutationType,
    UpdateSiteViewMutationVariables
  >
) => Mutation(props);
export type UpdateSiteViewMutationFn = MutationFunction<
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
        onError={this.props.onError}>
        {this.props.children}
      </UpdateSiteViewMutationComponent>
    );
  }
}

export default UpdateSiteViewMutation;
