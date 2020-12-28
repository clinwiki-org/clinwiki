/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteSiteInput } from "./globalTypes"; //TODO need import input

// ====================================================
// GraphQL mutation operation: DeleteSiteMutation
// ====================================================

export interface DeleteSiteMutation_deleteSite_site {
  __typename: "Site";
  id: number;
}

export interface DeleteSiteMutation_deleteSite {
  __typename: "DeleteSitePayload";
  site: DeleteSiteMutation_deleteSite_site | null;
}

export interface DeleteSiteMutation {
  deleteSite: DeleteSiteMutation_deleteSite | null;
}

export interface DeleteSiteMutationVariables {
  input: DeleteSiteInput;
}
