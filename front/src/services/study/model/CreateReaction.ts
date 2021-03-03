/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateReaction
// ====================================================

export interface CreateReaction_createReaction_reaction_reactionKind {
  __typename: "ReactionKind";
  /**
   * Id
   */
  id: number;
}

export interface CreateReaction_createReaction_reaction {
  __typename: "Reaction";
  /**
   * Type of reaction such as downvote
   */
  reactionKind: CreateReaction_createReaction_reaction_reactionKind;
}

export interface CreateReaction_createReaction {
  __typename: "CreateReactionPayload";
  reaction: CreateReaction_createReaction_reaction | null;
  errors: string[] | null;
}

export interface CreateReaction {
  createReaction: CreateReaction_createReaction | null;
}

export interface CreateReactionVariables {
  reactionKindId: number;
  nctId: string;
}
