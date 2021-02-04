/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WikiPageUpdateContentMutation
// ====================================================

export interface WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits_user {
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

export interface WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits_changeSet_editLines {
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

export interface WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits_changeSet_editLines[];
}

export interface WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits_changeSet;
}

export interface WikiPageUpdateContentMutation_updateWikiContent_wikiPage {
  __typename: "WikiPage";
  content: string;
  edits: WikiPageUpdateContentMutation_updateWikiContent_wikiPage_edits[];
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
}

export interface WikiPageUpdateContentMutation_updateWikiContent {
  __typename: "UpdateWikiContentPayload";
  wikiPage: WikiPageUpdateContentMutation_updateWikiContent_wikiPage | null;
  errors: string[] | null;
}

export interface WikiPageUpdateContentMutation {
  updateWikiContent: WikiPageUpdateContentMutation_updateWikiContent | null;
}

export interface WikiPageUpdateContentMutationVariables {
  nctId: string;
  content: string;
}
