/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BulkListUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: BulkListUpdateMutation
// ====================================================

export interface BulkListUpdateMutation_bulkListUpdate {
  __typename: "BulkListUpdatePayload";
  /**
   * A unique identifier for the client performing the mutation.
   */
  clientMutationId: string | null;
}

export interface BulkListUpdateMutation {
  bulkListUpdate: BulkListUpdateMutation_bulkListUpdate | null;
}

export interface BulkListUpdateMutationVariables {
  input: BulkListUpdateInput;
}
