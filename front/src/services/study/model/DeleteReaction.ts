/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteReaction
// ====================================================

export interface DeleteReaction_deleteReaction_reaction_study {
  __typename: "Study";
  dislikesCount: number;
}

export interface DeleteReaction_deleteReaction_reaction {
  __typename: "Reaction";
  study: DeleteReaction_deleteReaction_reaction_study;
}

export interface DeleteReaction_deleteReaction {
  __typename: "DeleteReactionPayload";
  reaction: DeleteReaction_deleteReaction_reaction | null;
  errors: string[] | null;
}

export interface DeleteReaction {
  deleteReaction: DeleteReaction_deleteReaction | null;
}

export interface DeleteReactionVariables {
  id: number;
}

