/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FilterKind, FieldDisplay, SortKind } from 'services/site/model/InputTypes';

// ====================================================
// GraphQL fragment: WorkflowsViewFragment
// ====================================================

export interface WorkflowsViewFragment_workflows_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewFragment_workflows_suggestedLabelsConfig_order {
  __typename: "SiteOrder";
  desc: boolean;
  sortKind: SortKind;
}

export interface WorkflowsViewFragment_workflows_suggestedLabelsConfig_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewFragment_workflows_suggestedLabelsConfig {
  __typename: "WorkflowAggField";
  name: string;
  rank: number | null;
  display: FieldDisplay;
  order: WorkflowsViewFragment_workflows_suggestedLabelsConfig_order | null;
  visibleOptions: WorkflowsViewFragment_workflows_suggestedLabelsConfig_visibleOptions;
}

export interface WorkflowsViewFragment_workflows_wikiSectionsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewFragment_workflows_summaryFieldsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewFragment_workflows {
  __typename: "WorkflowConfig";
  allSuggestedLabels: string[];
  allWikiSections: string[];
  allSummaryFields: string[];
  disableAddRating: boolean;
  hideReviews: boolean;
  name: string;
  summaryTemplate: string;
  suggestedLabelsFilter: WorkflowsViewFragment_workflows_suggestedLabelsFilter;
  suggestedLabelsConfig: WorkflowsViewFragment_workflows_suggestedLabelsConfig[];
  wikiSectionsFilter: WorkflowsViewFragment_workflows_wikiSectionsFilter;
  summaryFieldsFilter: WorkflowsViewFragment_workflows_summaryFieldsFilter;
}

export interface WorkflowsViewFragment {
  __typename: "WorkflowsView";
  id: number;
  workflows: WorkflowsViewFragment_workflows[];
}
