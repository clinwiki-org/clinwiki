/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "../../../types/globalTypes"

// ====================================================
// GraphQL query operation: StudyEditsHistoryQuery
// ====================================================

export interface StudyEditsHistoryQuery_study_wikiPage_edits_changeSet_editLines {
  __typename: "WikiPageEditLine";
  /**
   * Whether the line is in the body.
   */
  body: boolean;
  /**
   * The content of the line.
   */
  content: string;
  /**
   * Whether the line is in the front matter.
   */
  frontMatter: boolean;
  /**
   * The type of diff line.
   */
  status: Diff;
}

export interface StudyEditsHistoryQuery_study_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  frontMatterChanged: boolean;
  bodyChanged: boolean;
  editLines: StudyEditsHistoryQuery_study_wikiPage_edits_changeSet_editLines[];
}

export interface StudyEditsHistoryQuery_study_wikiPage_edits_user {
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

export interface StudyEditsHistoryQuery_study_wikiPage_edits {
  __typename: "WikiPageEdit";
  id: number;
  createdAt: any;
  changeSet: StudyEditsHistoryQuery_study_wikiPage_edits_changeSet;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  user: StudyEditsHistoryQuery_study_wikiPage_edits_user | null;
}

export interface StudyEditsHistoryQuery_study_wikiPage {
  __typename: "WikiPage";
  edits: StudyEditsHistoryQuery_study_wikiPage_edits[];
}

export interface StudyEditsHistoryQuery_study {
  __typename: "Study";
  wikiPage: StudyEditsHistoryQuery_study_wikiPage | null;
}

export interface StudyEditsHistoryQuery {
  study: StudyEditsHistoryQuery_study | null;
}

export interface StudyEditsHistoryQueryVariables {
  nctId: string;
}
