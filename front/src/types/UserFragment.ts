/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface UserFragment_likedStudies {
  __typename: "Study";
  nctId: string;
  averageRating: number;
  briefTitle: string;
  overallStatus: string;
  startDate: any | null;
  completionDate: any | null;
}

export interface UserFragment {
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
  reviews: UserFragment_reviews[];
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  likeCount: number | null;
  likedStudies: UserFragment_likedStudies[] | null;
}
