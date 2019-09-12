/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind, FieldDisplay } from "./globalTypes";

// ====================================================
// GraphQL fragment: SiteFragment
// ====================================================

export interface SiteFragment_editors {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface SiteFragment_owners {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface SiteFragment_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface SiteFragment_siteView_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: SiteFragment_siteView_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface SiteFragment_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: SiteFragment_siteView_study_basicSections[];
  extendedSections: SiteFragment_siteView_study_extendedSections[];
}

export interface SiteFragment_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteView_search_aggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_aggs_fields_visibleOptions;
  rank: number | null;
}

export interface SiteFragment_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteView_search_aggs_fields[];
  selected: SiteFragment_siteView_search_aggs_selected;
}

export interface SiteFragment_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
}

export interface SiteFragment_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteView_search_crowdAggs_fields[];
  selected: SiteFragment_siteView_search_crowdAggs_selected;
}

export interface SiteFragment_siteView_search {
  __typename: "SiteSearchPage";
  fields: string[];
  aggs: SiteFragment_siteView_search_aggs;
  crowdAggs: SiteFragment_siteView_search_crowdAggs;
}

export interface SiteFragment_siteView {
  __typename: "SiteView";
  id: number;
  study: SiteFragment_siteView_study;
  search: SiteFragment_siteView_search;
}

export interface SiteFragment {
  __typename: "Site";
  id: number;
  editors: SiteFragment_editors[];
  name: string;
  subdomain: string;
  owners: SiteFragment_owners[];
  siteView: SiteFragment_siteView;
}
