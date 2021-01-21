/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SiteStudyPageFragment
// ====================================================

export interface SiteStudyPageFragment_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface SiteStudyPageFragment_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  template: string | null;
  hide: boolean;
  order: number | null;
  title: string;
  name: string;
}

export interface SiteStudyPageFragment {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: SiteStudyPageFragment_basicSections[];
  extendedSections: SiteStudyPageFragment_extendedSections[];
}
