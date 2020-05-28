import * as React from 'react';
import { gql } from 'apollo-boost';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  CreateSiteViewMutation as CreateSiteViewMutationType,
  CreateSiteViewMutationVariables,
} from 'types/CreateSiteViewMutation';
import SiteProvider from '../containers/SiteProvider';

interface CreateSiteViewMutationProps {
  children: (
    mutate: CreateSiteViewMutationFn,
    result: MutationResult<CreateSiteViewMutationType>
  ) => React.ReactNode;
  onCompleted?: (any) => void;
}

const CREATE_SITE_VIEW_MUTATION = gql`
  mutation CreateSiteViewMutation($input: CreateSiteViewInput!) {
    createSiteView(input: $input) {
      siteView {
        ...SiteViewFragment
      }
      errors
    }
  }

  ${SiteProvider.siteViewFragment}
`;

class CreateSiteViewMutationComponent extends Mutation<
  CreateSiteViewMutationType,
  CreateSiteViewMutationVariables
> {}
export type CreateSiteViewMutationFn = MutationFn<
  CreateSiteViewMutationType,
  CreateSiteViewMutationVariables
>;

class CreateSiteViewMutation extends React.PureComponent<
  CreateSiteViewMutationProps
> {
  render() {
    return (
      <CreateSiteViewMutationComponent mutation={CREATE_SITE_VIEW_MUTATION}>
        {this.props.children}
      </CreateSiteViewMutationComponent>
    );
  }
}

export default CreateSiteViewMutation;
