/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReviewFormMutation
// ====================================================

export interface ReviewFormMutation_upsertReview_review_user {
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

export interface ReviewFormMutation_upsertReview_review {
  __typename: "Review";
  id: number;
  /**
   * Json key value pairs of meta information.
   */
  meta: string;
  content: string;
  createdAt: any;
  user: ReviewFormMutation_upsertReview_review_user;
}

export interface ReviewFormMutation_upsertReview {
  __typename: "UpsertReviewPayload";
  review: ReviewFormMutation_upsertReview_review | null;
  errors: string[] | null;
}

export interface ReviewFormMutation {
  upsertReview: ReviewFormMutation_upsertReview | null;
}

export interface ReviewFormMutationVariables {
  id?: number | null;
  nctId: string;
  meta: string;
  content: string;
}
