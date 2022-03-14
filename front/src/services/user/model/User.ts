/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user_reviews {
  __typename: "Review";
  nctId: string;
  briefTitle: string;
  content: string;
}

export interface User_user {
  __typename: "PublicUser";
  /**
   * First name
   */
  first_name: string | null;
  /**
   * Last name
   */
  last_name: string | null;
  /**
   * Number of reviews the user has done
   */
  reviewCount: number;
  rank: string | null;
  reviews: User_user_reviews[];
  contributions: number;
  picture_url: string | null;
}

export interface User {
  /**
   * Public Profile User
   */
  user: User_user;
}

export interface UserVariables {
  user_id: number;
}
