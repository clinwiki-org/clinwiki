/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ResetPasswordInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ResetPasswordMutation
// ====================================================

export interface ResetPasswordMutation_resetPassword {
  __typename: "ResetPasswordPayload";
  success: boolean;
}

export interface ResetPasswordMutation {
  resetPassword: ResetPasswordMutation_resetPassword | null;
}

export interface ResetPasswordMutationVariables {
  input: ResetPasswordInput;
}
