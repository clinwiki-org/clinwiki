import * as React from 'react';
import { gql } from 'apollo-boost';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  UpdateSiteMutation as UpdateSiteMutationType,
  UpdateSiteMutationVariables,
} from 'types/UpdateSiteMutation';
import SiteItem from 'components/SiteItem';
import SiteProvider from 'containers/SiteProvider';

interface UpdateSiteMutationProps {
  children: (
    mutate: UpdateSiteMutationFn,
    result: MutationResult<UpdateSiteMutationType>,
  ) => React.ReactNode;
}

const UPDATE_SITE_MUTATION = gql`
  mutation UpdateSiteMutation($input: UpdateSiteInput!) {
    updateSite(input: $input) {
      site {
        ...SiteFragment
      }
      errors
    }
  }

  ${SiteProvider.fragment}
`;

class UpdateSiteMutationComponent extends Mutation<
  UpdateSiteMutationType,
  UpdateSiteMutationVariables
> {}
export type UpdateSiteMutationFn = MutationFn<
  UpdateSiteMutationType,
  UpdateSiteMutationVariables
>;

class UpdateSiteMutation extends React.PureComponent<UpdateSiteMutationProps> {
  render() {
    return (
      <UpdateSiteMutationComponent mutation={UPDATE_SITE_MUTATION}>
        {this.props.children}
      </UpdateSiteMutationComponent>
    );
  }
}

export default UpdateSiteMutation;
