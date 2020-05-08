/* tslint:disable */
// This file was automatically generated and should not be edited.

import { CreateSiteInput, FilterKind, FieldDisplay } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSiteMutation
// ====================================================

export interface CreateSiteMutation_createSite_site_editors {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface CreateSiteMutation_createSite_site_owners {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface CreateSiteMutation_createSite_site_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface CreateSiteMutation_createSite_site_siteView_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: CreateSiteMutation_createSite_site_siteView_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface CreateSiteMutation_createSite_site_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: CreateSiteMutation_createSite_site_siteView_study_basicSections[];
  extendedSections: CreateSiteMutation_createSite_site_siteView_study_extendedSections[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteView_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_aggs;
  crowdAggs: CreateSiteMutation_createSite_site_siteView_search_autoSuggest_crowdAggs;
}

export interface CreateSiteMutation_createSite_site_siteView_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface CreateSiteMutation_createSite_site_siteView_search_results_buttons {
  __typename: "ResultsButton";
  items: CreateSiteMutation_createSite_site_siteView_search_results_buttons_items[];
  location: string;
}

export interface CreateSiteMutation_createSite_site_siteView_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: CreateSiteMutation_createSite_site_siteView_search_results_buttons;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteView_search_presearch_aggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface CreateSiteMutation_createSite_site_siteView_search_presearch {
  __typename: "SitePresearchPage";
  aggs: CreateSiteMutation_createSite_site_siteView_search_presearch_aggs;
  crowdAggs: CreateSiteMutation_createSite_site_siteView_search_presearch_crowdAggs;
  button: CreateSiteMutation_createSite_site_siteView_search_presearch_button;
  instructions: string;
}

export interface CreateSiteMutation_createSite_site_siteView_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_config {
  __typename: "SiteConfigSection";
  fields: CreateSiteMutation_createSite_site_siteView_search_config_fields;
}

export interface CreateSiteMutation_createSite_site_siteView_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: CreateSiteMutation_createSite_site_siteView_search_aggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteMutation_createSite_site_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteView_search_aggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteView_search_aggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteMutation_createSite_site_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteView_search_crowdAggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteView_search_crowdAggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteView_search {
  __typename: "SiteSearchPage";
  type: string;
  autoSuggest: CreateSiteMutation_createSite_site_siteView_search_autoSuggest;
  results: CreateSiteMutation_createSite_site_siteView_search_results;
  presearch: CreateSiteMutation_createSite_site_siteView_search_presearch;
  fields: string[];
  config: CreateSiteMutation_createSite_site_siteView_search_config;
  aggs: CreateSiteMutation_createSite_site_siteView_search_aggs;
  crowdAggs: CreateSiteMutation_createSite_site_siteView_search_crowdAggs;
}

export interface CreateSiteMutation_createSite_site_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: CreateSiteMutation_createSite_site_siteView_study;
  search: CreateSiteMutation_createSite_site_siteView_search;
}

export interface CreateSiteMutation_createSite_site_siteViews_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface CreateSiteMutation_createSite_site_siteViews_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: CreateSiteMutation_createSite_site_siteViews_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface CreateSiteMutation_createSite_site_siteViews_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: CreateSiteMutation_createSite_site_siteViews_study_basicSections[];
  extendedSections: CreateSiteMutation_createSite_site_siteViews_study_extendedSections[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_aggs;
  crowdAggs: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest_crowdAggs;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_results_buttons {
  __typename: "ResultsButton";
  items: CreateSiteMutation_createSite_site_siteViews_search_results_buttons_items[];
  location: string;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: CreateSiteMutation_createSite_site_siteViews_search_results_buttons;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_presearch {
  __typename: "SitePresearchPage";
  aggs: CreateSiteMutation_createSite_site_siteViews_search_presearch_aggs;
  crowdAggs: CreateSiteMutation_createSite_site_siteViews_search_presearch_crowdAggs;
  button: CreateSiteMutation_createSite_site_siteViews_search_presearch_button;
  instructions: string;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_config {
  __typename: "SiteConfigSection";
  fields: CreateSiteMutation_createSite_site_siteViews_search_config_fields;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_aggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteViews_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: CreateSiteMutation_createSite_site_siteViews_search_aggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteViews_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_aggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteViews_search_aggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteViews_search_aggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields_preselected;
  visibleOptions: CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface CreateSiteMutation_createSite_site_siteViews_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_fields[];
  selected: CreateSiteMutation_createSite_site_siteViews_search_crowdAggs_selected;
}

export interface CreateSiteMutation_createSite_site_siteViews_search {
  __typename: "SiteSearchPage";
  type: string;
  autoSuggest: CreateSiteMutation_createSite_site_siteViews_search_autoSuggest;
  results: CreateSiteMutation_createSite_site_siteViews_search_results;
  presearch: CreateSiteMutation_createSite_site_siteViews_search_presearch;
  fields: string[];
  config: CreateSiteMutation_createSite_site_siteViews_search_config;
  aggs: CreateSiteMutation_createSite_site_siteViews_search_aggs;
  crowdAggs: CreateSiteMutation_createSite_site_siteViews_search_crowdAggs;
}

export interface CreateSiteMutation_createSite_site_siteViews {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: CreateSiteMutation_createSite_site_siteViews_study;
  search: CreateSiteMutation_createSite_site_siteViews_search;
}

export interface CreateSiteMutation_createSite_site {
  __typename: "Site";
  id: number;
  editors: CreateSiteMutation_createSite_site_editors[];
  name: string;
  skipLanding: boolean | null;
  subdomain: string;
  themes: string;
  owners: CreateSiteMutation_createSite_site_owners[];
  siteView: CreateSiteMutation_createSite_site_siteView;
  siteViews: CreateSiteMutation_createSite_site_siteViews[];
}

export interface CreateSiteMutation_createSite {
  __typename: "CreateSitePayload";
  site: CreateSiteMutation_createSite_site | null;
  errors: string[] | null;
}

export interface CreateSiteMutation {
  createSite: CreateSiteMutation_createSite | null;
}

export interface CreateSiteMutationVariables {
  input: CreateSiteInput;
  url?: string | null;
}
