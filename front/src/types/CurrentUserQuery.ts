/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserQuery
// ====================================================

export interface CurrentUserQuery_me_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface CurrentUserQuery_me_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface CurrentUserQuery_me_reactions_reactionKind {
  __typename: "ReactionKind";
  /**
   * Id
   */
  id: number;
  /**
   * Name of reaction example is like or dislike
   */
  name: string;
}

export interface CurrentUserQuery_me_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface CurrentUserQuery_me_reactions {
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
  reactionKind: CurrentUserQuery_me_reactions_reactionKind;
  study: CurrentUserQuery_me_reactions_study;
  nctId: string;
}

export interface CurrentUserQuery_me {
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
  /**
   * Default query for user
   */
  defaultQueryString: string | null;
  roles: string[];
  /**
   * Number of reviews the user has done
   */
  reviewCount: number;
  reviews: CurrentUserQuery_me_reviews[];
  reactionsCount: CurrentUserQuery_me_reactionsCount[] | null;
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  reactions: CurrentUserQuery_me_reactions[] | null;
}

export interface CurrentUserQuery {
  /**
   * Current logged in user
   */
  me: CurrentUserQuery_me | null;
}
