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

export interface EditProfileMutation_updateProfile_user_likedStudies {
  __typename: "Study";
  nctId: string;
  averageRating: number;
  briefTitle: string;
  overallStatus: string;
  startDate: any | null;
  completionDate: any | null;
}

export interface EditProfileMutation_updateProfile_user_dislikedStudies {
  __typename: "Study";
  nctId: string;
  averageRating: number;
  briefTitle: string;
  overallStatus: string;
  startDate: any | null;
  completionDate: any | null;
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
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  likeCount: number | null;
  likedStudies: EditProfileMutation_updateProfile_user_likedStudies[] | null;
  dislikeCount: number | null;
  dislikedStudies: EditProfileMutation_updateProfile_user_dislikedStudies[] | null;
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
