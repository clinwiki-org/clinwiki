/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SortKind, FieldDisplay, FilterKind } from "./globalTypes";

// ====================================================
// GraphQL fragment: SiteViewFragment
// ====================================================

export interface SiteViewFragment_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface SiteViewFragment_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  template: string | null;
  hide: boolean;
  order: number | null;
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
  sortKind: SortKind;
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
  sortKind: SortKind;
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

export interface SiteViewFragment_search_crumbs {
  __typename: "CrumbResultSection";
  search: boolean;
}

export interface SiteViewFragment_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
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

export interface SiteViewFragment_search_presearch_aggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface SiteViewFragment_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: SiteViewFragment_search_presearch_aggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: SiteViewFragment_search_presearch_aggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  sortKind: SortKind;
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

export interface SiteViewFragment_search_presearch_crowdAggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface SiteViewFragment_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: SiteViewFragment_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: SiteViewFragment_search_presearch_crowdAggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  sortKind: SortKind;
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

export interface SiteViewFragment_search_aggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface SiteViewFragment_search_aggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: SiteViewFragment_search_aggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: SiteViewFragment_search_aggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  sortKind: SortKind;
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

export interface SiteViewFragment_search_crowdAggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface SiteViewFragment_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteViewFragment_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: SiteViewFragment_search_crowdAggs_fields_preselected;
  visibleOptions: SiteViewFragment_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: SiteViewFragment_search_crowdAggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  template: string;
  autoSuggest: SiteViewFragment_search_autoSuggest;
  results: SiteViewFragment_search_results;
  crumbs: SiteViewFragment_search_crumbs;
  presearch: SiteViewFragment_search_presearch;
  sortables: string[];
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
