/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

// ====================================================
// GraphQL query operation: WikiPageQuery
// ====================================================

export interface WikiPageQuery_study_wikiPage_edits_user {
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

export interface WikiPageQuery_study_wikiPage_edits_changeSet_editLines {
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

export interface WikiPageQuery_study_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: WikiPageQuery_study_wikiPage_edits_changeSet_editLines[];
}

export interface WikiPageQuery_study_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: WikiPageQuery_study_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: WikiPageQuery_study_wikiPage_edits_changeSet;
}

export interface WikiPageQuery_study_wikiPage {
  __typename: "WikiPage";
  content: string;
  edits: WikiPageQuery_study_wikiPage_edits[];
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
}

export interface WikiPageQuery_study {
  __typename: "Study";
  wikiPage: WikiPageQuery_study_wikiPage | null;
  nctId: string;
}

export interface WikiPageQuery_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
}

export interface WikiPageQuery {
  study: WikiPageQuery_study | null;
  /**
   * Current logged in user
   */
  me: WikiPageQuery_me | null;
}

export interface WikiPageQueryVariables {
  nctId: string;
}
