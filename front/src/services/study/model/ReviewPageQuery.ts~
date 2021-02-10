/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReviewPageQuery
// ====================================================

export interface ReviewPageQuery_study_reviews_user {
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

export interface ReviewPageQuery_study_reviews {
  __typename: "Review";
  id: number;
  /**
   * Json key value pairs of meta information.
   */
  meta: string;
  content: string;
  createdAt: any;
  user: ReviewPageQuery_study_reviews_user;
}

export interface ReviewPageQuery_study {
  __typename: "Study";
  reviews: ReviewPageQuery_study_reviews[];
  nctId: string;
}

export interface ReviewPageQuery_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
}

export interface ReviewPageQuery {
  study: ReviewPageQuery_study | null;
  /**
   * Current logged in user
   */
  me: ReviewPageQuery_me | null;
}

export interface ReviewPageQueryVariables {
  nctId: string;
}
