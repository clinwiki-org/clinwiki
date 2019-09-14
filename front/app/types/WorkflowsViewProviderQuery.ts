/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind } from "./globalTypes";

// ====================================================
// GraphQL query operation: WorkflowsViewProviderQuery
// ====================================================

export interface WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
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
  suggestedLabelsFilter: WorkflowsViewProviderQuery_workflowsView_workflows_suggestedLabelsFilter;
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
