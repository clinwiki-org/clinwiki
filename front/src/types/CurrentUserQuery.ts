/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentUserQuery
// ====================================================

export interface CurrentUserQuery_me_reviews {
  __typename: "Review";
  content: string;
  briefTitle: string;
  nctId: string;
}

export interface CurrentUserQuery_me_likedStudies {
  __typename: "Study";
  nctId: string;
  averageRating: number;
  briefTitle: string;
  overallStatus: string;
  startDate: any | null;
  completionDate: any | null;
}

export interface CurrentUserQuery_me {
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
  reviews: CurrentUserQuery_me_reviews[];
  contributions: number;
  pictureUrl: string | null;
  rank: string | null;
  likeCount: number | null;
  likedStudies: CurrentUserQuery_me_likedStudies[] | null;
}

export interface CurrentUserQuery {
  /**
   * Current logged in user
   */
  me: CurrentUserQuery_me | null;
}
