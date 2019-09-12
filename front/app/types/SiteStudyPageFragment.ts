/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind } from "./globalTypes";

// ====================================================
// GraphQL fragment: SiteStudyPageFragment
// ====================================================

export interface SiteStudyPageFragment_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface SiteStudyPageFragment_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteStudyPageFragment_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: SiteStudyPageFragment_extendedSections_selected;
  title: string;
  name: string;
}

export interface SiteStudyPageFragment {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: SiteStudyPageFragment_basicSections[];
  extendedSections: SiteStudyPageFragment_extendedSections[];
}
