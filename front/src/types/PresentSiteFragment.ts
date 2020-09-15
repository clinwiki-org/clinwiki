/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SortKind, FieldDisplay, FilterKind } from "./globalTypes";

// ====================================================
// GraphQL fragment: PresentSiteFragment
// ====================================================

export interface PresentSiteFragment_editors {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface PresentSiteFragment_owners {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface PresentSiteFragment_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface PresentSiteFragment_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  template: string | null;
  hide: boolean;
  order: number | null;
  title: string;
  name: string;
}

export interface PresentSiteFragment_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: PresentSiteFragment_siteView_study_basicSections[];
  extendedSections: PresentSiteFragment_siteView_study_extendedSections[];
}

export interface PresentSiteFragment_siteView_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteFragment_siteView_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteFragment_siteView_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: PresentSiteFragment_siteView_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: PresentSiteFragment_siteView_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface PresentSiteFragment_siteView_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: PresentSiteFragment_siteView_search_autoSuggest_aggs_fields[];
  selected: PresentSiteFragment_siteView_search_autoSuggest_aggs_selected;
}

export interface PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_fields[];
  selected: PresentSiteFragment_siteView_search_autoSuggest_crowdAggs_selected;
}

export interface PresentSiteFragment_siteView_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: PresentSiteFragment_siteView_search_autoSuggest_aggs;
  crowdAggs: PresentSiteFragment_siteView_search_autoSuggest_crowdAggs;
}

export interface PresentSiteFragment_siteView_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface PresentSiteFragment_siteView_search_results_buttons {
  __typename: "ResultsButton";
  items: PresentSiteFragment_siteView_search_results_buttons_items[];
  location: string;
}

export interface PresentSiteFragment_siteView_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: PresentSiteFragment_siteView_search_results_buttons;
}

export interface PresentSiteFragment_siteView_search_crumbs {
  __typename: "CrumbResultSection";
  search: boolean;
}

export interface PresentSiteFragment_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteFragment_siteView_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteFragment_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteFragment_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: PresentSiteFragment_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteFragment_siteView_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: PresentSiteFragment_siteView_search_presearch_aggs_fields[];
  selected: PresentSiteFragment_siteView_search_presearch_aggs_selected;
}

export interface PresentSiteFragment_siteView_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteFragment_siteView_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteFragment_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteFragment_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: PresentSiteFragment_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteFragment_siteView_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: PresentSiteFragment_siteView_search_presearch_crowdAggs_fields[];
  selected: PresentSiteFragment_siteView_search_presearch_crowdAggs_selected;
}

export interface PresentSiteFragment_siteView_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface PresentSiteFragment_siteView_search_presearch {
  __typename: "SitePresearchPage";
  aggs: PresentSiteFragment_siteView_search_presearch_aggs;
  crowdAggs: PresentSiteFragment_siteView_search_presearch_crowdAggs;
  button: PresentSiteFragment_siteView_search_presearch_button;
  instructions: string;
}

export interface PresentSiteFragment_siteView_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface PresentSiteFragment_siteView_search_config {
  __typename: "SiteConfigSection";
  fields: PresentSiteFragment_siteView_search_config_fields;
}

export interface PresentSiteFragment_siteView_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteFragment_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteFragment_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteFragment_siteView_search_aggs_fields_preselected;
  visibleOptions: PresentSiteFragment_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteFragment_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: PresentSiteFragment_siteView_search_aggs_fields[];
  selected: PresentSiteFragment_siteView_search_aggs_selected;
}

export interface PresentSiteFragment_siteView_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteFragment_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteFragment_siteView_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteFragment_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: PresentSiteFragment_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteFragment_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteFragment_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: PresentSiteFragment_siteView_search_crowdAggs_fields[];
  selected: PresentSiteFragment_siteView_search_crowdAggs_selected;
}

export interface PresentSiteFragment_siteView_search {
  __typename: "SiteSearchPage";
  type: string;
  template: string;
  autoSuggest: PresentSiteFragment_siteView_search_autoSuggest;
  results: PresentSiteFragment_siteView_search_results;
  crumbs: PresentSiteFragment_siteView_search_crumbs;
  presearch: PresentSiteFragment_siteView_search_presearch;
  sortables: string[];
  fields: string[];
  config: PresentSiteFragment_siteView_search_config;
  aggs: PresentSiteFragment_siteView_search_aggs;
  crowdAggs: PresentSiteFragment_siteView_search_crowdAggs;
}

export interface PresentSiteFragment_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: PresentSiteFragment_siteView_study;
  search: PresentSiteFragment_siteView_search;
}

export interface PresentSiteFragment_pageView {
  __typename: "PageView";
  id: number;
  pageType: string;
  template: string;
  title: string;
  url: string;
  default: boolean;
}

export interface PresentSiteFragment {
  __typename: "Site";
  id: number;
  editors: PresentSiteFragment_editors[];
  name: string;
  skipLanding: boolean | null;
  subdomain: string;
  themes: string;
  reactionsConfig: string;
  userRank: string;
  owners: PresentSiteFragment_owners[];
  siteView: PresentSiteFragment_siteView;
  pageView: PresentSiteFragment_pageView | null;
}
