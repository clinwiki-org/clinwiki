/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSearchLogsQuery
// ====================================================

export interface UserSearchLogsQuery_searchLog_shortLink {
  __typename: "ShortLink";
  long: string | null;
  short: string | null;
}

export interface UserSearchLogsQuery_searchLog {
  __typename: "SearchLog";
  userId: number;
  createdAt: any;
  nameDefault: string | null;
  shortLink: UserSearchLogsQuery_searchLog_shortLink;
}

export interface UserSearchLogsQuery {
  /**
   * Single search log
   */
  searchLog: UserSearchLogsQuery_searchLog[] | null;
}

export interface UserSearchLogsQueryVariables {
  userId: number;
}
