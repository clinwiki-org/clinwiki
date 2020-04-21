/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind } from "./globalTypes";

// ====================================================
// GraphQL fragment: SiteStudyExtendedGenericSectionFragment
// ====================================================

export interface SiteStudyExtendedGenericSectionFragment_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteStudyExtendedGenericSectionFragment {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: SiteStudyExtendedGenericSectionFragment_selected;
  title: string;
  name: string;
}
