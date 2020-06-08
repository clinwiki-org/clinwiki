/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdatePasswordInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePasswordMutation
// ====================================================

export interface UpdatePasswordMutation_updatePassword_user_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface UpdatePasswordMutation_updatePassword_user_likedStudies {
  __typename: "Study";
  nctId: string;
  averageRating: number;
  briefTitle: string;
  overallStatus: string;
  startDate: any | null;
  completionDate: any | null;
}

export interface UpdatePasswordMutation_updatePassword_user_dislikedStudies {
  __typename: "Study";
  nctId: string;
  averageRating: number;
  briefTitle: string;
  overallStatus: string;
  startDate: any | null;
  completionDate: any | null;
}

export interface UpdatePasswordMutation_updatePassword_user {
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
  reviews: UpdatePasswordMutation_updatePassword_user_reviews[];
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  likeCount: number | null;
  likedStudies: UpdatePasswordMutation_updatePassword_user_likedStudies[] | null;
  dislikeCount: number | null;
  dislikedStudies: UpdatePasswordMutation_updatePassword_user_dislikedStudies[] | null;
}

export interface UpdatePasswordMutation_updatePassword {
  __typename: "UpdatePasswordPayload";
  /**
   * Sign in token if no error
   */
  jwt: string | null;
  /**
   * Errors with token, either does not match user or expired
   */
  errors: string;
  user: UpdatePasswordMutation_updatePassword_user;
}

export interface UpdatePasswordMutation {
  updatePassword: UpdatePasswordMutation_updatePassword | null;
}

export interface UpdatePasswordMutationVariables {
  input: UpdatePasswordInput;
}
