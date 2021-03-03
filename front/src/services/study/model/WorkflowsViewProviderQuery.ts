/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FilterKind, FieldDisplay, SortKind } from "../../../types/globalTypes";

// ====================================================
// GraphQL query operation: WorkflowsViewProviderQuery
// ====================================================

export interface WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsConfig_order {
  __typename: "SiteOrder";
  desc: boolean;
  sortKind: SortKind;
}

export interface WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsConfig_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsConfig {
  __typename: "WorkflowAggField";
  name: string;
  rank: number | null;
  display: FieldDisplay;
  order: WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsConfig_order | null;
  visibleOptions: WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsConfig_visibleOptions;
}

export interface WorkflowsViewProviderQuery_workflowsView_workflows_wikiSectionsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewProviderQuery_workflowsView_workflows_summaryFieldsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface WorkflowsViewProviderQuery_workflowsView_workflows {
  __typename: "WorkflowConfig";
  allSuggestedLabels: string[];
  allWikiSections: string[];
  allSummaryFields: string[];
  disableAddRating: boolean;
  hideReviews: boolean;
  name: string;
  summaryTemplate: string;
  suggestedLabelsFilter: WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsFilter;
  suggestedLabelsConfig: WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsConfig[];
  wikiSectionsFilter: WorkflowsViewProviderQuery_workflowsView_workflows_wikiSectionsFilter;
  summaryFieldsFilter: WorkflowsViewProviderQuery_workflowsView_workflows_summaryFieldsFilter;
}

export interface WorkflowsViewProviderQuery_workflowsView {
  __typename: "WorkflowsView";
  id: number;
  workflows: WorkflowsViewProviderQuery_workflowsView_workflows[];
}

export interface WorkflowsViewProviderQuery {
  /**
   * Workflows config
   */
  workflowsView: WorkflowsViewProviderQuery_workflowsView;
}
