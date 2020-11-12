/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSavedSearchMutation
// ====================================================

export interface CreateSavedSearchMutation_createSavedSearch_savedSearch_shortLink {
  __typename: "ShortLink";
  long: string | null;
  short: string | null;
}

export interface CreateSavedSearchMutation_createSavedSearch_savedSearch {
  __typename: "SavedSearch";
  shortLink: CreateSavedSearchMutation_createSavedSearch_savedSearch_shortLink;
  userId: number;
  createdAt: any;
  nameLabel: string | null;
}

export interface CreateSavedSearchMutation_createSavedSearch {
  __typename: "CreateSavedSearchPayload";
  savedSearch: CreateSavedSearchMutation_createSavedSearch_savedSearch;
}

export interface CreateSavedSearchMutation {
  createSavedSearch: CreateSavedSearchMutation_createSavedSearch | null;
}

export interface CreateSavedSearchMutationVariables {
  searchHash: string;
}
