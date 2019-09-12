/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SignInInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignInMutation
// ====================================================

export interface SignInMutation_signIn_user {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * Email
   */
  email: string;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  /**
   * Default query for user
   */
  defaultQueryString: string | null;
  roles: string[];
}

export interface SignInMutation_signIn {
  __typename: "SignInPayload";
  /**
   * Json web token
   */
  jwt: string | null;
  /**
   * Signed in user
   */
  user: SignInMutation_signIn_user | null;
}

export interface SignInMutation {
  signIn: SignInMutation_signIn | null;
}

export interface SignInMutationVariables {
  input: SignInInput;
}
