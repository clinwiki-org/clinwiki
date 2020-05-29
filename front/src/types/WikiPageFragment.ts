/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

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

export interface WikiPageFragment_edits_changeSet_editLines {
  __typename: "WikiPageEditLine";
  /**
   * The type of diff line.
   */
  status: Diff;
  /**
   * The content of the line.
   */
  content: string;
  /**
   * Whether the line is in the front matter.
   */
  frontMatter: boolean;
  /**
   * Whether the line is in the body.
   */
  body: boolean;
}

export interface WikiPageFragment_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: WikiPageFragment_edits_changeSet_editLines[];
}

export interface WikiPageFragment_edits {
  __typename: "WikiPageEdit";
  user: WikiPageFragment_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: WikiPageFragment_edits_changeSet;
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
