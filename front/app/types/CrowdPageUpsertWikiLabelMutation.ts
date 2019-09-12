/* tslint:disable */
// This file was automatically generated and should not be edited.

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

export interface CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: CrowdPageUpsertWikiLabelMutation_upsertWikiLabel_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
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
