/* tslint:disable */
// This file was automatically generated and should not be edited.

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

export interface CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: CrowdPageDeleteWikiLabelMutation_deleteWikiLabel_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
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
