/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ReviewFormStudyFragment
// ====================================================

export interface ReviewFormStudyFragment_reviews_user {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  /**
   * Email
   */
  email: string;
}

export interface ReviewFormStudyFragment_reviews {
  __typename: "Review";
  id: number;
  /**
   * Json key value pairs of meta information.
   */
  meta: string;
  content: string;
  createdAt: any;
  user: ReviewFormStudyFragment_reviews_user;
}

export interface ReviewFormStudyFragment {
  __typename: "Study";
  nctId: string;
  reviews: ReviewFormStudyFragment_reviews[];
}
