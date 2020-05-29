/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CrowdPageDeleteWikiLabelMutation
// ====================================================

export interface CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits_user {
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

export interface CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits_changeSet_editLines {
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

export interface CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits_changeSet_editLines[];
}

export interface CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits_changeSet;
}

export interface CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage {
  __typename: "WikiPage";
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
  edits: CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits[];
}

export interface CrowdPageDeleteWikiLabelMutation_deleteWikiLabel {
  __typename: "DeleteWikiLabelPayload";
  wikiPage: CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage | null;
  errors: string[] | null;
}

export interface CrowdPageDeleteWikiLabelMutation {
  deleteWikiLabel: CrowdPageDeleteWikiLabelMutation_deleteWikiLabel | null;
}

export interface CrowdPageDeleteWikiLabelMutationVariables {
  nctId: string;
  key: string;
}
