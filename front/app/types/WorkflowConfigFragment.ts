/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind, FieldDisplay, SortKind } from "./globalTypes";

// ====================================================
// GraphQL fragment: WorkflowConfigFragment
// ====================================================

export interface WorkflowConfigFragment_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowConfigFragment_suggestedLabelsConfig_order {
  __typename: "SiteOrder";
  desc: boolean;
  sortKind: SortKind;
}

export interface WorkflowConfigFragment_suggestedLabelsConfig_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowConfigFragment_suggestedLabelsConfig {
  __typename: "WorkflowAggField";
  name: string;
  rank: number | null;
  display: FieldDisplay;
  order: WorkflowConfigFragment_suggestedLabelsConfig_order | null;
  visibleOptions: WorkflowConfigFragment_suggestedLabelsConfig_visibleOptions;
}

export interface WorkflowConfigFragment_wikiSectionsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowConfigFragment_summaryFieldsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowConfigFragment {
  __typename: "WorkflowConfig";
  allSuggestedLabels: string[];
  allWikiSections: string[];
  allSummaryFields: string[];
  disableAddRating: boolean;
  hideReviews: boolean;
  name: string;
  suggestedLabelsFilter: WorkflowConfigFragment_suggestedLabelsFilter;
  suggestedLabelsConfig: WorkflowConfigFragment_suggestedLabelsConfig[];
  wikiSectionsFilter: WorkflowConfigFragment_wikiSectionsFilter;
  summaryFieldsFilter: WorkflowConfigFragment_summaryFieldsFilter;
}
