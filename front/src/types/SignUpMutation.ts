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

export interface SignUpMutation_signUp_user_likedStudies {
  __typename: "Study";
  nctId: string;
  averageRating: number;
  briefTitle: string;
  overallStatus: string;
  startDate: any | null;
  completionDate: any | null;
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
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  likeCount: number | null;
  likedStudies: SignUpMutation_signUp_user_likedStudies[] | null;
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
