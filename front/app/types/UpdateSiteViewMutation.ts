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

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_fields[];
  selected: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs_selected;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_fields[];
  selected: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs_selected;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_aggs;
  crowdAggs: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest_crowdAggs;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_results_buttons {
  __typename: "ResultsButton";
  items: UpdateSiteViewMutation_updateSiteView_siteView_search_results_buttons_items[];
  location: string;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: UpdateSiteViewMutation_updateSiteView_siteView_search_results_buttons;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_fields[];
  selected: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs_selected;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_fields[];
  selected: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs_selected;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_presearch {
  __typename: "SitePresearchPage";
  aggs: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_aggs;
  crowdAggs: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_crowdAggs;
  button: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch_button;
  instructions: string;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_config {
  __typename: "SiteConfigSection";
  fields: UpdateSiteViewMutation_updateSiteView_siteView_search_config_fields;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
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
  order: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
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

export interface UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
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
  order: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
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
  type: string;
  autoSuggest: UpdateSiteViewMutation_updateSiteView_siteView_search_autoSuggest;
  results: UpdateSiteViewMutation_updateSiteView_siteView_search_results;
  presearch: UpdateSiteViewMutation_updateSiteView_siteView_search_presearch;
  fields: string[];
  config: UpdateSiteViewMutation_updateSiteView_siteView_search_config;
  aggs: UpdateSiteViewMutation_updateSiteView_siteView_search_aggs;
  crowdAggs: UpdateSiteViewMutation_updateSiteView_siteView_search_crowdAggs;
}

export interface UpdateSiteViewMutation_updateSiteView_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
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
