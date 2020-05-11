/* tslint:disable */
// This file was automatically generated and should not be edited.

import { UpdatePasswordInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePasswordMutation
// ====================================================

export interface UpdatePasswordMutation_updatePassword {
  __typename: "UpdatePasswordPayload";
  /**
   * Sign in token if no error
   */
  jwt: string | null;
  /**
   * Errors with token, either does not match user or expired
   */
  errors: string;
}

export interface UpdatePasswordMutation {
  updatePassword: UpdatePasswordMutation_updatePassword | null;
}

export interface UpdatePasswordMutationVariables {
  input: UpdatePasswordInput;
}
