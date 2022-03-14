/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSavedSearchesQuery
// ====================================================

export interface UserSavedSearchesQuery_savedSearch_shortLink {
  __typename: "ShortLink";
  long: string | null;
  short: string | null;
}

export interface UserSavedSearchesQuery_savedSearch {
  __typename: "SavedSearch";
  id: number;
  userId: number;
  nameLabel: string | null;
  createdAt: any;
  updatedAt: any;
  isSubscribed: boolean;
  url: string;
  shortLink: UserSavedSearchesQuery_savedSearch_shortLink;
}
export interface UserSavedDocsQuery_savedDocuments {
  __typename: "SavedSearch";
  id: number;
  userId: number;
  nameLabel: string | null;
  createdAt: any;
  updatedAt: any;
  isSubscribed: boolean;
  document_id_list: string;
}

export interface UserSavedSearchesQuery {
  /**
   * Single saved search
   */
  savedSearch: UserSavedSearchesQuery_savedSearch[] | null;
}
export interface UserSavedDocsQuery {
  /**
   * Single saved search
   */
  savedDocs: UserSavedDocsQuery_savedDocuments[] | null;
}

export interface UserSavedSearchesQueryVariables {
  userId: number;
}
