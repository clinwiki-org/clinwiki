/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateProfileInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditProfileMutation
// ====================================================

export interface EditProfileMutation_updateProfile_user_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface EditProfileMutation_updateProfile_user_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface EditProfileMutation_updateProfile_user_reactions_reactionKind {
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

export interface EditProfileMutation_updateProfile_user_reactions_study {
  __typename: "Study";
  briefTitle: string;
}

export interface EditProfileMutation_updateProfile_user_reactions {
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
  reactionKind: EditProfileMutation_updateProfile_user_reactions_reactionKind;
  study: EditProfileMutation_updateProfile_user_reactions_study;
  nctId: string;
}

export interface EditProfileMutation_updateProfile_user {
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
  reviews: EditProfileMutation_updateProfile_user_reviews[];
  reactionsCount: EditProfileMutation_updateProfile_user_reactionsCount[] | null;
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  reactions: EditProfileMutation_updateProfile_user_reactions[] | null;
}

export interface EditProfileMutation_updateProfile {
  __typename: "UpdateProfilePayload";
  errors: string[] | null;
  user: EditProfileMutation_updateProfile_user | null;
}

export interface EditProfileMutation {
  updateProfile: EditProfileMutation_updateProfile | null;
}

export interface EditProfileMutationVariables {
  input: UpdateProfileInput;
}
