/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SignInInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignInMutation
// ====================================================

export interface SignInMutation_signIn_user_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface SignInMutation_signIn_user_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface SignInMutation_signIn_user_reactions_reactionKind {
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

export interface SignInMutation_signIn_user_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface SignInMutation_signIn_user_reactions {
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
  reactionKind: SignInMutation_signIn_user_reactions_reactionKind;
  study: SignInMutation_signIn_user_reactions_study;
  nctId: string;
}

export interface SignInMutation_signIn_user {
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
  reviews: SignInMutation_signIn_user_reviews[];
  reactionsCount: SignInMutation_signIn_user_reactionsCount[] | null;
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  reactions: SignInMutation_signIn_user_reactions[] | null;
}

export interface SignInMutation_signIn {
  __typename: "SignInPayload";
  /**
   * Json web token
   */
  jwt: string | null;
  /**
   * Signed in user
   */
  user: SignInMutation_signIn_user | null;
}

export interface SignInMutation {
  signIn: SignInMutation_signIn | null;
}

export interface SignInMutationVariables {
  input: SignInInput;
}
