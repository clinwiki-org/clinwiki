/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchStudyPageQuery
// ====================================================

export interface SearchStudyPageQuery_search_studyEdge_study {
  __typename: "Study";
  nctId: string;
}

export interface SearchStudyPageQuery_search_studyEdge {
  __typename: "StudyEdge";
  /**
   * Id of a next study
   */
  nextId: string | null;
  /**
   * Id of a previous study
   */
  prevId: string | null;
  /**
   * Id of the first study
   */
  firstId: string | null;
  /**
   * Id of the last study
   */
  lastId: string | null;
  /**
   * Study is in a workflow mode
   */
  isWorkflow: boolean;
  /**
   * Workflow name if any
   */
  workflowName: string | null;
  /**
   * Study
   */
  study: SearchStudyPageQuery_search_studyEdge_study;
  /**
   * Total number of records
   */
  recordsTotal: number;
  /**
   * The index of the study in the results
   */
  counterIndex: number | null;
}

export interface SearchStudyPageQuery_search {
  __typename: "SearchResultSet";
  /**
   * Return study decorated with navigation cursors for current search
   */
  studyEdge: SearchStudyPageQuery_search_studyEdge | null;
}

export interface SearchStudyPageQuery {
  /**
   * Searches params by searchHash on server and `params` argument into it
   */
  search: SearchStudyPageQuery_search | null;
}

export interface SearchStudyPageQueryVariables {
  hash: string;
  id: string;
}
