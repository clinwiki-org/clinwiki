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

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_fields[];
  selected: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs_selected;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_fields[];
  selected: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs_selected;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_aggs;
  crowdAggs: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest_crowdAggs;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_results_buttons {
  __typename: "ResultsButton";
  items: CreateSiteViewMutation_createSiteView_siteView_search_results_buttons_items[];
  location: string;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: CreateSiteViewMutation_createSiteView_siteView_search_results_buttons;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields[];
  selected: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_selected;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields[];
  selected: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_selected;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch {
  __typename: "SitePresearchPage";
  aggs: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs;
  crowdAggs: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs;
  button: CreateSiteViewMutation_createSiteView_siteView_search_presearch_button;
  instructions: string;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_config {
  __typename: "SiteConfigSection";
  fields: CreateSiteViewMutation_createSiteView_siteView_search_config_fields;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
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
  order: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
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

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
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
  order: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_order | null;
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
  type: string;
  autoSuggest: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest;
  results: CreateSiteViewMutation_createSiteView_siteView_search_results;
  presearch: CreateSiteViewMutation_createSiteView_siteView_search_presearch;
  fields: string[];
  config: CreateSiteViewMutation_createSiteView_siteView_search_config;
  aggs: CreateSiteViewMutation_createSiteView_siteView_search_aggs;
  crowdAggs: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs;
}

export interface CreateSiteViewMutation_createSiteView_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
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
