/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

// ====================================================
// GraphQL fragment: WikiPageEditFragment
// ====================================================

export interface WikiPageEditFragment_user {
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

export interface WikiPageEditFragment_changeSet_editLines {
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

export interface WikiPageEditFragment_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: WikiPageEditFragment_changeSet_editLines[];
}

export interface WikiPageEditFragment {
  __typename: "WikiPageEdit";
  user: WikiPageEditFragment_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: WikiPageEditFragment_changeSet;
}
