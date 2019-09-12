import * as React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import {
  UpdateWikiSectionsMutation as UpdateWikiSectionsMutationType,
  UpdateWikiSectionsMutationVariables,
} from 'types/UpdateWikiSectionsMutation';

interface UpdateWikiSectionsMutationProps {
  children: (
    mutate: UpdateWikiSectionsMutationFn,
    result: MutationResult<UpdateWikiSectionsMutationType>,
  ) => React.ReactNode;
  onCompleted?: (data: UpdateWikiSectionsMutationType) => void;
  onError?: (e: ApolloError) => void;
}

const UPDATE_WIKI_SECTIONS_MUTATION = gql`
  mutation UpdateWikiSectionsMutation($input: UpdateWikiSectionsInput!) {
    updateWikiSections(input: $input) {
      wikiPage {
        nctId
        content
      }
      errors
    }
  }
`;

class UpdateWikiSectionsMutationComponent extends Mutation<
  UpdateWikiSectionsMutationType,
  UpdateWikiSectionsMutationVariables
> {}
export type UpdateWikiSectionsMutationFn = MutationFn<
  UpdateWikiSectionsMutationType,
  UpdateWikiSectionsMutationVariables
>;

class UpdateWikiSectionsMutation extends React.PureComponent<
  UpdateWikiSectionsMutationProps
> {
  render() {
    return (
      <UpdateWikiSectionsMutationComponent
        mutation={UPDATE_WIKI_SECTIONS_MUTATION}
        onCompleted={this.props.onCompleted}
        onError={this.props.onError}
      >
        {this.props.children}
      </UpdateWikiSectionsMutationComponent>
    );
  }
}

export default UpdateWikiSectionsMutation;
