/* tslint:disable */
// This file was automatically generated and should not be edited.

import { UpdateSiteViewInput, FilterKind, FieldDisplay } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSiteViewMutation
// ====================================================

export interface UpdateSiteViewMutation_updateSiteView_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: UpdateSiteViewMutation_updateSiteView_siteView_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: UpdateSiteViewMutation_updateSiteView_siteView_study_basicSections[];
  extendedSections: UpdateSiteViewMutation_updateSiteView_siteView_study_extendedSections[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_visibleOptions;
  rank: number | null;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields[];
  selected: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_selected;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields[];
  selected: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_selected;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search {
  __typename: "SiteSearchPage";
  fields: string[];
  aggs: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs;
  crowdAggs: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView {
  __typename: "SiteView";
  id: number;
  study: UpdateSiteViewMutation_updateSiteView_siteView_study;
  search: UpdateSiteViewMutation_updateSiteView_siteView_search;
}

export interface UpdateSiteViewMutation_updateSiteView {
  __typename: "UpdateSiteViewPayload";
  siteView: UpdateSiteViewMutation_updateSiteView_siteView | null;
  errors: string[] | null;
}

export interface UpdateSiteViewMutation {
  updateSiteView: UpdateSiteViewMutation_updateSiteView | null;
}

export interface UpdateSiteViewMutationVariables {
  input: UpdateSiteViewInput;
}
