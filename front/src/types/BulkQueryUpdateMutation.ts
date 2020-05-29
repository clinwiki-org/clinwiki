/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BulkQueryUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: BulkQueryUpdateMutation
// ====================================================

export interface BulkQueryUpdateMutation_bulkQueryUpdate_undoActions_state {
  __typename: "FacetState";
  enable: boolean | null;
  name: string | null;
  value: string | null;
}

export interface BulkQueryUpdateMutation_bulkQueryUpdate_undoActions {
  __typename: "StudyFacetState";
  nctId: string | null;
  state: BulkQueryUpdateMutation_bulkQueryUpdate_undoActions_state[] | null;
}

export interface BulkQueryUpdateMutation_bulkQueryUpdate {
  __typename: "BulkQueryUpdatePayload";
  /**
   * A unique identifier for the client performing the mutation.
   */
  clientMutationId: string | null;
  undoActions: BulkQueryUpdateMutation_bulkQueryUpdate_undoActions[] | null;
}

export interface BulkQueryUpdateMutation {
  bulkQueryUpdate: BulkQueryUpdateMutation_bulkQueryUpdate | null;
}

export interface BulkQueryUpdateMutationVariables {
  input: BulkQueryUpdateInput;
}
