/* tslint:disable */
// This file was automatically generated and should not be edited.

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

export interface TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: TagsPageDeleteWikiTagMutation_deleteWikiTag_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
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
