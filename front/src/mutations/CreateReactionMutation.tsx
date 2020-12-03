import * as React from 'react';
import { gql }  from '@apollo/client';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { MutationFunction, MutationResult } from '@apollo/client'
import {
  CreateReaction as CreateReactionType,
  CreateReactionVariables,
} from 'types/CreateReaction';

interface CreateReactionProps {
  children: (
    mutate: CreateReactionFn,
    result: MutationResult<CreateReactionType>
  ) => JSX.Element;
}

export const CREATE_REACTION = gql`
  mutation CreateReaction(
    $reactionKindId: Int!
    $nctId: String!

  ) {
    createReaction(
        input : { reactionKindId: $reactionKindId, nctId: $nctId }
    ) {
      reaction{
          reactionKind{
            id
          }
      }
      errors
    }
  }
`;

const CreateReactionComponent = (
  props: MutationComponentOptions<
    CreateReactionType,
    CreateReactionVariables
  >
) => Mutation(props);
export type CreateReactionFn = MutationFunction<
  CreateReactionType,
  CreateReactionVariables
>;

class CreateReaction extends React.PureComponent<
  CreateReactionProps
> {
  render() {
    return (
      <CreateReactionComponent mutation={CREATE_REACTION}>
        {this.props.children}
      </CreateReactionComponent>
    );
  }
}

export default CreateReaction;
