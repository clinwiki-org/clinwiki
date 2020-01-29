/* tslint:disable */
// This file was automatically generated and should not be edited.

import { CreateSiteViewInput, FilterKind, FieldDisplay } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSiteViewMutation
// ====================================================

export interface CreateSiteViewMutation_createSiteView_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface CreateSiteViewMutation_createSiteView_siteView_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: CreateSiteViewMutation_createSiteView_siteView_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface CreateSiteViewMutation_createSiteView_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: CreateSiteViewMutation_createSiteView_siteView_study_basicSections[];
  extendedSections: CreateSiteViewMutation_createSiteView_siteView_study_extendedSections[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields[];
  selected: CreateSiteViewMutation_createSiteView_siteView_search_aggs_selected;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields[];
  selected: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_selected;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search {
  __typename: "SiteSearchPage";
  fields: string[];
  aggs: CreateSiteViewMutation_createSiteView_siteView_search_aggs;
  crowdAggs: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs;
}

export interface CreateSiteViewMutation_createSiteView_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  study: CreateSiteViewMutation_createSiteView_siteView_study;
  search: CreateSiteViewMutation_createSiteView_siteView_search;
}

export interface CreateSiteViewMutation_createSiteView {
  __typename: "CreateSiteViewPayload";
  siteView: CreateSiteViewMutation_createSiteView_siteView | null;
  errors: string[] | null;
}

export interface CreateSiteViewMutation {
  createSiteView: CreateSiteViewMutation_createSiteView | null;
}

export interface CreateSiteViewMutationVariables {
  input: CreateSiteViewInput;
}
