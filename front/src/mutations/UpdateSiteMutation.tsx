import * as React from 'react';
import { gql } from 'apollo-boost';
import {
  Mutation,
  MutationComponentOptions,
  MutationFunction,
  MutationResult,
} from 'react-apollo';
import {
  UpdateSiteMutation as UpdateSiteMutationType,
  UpdateSiteMutationVariables,
} from 'types/UpdateSiteMutation';
import { SITE_FRAGMENT } from 'containers/SiteProvider/SiteProvider';

interface UpdateSiteMutationProps {
  children: (
    mutate: UpdateSiteMutationFn,
    result: MutationResult<UpdateSiteMutationType>
  ) => JSX.Element;
  onCompleted?: () => void;
}

const UPDATE_SITE_MUTATION = gql`
  mutation UpdateSiteMutation($input: UpdateSiteInput!, $url: String) {
    updateSite(input: $input) {
      site {
        ...SiteFragment
      }
      errors
    }
  }

  ${SITE_FRAGMENT}
`;

const UpdateSiteMutationComponent = (
  props: MutationComponentOptions<
    UpdateSiteMutationType,
    UpdateSiteMutationVariables
  >
) => Mutation(props);

export type UpdateSiteMutationFn = MutationFunction<
  UpdateSiteMutationType,
  UpdateSiteMutationVariables
>;

class UpdateSiteMutation extends React.PureComponent<UpdateSiteMutationProps> {
  render() {
    return (
      <UpdateSiteMutationComponent
        mutation={UPDATE_SITE_MUTATION}
        onCompleted={this.props.onCompleted}>
        {this.props.children}
      </UpdateSiteMutationComponent>
    );
  }
}

export default UpdateSiteMutation;
