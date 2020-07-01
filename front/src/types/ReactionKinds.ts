/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReactionKinds
// ====================================================

export interface ReactionKinds_reactionKinds {
  __typename: "ReactionKind";
  /**
   * Id
   */
  id: number;
  /**
   * Name of reaction example is like or dislike
   */
  name: string;
  /**
   * Unicode for emoji used in reaction
   */
  unicode: string;
}

export interface ReactionKinds {
  /**
   * All reaction Types
   */
  reactionKinds: ReactionKinds_reactionKinds[] | null;
}
