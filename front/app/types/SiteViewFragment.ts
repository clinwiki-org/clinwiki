/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind, FieldDisplay } from "./globalTypes";

// ====================================================
// GraphQL fragment: SiteViewFragment
// ====================================================

export interface SiteViewFragment_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface SiteViewFragment_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: SiteViewFragment_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface SiteViewFragment_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: SiteViewFragment_study_basicSections[];
  extendedSections: SiteViewFragment_study_extendedSections[];
}

export interface SiteViewFragment_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteViewFragment_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteViewFragment_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteViewFragment_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: SiteViewFragment_search_autoSuggest_aggs_fields[];
  selected: SiteViewFragment_search_autoSuggest_aggs_selected;
}

export interface SiteViewFragment_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteViewFragment_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteViewFragment_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteViewFragment_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteViewFragment_search_autoSuggest_crowdAggs_fields[];
  selected: SiteViewFragment_search_autoSuggest_crowdAggs_selected;
}

export interface SiteViewFragment_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: SiteViewFragment_search_autoSuggest_aggs;
  crowdAggs: SiteViewFragment_search_autoSuggest_crowdAggs;
}

export interface SiteViewFragment_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface SiteViewFragment_search_results_buttons {
  __typename: "ResultsButton";
  items: SiteViewFragment_search_results_buttons_items[];
  location: string;
}

export interface SiteViewFragment_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: SiteViewFragment_search_results_buttons;
}

export interface SiteViewFragment_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteViewFragment_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: SiteViewFragment_search_presearch_aggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteViewFragment_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: SiteViewFragment_search_presearch_aggs_fields[];
  selected: SiteViewFragment_search_presearch_aggs_selected;
}

export interface SiteViewFragment_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteViewFragment_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteViewFragment_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteViewFragment_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteViewFragment_search_presearch_crowdAggs_fields[];
  selected: SiteViewFragment_search_presearch_crowdAggs_selected;
}

export interface SiteViewFragment_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface SiteViewFragment_search_presearch {
  __typename: "SitePresearchPage";
  aggs: SiteViewFragment_search_presearch_aggs;
  crowdAggs: SiteViewFragment_search_presearch_crowdAggs;
  button: SiteViewFragment_search_presearch_button;
  instructions: string;
}

export interface SiteViewFragment_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface SiteViewFragment_search_config {
  __typename: "SiteConfigSection";
  fields: SiteViewFragment_search_config_fields;
}

export interface SiteViewFragment_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteViewFragment_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_aggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: SiteViewFragment_search_aggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteViewFragment_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_aggs {
  __typename: "SiteAggSection";
  fields: SiteViewFragment_search_aggs_fields[];
  selected: SiteViewFragment_search_aggs_selected;
}

export interface SiteViewFragment_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteViewFragment_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteViewFragment_search_crowdAggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteViewFragment_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteViewFragment_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteViewFragment_search_crowdAggs_fields[];
  selected: SiteViewFragment_search_crowdAggs_selected;
}

export interface SiteViewFragment_search {
  __typename: "SiteSearchPage";
  type: string;
  autoSuggest: SiteViewFragment_search_autoSuggest;
  results: SiteViewFragment_search_results;
  presearch: SiteViewFragment_search_presearch;
  fields: string[];
  config: SiteViewFragment_search_config;
  aggs: SiteViewFragment_search_aggs;
  crowdAggs: SiteViewFragment_search_crowdAggs;
}

export interface SiteViewFragment {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: SiteViewFragment_study;
  search: SiteViewFragment_search;
}
