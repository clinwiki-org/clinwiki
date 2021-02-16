/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum Diff {
  DEL = "DEL",
  DIFFCOMMENT = "DIFFCOMMENT",
  INS = "INS",
  UNCHANGED = "UNCHANGED",
}

export enum FieldDisplay {
  BAR_CHART = "BAR_CHART",
  CHECKBOX = "CHECKBOX",
  CRUMBS_ONLY = "CRUMBS_ONLY",
  DATE = "DATE",
  DATE_RANGE = "DATE_RANGE",
  DROP_DOWN = "DROP_DOWN",
  GREATER_THAN_DROP_DOWN = "GREATER_THAN_DROP_DOWN",
  GREATER_THAN_RANGE = "GREATER_THAN_RANGE",
  LESS_THAN_DROP_DOWN = "LESS_THAN_DROP_DOWN",
  LESS_THAN_RANGE = "LESS_THAN_RANGE",
  LOCATION = "LOCATION",
  MULTISELECT = "MULTISELECT",
  NUMBER_RANGE = "NUMBER_RANGE",
  PIE_CHART = "PIE_CHART",
  STAR = "STAR",
  STRING = "STRING",
}

export enum FilterKind {
  BLACKLIST = "BLACKLIST",
  WHITELIST = "WHITELIST",
}

/**
 * Possible set of operations of site view
 */
export enum SiteViewOperation {
  DELETE = "DELETE",
  PUSH = "PUSH",
  SET = "SET",
}

export enum SortKind {
  count = "count",
  key = "key",
}

/**
 * An Agg Filter
 */
export interface AggFilterInput {
  field: string;
  values?: string[] | null;
  gte?: string | null;
  lte?: string | null;
  includeMissingFields?: boolean | null;
  zipcode?: string | null;
  radius?: string | null;
  lat?: number | null;
  long?: number | null;
}

/**
 * An input type for a search query param (q).
 * This is a tree like structure where leafs are the search terms and
 * tree nodes are the AND / OR conditions.
 */
export interface SearchQueryInput {
  key: string;
  children?: SearchQueryInput[] | null;
}

/**
 * An atomic mutation of site
 */
export interface SiteViewMutationInput {
  path: string[];
  operation: SiteViewOperation;
  payload: string;
}

/**
 * Column to sort by
 */
export interface SortInput {
  id: string;
  desc?: boolean | null;
}

/**
 * Autogenerated input type of UpdateWikiSections
 */
export interface UpdateWikiSectionsInput {
  nctId: string;
  sections: WikiSectionInput[];
  clientMutationId?: string | null;
}

/**
 * Autogenerated input type of UpdateWorkflowsView
 */
export interface UpdateWorkflowsViewInput {
  mutations: SiteViewMutationInput[];
  clientMutationId?: string | null;
}

/**
 * A wiki section input
 */
export interface WikiSectionInput {
  name: string;
  content: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
