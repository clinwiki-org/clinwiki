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
 * Column to sort by
 */
export interface SortInput {
  id: string;
  desc?: boolean | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
