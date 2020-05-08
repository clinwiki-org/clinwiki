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

export interface SiteFragment_siteView_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteView_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteView_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteView_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteFragment_siteView_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteView_search_autoSuggest_aggs_fields[];
  selected: SiteFragment_siteView_search_autoSuggest_aggs_selected;
}

export interface SiteFragment_siteView_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteView_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteView_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteView_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteFragment_siteView_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteView_search_autoSuggest_crowdAggs_fields[];
  selected: SiteFragment_siteView_search_autoSuggest_crowdAggs_selected;
}

export interface SiteFragment_siteView_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: SiteFragment_siteView_search_autoSuggest_aggs;
  crowdAggs: SiteFragment_siteView_search_autoSuggest_crowdAggs;
}

export interface SiteFragment_siteView_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface SiteFragment_siteView_search_results_buttons {
  __typename: "ResultsButton";
  items: SiteFragment_siteView_search_results_buttons_items[];
  location: string;
}

export interface SiteFragment_siteView_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: SiteFragment_siteView_search_results_buttons;
}

export interface SiteFragment_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteView_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: SiteFragment_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteFragment_siteView_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteView_search_presearch_aggs_fields[];
  selected: SiteFragment_siteView_search_presearch_aggs_selected;
}

export interface SiteFragment_siteView_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteView_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteFragment_siteView_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteView_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteView_search_presearch_crowdAggs_fields[];
  selected: SiteFragment_siteView_search_presearch_crowdAggs_selected;
}

export interface SiteFragment_siteView_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface SiteFragment_siteView_search_presearch {
  __typename: "SitePresearchPage";
  aggs: SiteFragment_siteView_search_presearch_aggs;
  crowdAggs: SiteFragment_siteView_search_presearch_crowdAggs;
  button: SiteFragment_siteView_search_presearch_button;
  instructions: string;
}

export interface SiteFragment_siteView_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface SiteFragment_siteView_search_config {
  __typename: "SiteConfigSection";
  fields: SiteFragment_siteView_search_config_fields;
}

export interface SiteFragment_siteView_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
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
  order: SiteFragment_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: SiteFragment_siteView_search_aggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
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

export interface SiteFragment_siteView_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
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
  order: SiteFragment_siteView_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: SiteFragment_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
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
  type: string;
  autoSuggest: SiteFragment_siteView_search_autoSuggest;
  results: SiteFragment_siteView_search_results;
  presearch: SiteFragment_siteView_search_presearch;
  fields: string[];
  config: SiteFragment_siteView_search_config;
  aggs: SiteFragment_siteView_search_aggs;
  crowdAggs: SiteFragment_siteView_search_crowdAggs;
}

export interface SiteFragment_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: SiteFragment_siteView_study;
  search: SiteFragment_siteView_search;
}

export interface SiteFragment_siteViews_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface SiteFragment_siteViews_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: SiteFragment_siteViews_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface SiteFragment_siteViews_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: SiteFragment_siteViews_study_basicSections[];
  extendedSections: SiteFragment_siteViews_study_extendedSections[];
}

export interface SiteFragment_siteViews_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteViews_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteViews_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteViews_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: SiteFragment_siteViews_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteFragment_siteViews_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteViews_search_autoSuggest_aggs_fields[];
  selected: SiteFragment_siteViews_search_autoSuggest_aggs_selected;
}

export interface SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteFragment_siteViews_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteViews_search_autoSuggest_crowdAggs_fields[];
  selected: SiteFragment_siteViews_search_autoSuggest_crowdAggs_selected;
}

export interface SiteFragment_siteViews_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: SiteFragment_siteViews_search_autoSuggest_aggs;
  crowdAggs: SiteFragment_siteViews_search_autoSuggest_crowdAggs;
}

export interface SiteFragment_siteViews_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface SiteFragment_siteViews_search_results_buttons {
  __typename: "ResultsButton";
  items: SiteFragment_siteViews_search_results_buttons_items[];
  location: string;
}

export interface SiteFragment_siteViews_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: SiteFragment_siteViews_search_results_buttons;
}

export interface SiteFragment_siteViews_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteViews_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteViews_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: SiteFragment_siteViews_search_presearch_aggs_fields_preselected;
  visibleOptions: SiteFragment_siteViews_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteFragment_siteViews_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteViews_search_presearch_aggs_fields[];
  selected: SiteFragment_siteViews_search_presearch_aggs_selected;
}

export interface SiteFragment_siteViews_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteViews_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteViews_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteViews_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: SiteFragment_siteViews_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteFragment_siteViews_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteViews_search_presearch_crowdAggs_fields[];
  selected: SiteFragment_siteViews_search_presearch_crowdAggs_selected;
}

export interface SiteFragment_siteViews_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface SiteFragment_siteViews_search_presearch {
  __typename: "SitePresearchPage";
  aggs: SiteFragment_siteViews_search_presearch_aggs;
  crowdAggs: SiteFragment_siteViews_search_presearch_crowdAggs;
  button: SiteFragment_siteViews_search_presearch_button;
  instructions: string;
}

export interface SiteFragment_siteViews_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface SiteFragment_siteViews_search_config {
  __typename: "SiteConfigSection";
  fields: SiteFragment_siteViews_search_config_fields;
}

export interface SiteFragment_siteViews_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteViews_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_aggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteViews_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: SiteFragment_siteViews_search_aggs_fields_preselected;
  visibleOptions: SiteFragment_siteViews_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface SiteFragment_siteViews_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_aggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteViews_search_aggs_fields[];
  selected: SiteFragment_siteViews_search_aggs_selected;
}

export interface SiteFragment_siteViews_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: string;
  desc: boolean;
}

export interface SiteFragment_siteViews_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: SiteFragment_siteViews_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: SiteFragment_siteViews_search_crowdAggs_fields_preselected;
  visibleOptions: SiteFragment_siteViews_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface SiteFragment_siteViews_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface SiteFragment_siteViews_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: SiteFragment_siteViews_search_crowdAggs_fields[];
  selected: SiteFragment_siteViews_search_crowdAggs_selected;
}

export interface SiteFragment_siteViews_search {
  __typename: "SiteSearchPage";
  type: string;
  autoSuggest: SiteFragment_siteViews_search_autoSuggest;
  results: SiteFragment_siteViews_search_results;
  presearch: SiteFragment_siteViews_search_presearch;
  fields: string[];
  config: SiteFragment_siteViews_search_config;
  aggs: SiteFragment_siteViews_search_aggs;
  crowdAggs: SiteFragment_siteViews_search_crowdAggs;
}

export interface SiteFragment_siteViews {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: SiteFragment_siteViews_study;
  search: SiteFragment_siteViews_search;
}

export interface SiteFragment {
  __typename: "Site";
  id: number;
  editors: SiteFragment_editors[];
  name: string;
  skipLanding: boolean | null;
  subdomain: string;
  themes: string;
  owners: SiteFragment_owners[];
  siteView: SiteFragment_siteView;
  siteViews: SiteFragment_siteViews[];
}
