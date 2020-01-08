/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WikiPageFragment
// ====================================================

export interface WikiPageFragment_edits_user {
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

export interface WikiPageFragment_edits {
  __typename: "WikiPageEdit";
  user: WikiPageFragment_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
}

export interface WikiPageFragment {
  __typename: "WikiPage";
  content: string;
  edits: WikiPageFragment_edits[];
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
}
