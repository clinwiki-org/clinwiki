/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePageViewMutation
// ====================================================

export interface CreatePageViewMutation_createPageView_pageView {
  __typename: "PageView";
  id: number;
  pageType: string;
  template: string;
  title: string;
  url: string;
  default: boolean;
}

export interface CreatePageViewMutation_createPageView {
  __typename: "CreatePageViewPayload";
  errors: string[] | null;
  pageView: CreatePageViewMutation_createPageView_pageView | null;
}

export interface CreatePageViewMutation {
  createPageView: CreatePageViewMutation_createPageView | null;
}

export interface CreatePageViewMutationVariables {
  url: string;
  siteId: number;
}
