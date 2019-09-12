/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReviewsPageDeleteReviewMutation
// ====================================================

export interface ReviewsPageDeleteReviewMutation_deleteReview {
  __typename: "DeleteReviewPayload";
  success: boolean;
  errors: string[] | null;
}

export interface ReviewsPageDeleteReviewMutation {
  deleteReview: ReviewsPageDeleteReviewMutation_deleteReview | null;
}

export interface ReviewsPageDeleteReviewMutationVariables {
  id: number;
}
