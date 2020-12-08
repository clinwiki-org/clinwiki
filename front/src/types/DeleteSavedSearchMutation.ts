/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSavedSearchMutation
// ====================================================

export interface DeleteSavedSearchMutation_deleteSavedSearch_savedSearch_shortLink {
  __typename: "ShortLink";
  short: string | null;
  long: string | null;
}

export interface DeleteSavedSearchMutation_deleteSavedSearch_savedSearch {
  __typename: "SavedSearch";
  id: number;
  userId: number;
  shortLink: DeleteSavedSearchMutation_deleteSavedSearch_savedSearch_shortLink;
  isSubscribed: boolean;
}

export interface DeleteSavedSearchMutation_deleteSavedSearch {
  __typename: "DeleteSavedSearchPayload";
  success: boolean | null;
  errors: string[] | null;
  savedSearch: DeleteSavedSearchMutation_deleteSavedSearch_savedSearch | null;
}

export interface DeleteSavedSearchMutation {
  deleteSavedSearch: DeleteSavedSearchMutation_deleteSavedSearch | null;
}

export interface DeleteSavedSearchMutationVariables {
  id: number;
}
