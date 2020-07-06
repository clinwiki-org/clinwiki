import * as React from 'react';
import { gql } from 'apollo-boost';
import {
  Mutation,
  MutationComponentOptions,
  MutationFunction,
  MutationResult,
} from 'react-apollo';
import {
  CreateSiteViewMutation as CreateSiteViewMutationType,
  CreateSiteViewMutationVariables,
} from 'types/CreateSiteViewMutation';
import { SITE_VIEW_FRAGMENT } from 'containers/SiteProvider/SiteProvider';

interface CreateSiteViewMutationProps {
  children: (
    mutate: CreateSiteViewMutationFn,
    result: MutationResult<CreateSiteViewMutationType>
  ) => JSX.Element;
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

  ${SITE_VIEW_FRAGMENT}
`;

const CreateSiteViewMutationComponent = (
  props: MutationComponentOptions<
    CreateSiteViewMutationType,
    CreateSiteViewMutationVariables
  >
) => Mutation(props);

export type CreateSiteViewMutationFn = MutationFunction<
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
