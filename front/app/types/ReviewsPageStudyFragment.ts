/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ReviewsPageStudyFragment
// ====================================================

export interface ReviewsPageStudyFragment_reviews_user {
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

export interface ReviewsPageStudyFragment_reviews {
  __typename: "Review";
  id: number;
  /**
   * Json key value pairs of meta information.
   */
  meta: string;
  content: string;
  createdAt: any;
  user: ReviewsPageStudyFragment_reviews_user;
}

export interface ReviewsPageStudyFragment {
  __typename: "Study";
  nctId: string;
  reviews: ReviewsPageStudyFragment_reviews[];
}
