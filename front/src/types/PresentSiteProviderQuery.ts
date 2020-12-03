/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SortKind, FieldDisplay, FilterKind } from "./globalTypes";

// ====================================================
// GraphQL query operation: PresentSiteProviderQuery
// ====================================================

export interface PresentSiteProviderQuery_site_editors {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface PresentSiteProviderQuery_site_owners {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface PresentSiteProviderQuery_site_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface PresentSiteProviderQuery_site_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  template: string | null;
  hide: boolean;
  order: number | null;
  title: string;
  name: string;
}

export interface PresentSiteProviderQuery_site_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: PresentSiteProviderQuery_site_siteView_study_basicSections[];
  extendedSections: PresentSiteProviderQuery_site_siteView_study_extendedSections[];
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields_preselected;
  visibleOptions: PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs {
  __typename: "SiteAggSection";
  fields: PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_fields[];
  selected: PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs_selected;
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  preselected: PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields_preselected;
  visibleOptions: PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs {
  __typename: "SiteAggSection";
  fields: PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_fields[];
  selected: PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs_selected;
}

export interface PresentSiteProviderQuery_site_siteView_search_autoSuggest {
  __typename: "SiteAutoSuggestSection";
  aggs: PresentSiteProviderQuery_site_siteView_search_autoSuggest_aggs;
  crowdAggs: PresentSiteProviderQuery_site_siteView_search_autoSuggest_crowdAggs;
}

export interface PresentSiteProviderQuery_site_siteView_search_results_buttons_items {
  __typename: "ResultButtonItems";
  icon: string;
  target: string;
}

export interface PresentSiteProviderQuery_site_siteView_search_results_buttons {
  __typename: "ResultsButton";
  items: PresentSiteProviderQuery_site_siteView_search_results_buttons_items[];
  location: string;
}

export interface PresentSiteProviderQuery_site_siteView_search_results {
  __typename: "SiteResultsSection";
  type: string;
  buttons: PresentSiteProviderQuery_site_siteView_search_results_buttons;
}

export interface PresentSiteProviderQuery_site_siteView_search_crumbs {
  __typename: "CrumbResultSection";
  search: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields_preselected;
  visibleOptions: PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_aggs {
  __typename: "SiteAggSection";
  fields: PresentSiteProviderQuery_site_siteView_search_presearch_aggs_fields[];
  selected: PresentSiteProviderQuery_site_siteView_search_presearch_aggs_selected;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields_preselected;
  visibleOptions: PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs {
  __typename: "SiteAggSection";
  fields: PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_fields[];
  selected: PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs_selected;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch_button {
  __typename: "PresearchButtonSection";
  name: string;
  target: string;
}

export interface PresentSiteProviderQuery_site_siteView_search_presearch {
  __typename: "SitePresearchPage";
  aggs: PresentSiteProviderQuery_site_siteView_search_presearch_aggs;
  crowdAggs: PresentSiteProviderQuery_site_siteView_search_presearch_crowdAggs;
  button: PresentSiteProviderQuery_site_siteView_search_presearch_button;
  instructions: string;
}

export interface PresentSiteProviderQuery_site_siteView_search_config_fields {
  __typename: "SiteConfigField";
  showPresearch: boolean;
  showFacetBar: boolean;
  showAutoSuggest: boolean;
  showBreadCrumbs: boolean;
  showResults: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_config {
  __typename: "SiteConfigSection";
  fields: PresentSiteProviderQuery_site_siteView_search_config_fields;
}

export interface PresentSiteProviderQuery_site_siteView_search_aggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteProviderQuery_site_siteView_search_aggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteProviderQuery_site_siteView_search_aggs_fields_preselected;
  visibleOptions: PresentSiteProviderQuery_site_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteProviderQuery_site_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: PresentSiteProviderQuery_site_siteView_search_aggs_fields[];
  selected: PresentSiteProviderQuery_site_siteView_search_aggs_selected;
}

export interface PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields_order {
  __typename: "SiteOrder";
  sortKind: SortKind;
  desc: boolean;
}

export interface PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  order: PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields_order | null;
  name: string;
  display: FieldDisplay;
  displayName: string;
  preselected: PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
  rangeStartLabel: string | null;
  rangeEndLabel: string | null;
}

export interface PresentSiteProviderQuery_site_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface PresentSiteProviderQuery_site_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: PresentSiteProviderQuery_site_siteView_search_crowdAggs_fields[];
  selected: PresentSiteProviderQuery_site_siteView_search_crowdAggs_selected;
}

export interface PresentSiteProviderQuery_site_siteView_search {
  __typename: "SiteSearchPage";
  type: string;
  template: string;
  autoSuggest: PresentSiteProviderQuery_site_siteView_search_autoSuggest;
  results: PresentSiteProviderQuery_site_siteView_search_results;
  crumbs: PresentSiteProviderQuery_site_siteView_search_crumbs;
  presearch: PresentSiteProviderQuery_site_siteView_search_presearch;
  sortables: string[];
  fields: string[];
  config: PresentSiteProviderQuery_site_siteView_search_config;
  aggs: PresentSiteProviderQuery_site_siteView_search_aggs;
  crowdAggs: PresentSiteProviderQuery_site_siteView_search_crowdAggs;
}

export interface PresentSiteProviderQuery_site_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: PresentSiteProviderQuery_site_siteView_study;
  search: PresentSiteProviderQuery_site_siteView_search;
}

export interface PresentSiteProviderQuery_site_pageView {
  __typename: "PageView";
  id: number;
  pageType: string;
  template: string;
  title: string;
  url: string;
  default: boolean;
}

export interface PresentSiteProviderQuery_site {
  __typename: "Site";
  id: number;
  editors: PresentSiteProviderQuery_site_editors[];
  name: string;
  skipLanding: boolean | null;
  subdomain: string;
  themes: string;
  reactionsConfig: string;
  userRank: string;
  owners: PresentSiteProviderQuery_site_owners[];
  siteView: PresentSiteProviderQuery_site_siteView;
  pageView: PresentSiteProviderQuery_site_pageView | null;
}

export interface PresentSiteProviderQuery {
  /**
   * If id is missing, returns current site. If id == 0, returns default site
   */
  site: PresentSiteProviderQuery_site | null;
}

export interface PresentSiteProviderQueryVariables {
  id?: number | null;
  url?: string | null;
}
