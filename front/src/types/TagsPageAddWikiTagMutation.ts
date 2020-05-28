/* tslint:disable */
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: TagsPageAddWikiTagMutation
// ====================================================

export interface TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits_user {
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

export interface TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits_changeSet_editLines {
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

export interface TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits_changeSet_editLines[];
}

export interface TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits_changeSet;
}

export interface TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage {
  __typename: "WikiPage";
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
  edits: TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits[];
}

export interface TagsPageAddWikiTagMutation_upsertWikiTag {
  __typename: "UpsertWikiTagPayload";
  wikiPage: TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage | null;
  errors: string[] | null;
}

export interface TagsPageAddWikiTagMutation {
  upsertWikiTag: TagsPageAddWikiTagMutation_upsertWikiTag | null;
}

export interface TagsPageAddWikiTagMutationVariables {
  nctId: string;
  value: string;
}
