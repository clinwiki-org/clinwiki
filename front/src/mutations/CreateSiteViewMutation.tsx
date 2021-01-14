import * as React from 'react';
import { gql, MutationFunction, MutationResult }  from '@apollo/client';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import {
  CreateSiteViewMutation as CreateSiteViewMutationType,
  CreateSiteViewMutationVariables,
} from 'types/CreateSiteViewMutation';
import { OLD_SITE_VIEW_FRAGMENT } from '../services/site/SiteFragments'

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

  ${OLD_SITE_VIEW_FRAGMENT}
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
