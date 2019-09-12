/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ReviewFragment
// ====================================================

export interface ReviewFragment_user {
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

export interface ReviewFragment {
  __typename: "Review";
  id: number;
  /**
   * Json key value pairs of meta information.
   */
  meta: string;
  content: string;
  createdAt: any;
  user: ReviewFragment_user;
}
