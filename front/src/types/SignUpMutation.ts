/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SignUpInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignUpMutation
// ====================================================

export interface SignUpMutation_signUp_user_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface SignUpMutation_signUp_user_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface SignUpMutation_signUp_user_reactions_reactionKind {
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

export interface SignUpMutation_signUp_user_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface SignUpMutation_signUp_user_reactions {
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
  reactionKind: SignUpMutation_signUp_user_reactions_reactionKind;
  study: SignUpMutation_signUp_user_reactions_study;
  nctId: string;
}

export interface SignUpMutation_signUp_user {
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
  reviews: SignUpMutation_signUp_user_reviews[];
  reactionsCount: SignUpMutation_signUp_user_reactionsCount[] | null;
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  reactions: SignUpMutation_signUp_user_reactions[] | null;
}

export interface SignUpMutation_signUp {
  __typename: "SignUpPayload";
  /**
   * Json web token
   */
  jwt: string | null;
  errors: string[] | null;
  /**
   * Signed up user
   */
  user: SignUpMutation_signUp_user | null;
}

export interface SignUpMutation {
  signUp: SignUpMutation_signUp | null;
}

export interface SignUpMutationVariables {
  input: SignUpInput;
}
