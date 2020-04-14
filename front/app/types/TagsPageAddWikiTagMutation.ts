/* tslint:disable */
// This file was automatically generated and should not be edited.

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

export interface TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: TagsPageAddWikiTagMutation_upsertWikiTag_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
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
