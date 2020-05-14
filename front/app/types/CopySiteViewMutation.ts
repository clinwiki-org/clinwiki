/* tslint:disable */
// This file was automatically generated and should not be edited.

import { CopySiteViewInput, FilterKind, FieldDisplay } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CopySiteViewMutation
// ====================================================

export interface CopySiteViewMutation_copySiteView_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface CopySiteViewMutation_copySiteView_siteView_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: CopySiteViewMutation_copySiteView_siteView_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface CopySiteViewMutation_copySiteView_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: CopySiteViewMutation_copySiteView_siteView_study_basicSections[];
  extendedSections: CopySiteViewMutation_copySiteView_siteView_study_extendedSections[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_fields[];
  selected: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs_selected;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_fields[];
  selected: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs_selected;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_aggs;
  crowdAggs: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest_crowdAggs;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_results_buttons {
  __typename: "ResultsButton";
  items: CopySiteViewMutation_copySiteView_siteView_search_results_buttons_items[];
  location: string;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: CopySiteViewMutation_copySiteView_siteView_search_results_buttons;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_fields[];
  selected: CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs_selected;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_fields[];
  selected: CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs_selected;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_presearch {
  __typename: "SitePresearchPage";
  aggs: CopySiteViewMutation_copySiteView_siteView_search_presearch_aggs;
  crowdAggs: CopySiteViewMutation_copySiteView_siteView_search_presearch_crowdAggs;
  button: CopySiteViewMutation_copySiteView_siteView_search_presearch_button;
  instructions: string;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_config {
  __typename: "SiteConfigSection";
  fields: CopySiteViewMutation_copySiteView_siteView_search_config_fields;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  order: CopySiteViewMutation_copySiteView_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: CopySiteViewMutation_copySiteView_siteView_search_aggs_fields_preselected;
  visibleOptions: CopySiteViewMutation_copySiteView_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: CopySiteViewMutation_copySiteView_siteView_search_aggs_fields[];
  selected: CopySiteViewMutation_copySiteView_siteView_search_aggs_selected;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CopySiteViewMutation_copySiteView_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_fields[];
  selected: CopySiteViewMutation_copySiteView_siteView_search_crowdAggs_selected;
}

export interface CopySiteViewMutation_copySiteView_siteView_search {
  __typename: "SiteSearchPage";
  type: string;
  autoSuggest: CopySiteViewMutation_copySiteView_siteView_search_autoSuggest;
  results: CopySiteViewMutation_copySiteView_siteView_search_results;
  presearch: CopySiteViewMutation_copySiteView_siteView_search_presearch;
  fields: string[];
  config: CopySiteViewMutation_copySiteView_siteView_search_config;
  aggs: CopySiteViewMutation_copySiteView_siteView_search_aggs;
  crowdAggs: CopySiteViewMutation_copySiteView_siteView_search_crowdAggs;
}

export interface CopySiteViewMutation_copySiteView_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: CopySiteViewMutation_copySiteView_siteView_study;
  search: CopySiteViewMutation_copySiteView_siteView_search;
}

export interface CopySiteViewMutation_copySiteView {
  __typename: "CopySiteViewPayload";
  siteView: CopySiteViewMutation_copySiteView_siteView | null;
  errors: string[] | null;
}

export interface CopySiteViewMutation {
  copySiteView: CopySiteViewMutation_copySiteView | null;
}

export interface CopySiteViewMutationVariables {
  input: CopySiteViewInput;
}
