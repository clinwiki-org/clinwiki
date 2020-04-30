/* tslint:disable */
// This file was automatically generated and should not be edited.

import { SignUpInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignUpMutation
// ====================================================

export interface SignUpMutation_signUp_user {
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
  /**
   * Number of reviews the user has done
   */
  reviewCount: number;
}

export interface SignUpMutation_signUp {
  __typename: "SignUpPayload";
  /**
   * Json web token
   */
  jwt: string | null;
  errors: string[] | null;
  /**
   * Signed up user
   */
  user: SignUpMutation_signUp_user | null;
}

export interface SignUpMutation {
  signUp: SignUpMutation_signUp | null;
}

export interface SignUpMutationVariables {
  input: SignUpInput;
}
