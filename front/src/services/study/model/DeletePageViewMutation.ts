/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePageViewMutation
// ====================================================

export interface DeletePageViewMutation_deletePageView_pageView {
  __typename: "PageView";
  id: number;
}

export interface DeletePageViewMutation_deletePageView {
  __typename: "DeletePageViewPayload";
  error: string | null;
  pageView: DeletePageViewMutation_deletePageView_pageView | null;
}

export interface DeletePageViewMutation {
  deletePageView: DeletePageViewMutation_deletePageView | null;
}

export interface DeletePageViewMutationVariables {
  id: number;
}
