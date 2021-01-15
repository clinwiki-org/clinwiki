/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateSiteViewInput, SortKind, FieldDisplay, FilterKind } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSiteViewMutation
// ====================================================

export interface CreateSiteViewMutation_createSiteView_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface CreateSiteViewMutation_createSiteView_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  template: string | null;
  hide: boolean;
  order: number | null;
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
  sortKind: SortKind;
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
  sortKind: SortKind;
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

export interface CreateSiteViewMutation_createSiteView_siteView_search_crumbs {
  __typename: "CrumbResultSection";
  search: boolean;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
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

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: CreateSiteViewMutation_createSiteView_siteView_search_presearch_aggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  sortKind: SortKind;
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

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: CreateSiteViewMutation_createSiteView_siteView_search_presearch_crowdAggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  sortKind: SortKind;
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

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: CreateSiteViewMutation_createSiteView_siteView_search_aggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  sortKind: SortKind;
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

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_bucketKeyValuePairs {
  __typename: "BucketKeyValuePairs";
  key: string | null;
  label: string | null;
}

export interface CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  aggSublabel: string | null;
  preselected: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
  bucketKeyValuePairs: CreateSiteViewMutation_createSiteView_siteView_search_crowdAggs_fields_bucketKeyValuePairs[] | null;
  showAllowMissing: boolean | null;
  showFilterToolbar: boolean | null;
  defaultToOpen: boolean | null;
  layout: string | null;
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
  template: string;
  autoSuggest: CreateSiteViewMutation_createSiteView_siteView_search_autoSuggest;
  results: CreateSiteViewMutation_createSiteView_siteView_search_results;
  crumbs: CreateSiteViewMutation_createSiteView_siteView_search_crumbs;
  presearch: CreateSiteViewMutation_createSiteView_siteView_search_presearch;
  sortables: string[];
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
