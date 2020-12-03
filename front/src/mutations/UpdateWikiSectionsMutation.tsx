import * as React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import {
  Mutation,
  MutationComponentOptions,
  MutationFunction,
  MutationResult,
} from 'react-apollo';
import {
  UpdateWikiSectionsMutation as UpdateWikiSectionsMutationType,
  UpdateWikiSectionsMutationVariables,
} from 'types/UpdateWikiSectionsMutation';

interface UpdateWikiSectionsMutationProps {
  children: (
    mutate: UpdateWikiSectionsMutationFn,
    result: MutationResult<UpdateWikiSectionsMutationType>
  ) => JSX.Element;
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

const UpdateWikiSectionsMutationComponent = (
  props: MutationComponentOptions<
    UpdateWikiSectionsMutationType,
    UpdateWikiSectionsMutationVariables
  >
) => Mutation(props);
export type UpdateWikiSectionsMutationFn = MutationFunction<
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
        onError={this.props.onError}>
        {this.props.children}
      </UpdateWikiSectionsMutationComponent>
    );
  }
}

export default UpdateWikiSectionsMutation;
