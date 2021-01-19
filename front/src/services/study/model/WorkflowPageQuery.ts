/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: WorkflowPageQuery
// ====================================================

export interface WorkflowPageQuery_study_wikiPage {
    __typename: "WikiPage";
    nctId: string;
    /**
     * Json key value pairs of meta information
     */
    meta: string;
    content: string;
  }
  
  export interface WorkflowPageQuery_study {
    __typename: "Study";
    wikiPage: WorkflowPageQuery_study_wikiPage | null;
    nctId: string;
  }
  
  export interface WorkflowPageQuery {
    study: WorkflowPageQuery_study | null;
  }
  
  export interface WorkflowPageQueryVariables {
    nctId: string;
  }
  