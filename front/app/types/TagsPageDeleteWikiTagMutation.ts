/* tslint:disable */
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: TagsPageDeleteWikiTagMutation
// ====================================================

export interface TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits_user {
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

export interface TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits_changeSet_editLines {
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

export interface TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits_changeSet_editLines[];
}

export interface TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits_changeSet;
}

export interface TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage {
  __typename: "WikiPage";
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
  edits: TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits[];
}

export interface TagsPageDeleteWikiTagMutation_deleteWikiTag {
  __typename: "DeleteWikiTagPayload";
  wikiPage: TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage | null;
  errors: string[] | null;
}

export interface TagsPageDeleteWikiTagMutation {
  deleteWikiTag: TagsPageDeleteWikiTagMutation_deleteWikiTag | null;
}

export interface TagsPageDeleteWikiTagMutationVariables {
  nctId: string;
  value: string;
}
