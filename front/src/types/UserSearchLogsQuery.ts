/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSearchLogsQuery
// ====================================================

export interface UserSearchLogsQuery_searchLog {
  __typename: "SearchLog";
  createdAt: any;
  nameDefault: string | null;
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
