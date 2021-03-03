/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: StudyReactions
// ====================================================

export interface StudyReactions_me_reactions_reactionKind {
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

export interface StudyReactions_me_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface StudyReactions_me_reactions {
  __typename: "Reaction";
  /**
   * Id
   */
  id: number;
  /**
   * id of reaction kind
   */
  reactionKindId: number;
  /**
   * Type of reaction such as downvote
   */
  reactionKind: StudyReactions_me_reactions_reactionKind;
  study: StudyReactions_me_reactions_study;
  nctId: string;
}

export interface StudyReactions_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * Email
   */
  email: string;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  reactions: StudyReactions_me_reactions[] | null;
}

export interface StudyReactions {
  /**
   * Current logged in user
   */
  me: StudyReactions_me | null;
}

export interface StudyReactionsVariables {
  nctId: string;
}
