/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteSiteViewInput } from "./InputTypes";

// ====================================================
// GraphQL mutation operation: DeleteSiteViewMutation
// ====================================================

export interface DeleteSiteViewMutation_deleteSiteView_siteView {
  __typename: "Site";
  name: string;
  id: number;
}

export interface DeleteSiteViewMutation_deleteSiteView {
  __typename: "DeleteSiteViewPayload";
  siteView: DeleteSiteViewMutation_deleteSiteView_siteView | null;
  error: string | null;
}

export interface DeleteSiteViewMutation {
  deleteSiteView: DeleteSiteViewMutation_deleteSiteView | null;
}

export interface DeleteSiteViewMutationVariables {
  input: DeleteSiteViewInput;
}
