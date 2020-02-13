/* tslint:disable */
// This file was automatically generated and should not be edited.

import { UpdateSiteInput, FilterKind, FieldDisplay } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSiteMutation
// ====================================================

export interface UpdateSiteMutation_updateSite_site_editors {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface UpdateSiteMutation_updateSite_site_owners {
  __typename: "User";
  /**
   * Email
   */
  email: string;
}

export interface UpdateSiteMutation_updateSite_site_siteView_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface UpdateSiteMutation_updateSite_site_siteView_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: UpdateSiteMutation_updateSite_site_siteView_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface UpdateSiteMutation_updateSite_site_siteView_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: UpdateSiteMutation_updateSite_site_siteView_study_basicSections[];
  extendedSections: UpdateSiteMutation_updateSite_site_siteView_study_extendedSections[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_aggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteMutation_updateSite_site_siteView_search_aggs_fields_preselected;
  visibleOptions: UpdateSiteMutation_updateSite_site_siteView_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_aggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteMutation_updateSite_site_siteView_search_aggs_fields[];
  selected: UpdateSiteMutation_updateSite_site_siteView_search_aggs_selected;
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_fields_preselected;
  visibleOptions: UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_fields[];
  selected: UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs_selected;
}

export interface UpdateSiteMutation_updateSite_site_siteView_search {
  __typename: "SiteSearchPage";
  fields: string[];
  aggs: UpdateSiteMutation_updateSite_site_siteView_search_aggs;
  crowdAggs: UpdateSiteMutation_updateSite_site_siteView_search_crowdAggs;
}

export interface UpdateSiteMutation_updateSite_site_siteView {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: UpdateSiteMutation_updateSite_site_siteView_study;
  search: UpdateSiteMutation_updateSite_site_siteView_search;
}

export interface UpdateSiteMutation_updateSite_site_siteViews_study_basicSections {
  __typename: "SiteStudyBasicGenericSection";
  hide: boolean;
  title: string;
  name: string;
}

export interface UpdateSiteMutation_updateSite_site_siteViews_study_extendedSections_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_study_extendedSections {
  __typename: "SiteStudyExtendedGenericSection";
  fields: string[];
  hide: boolean;
  order: number | null;
  selected: UpdateSiteMutation_updateSite_site_siteViews_study_extendedSections_selected;
  title: string;
  name: string;
}

export interface UpdateSiteMutation_updateSite_site_siteViews_study {
  __typename: "SiteStudyPage";
  allFields: string[];
  basicSections: UpdateSiteMutation_updateSite_site_siteViews_study_basicSections[];
  extendedSections: UpdateSiteMutation_updateSite_site_siteViews_study_extendedSections[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_aggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_aggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_aggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteMutation_updateSite_site_siteViews_search_aggs_fields_preselected;
  visibleOptions: UpdateSiteMutation_updateSite_site_siteViews_search_aggs_fields_visibleOptions;
  autoSuggest: boolean;
  rank: number | null;
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_aggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_aggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteMutation_updateSite_site_siteViews_search_aggs_fields[];
  selected: UpdateSiteMutation_updateSite_site_siteViews_search_aggs_selected;
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_fields_preselected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_fields_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_fields {
  __typename: "SiteAggField";
  name: string;
  display: FieldDisplay;
  preselected: UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_fields_preselected;
  visibleOptions: UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_fields_visibleOptions;
  rank: number | null;
  autoSuggest: boolean;
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_selected {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs {
  __typename: "SiteAggSection";
  fields: UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_fields[];
  selected: UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs_selected;
}

export interface UpdateSiteMutation_updateSite_site_siteViews_search {
  __typename: "SiteSearchPage";
  fields: string[];
  aggs: UpdateSiteMutation_updateSite_site_siteViews_search_aggs;
  crowdAggs: UpdateSiteMutation_updateSite_site_siteViews_search_crowdAggs;
}

export interface UpdateSiteMutation_updateSite_site_siteViews {
  __typename: "SiteView";
  name: string | null;
  url: string | null;
  id: number;
  default: boolean | null;
  description: string | null;
  study: UpdateSiteMutation_updateSite_site_siteViews_study;
  search: UpdateSiteMutation_updateSite_site_siteViews_search;
}

export interface UpdateSiteMutation_updateSite_site {
  __typename: "Site";
  id: number;
  editors: UpdateSiteMutation_updateSite_site_editors[];
  name: string;
  skipLanding: boolean | null;
  subdomain: string;
  owners: UpdateSiteMutation_updateSite_site_owners[];
  siteView: UpdateSiteMutation_updateSite_site_siteView;
  siteViews: UpdateSiteMutation_updateSite_site_siteViews[];
}

export interface UpdateSiteMutation_updateSite {
  __typename: "UpdateSitePayload";
  site: UpdateSiteMutation_updateSite_site | null;
  errors: string[] | null;
}

export interface UpdateSiteMutation {
  updateSite: UpdateSiteMutation_updateSite | null;
}

export interface UpdateSiteMutationVariables {
  input: UpdateSiteInput;
  url?: string | null;
}
