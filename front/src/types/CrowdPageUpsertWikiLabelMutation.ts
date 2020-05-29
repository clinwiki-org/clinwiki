/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CrowdPageUpsertWikiLabelMutation
// ====================================================

export interface CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits_user {
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

export interface CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits_changeSet_editLines {
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

export interface CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits_changeSet_editLines[];
}

export interface CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits_changeSet;
}

export interface CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage {
  __typename: "WikiPage";
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
  edits: CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits[];
}

export interface CrowdPageUpsertWikiLabelMutation_upsertWikiLabel {
  __typename: "UpsertWikiLabelPayload";
  wikiPage: CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage | null;
  errors: string[] | null;
}

export interface CrowdPageUpsertWikiLabelMutation {
  upsertWikiLabel: CrowdPageUpsertWikiLabelMutation_upsertWikiLabel | null;
}

export interface CrowdPageUpsertWikiLabelMutationVariables {
  nctId: string;
  key: string;
  value: string;
}
