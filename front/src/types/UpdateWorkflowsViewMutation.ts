/* tslint:disable */
// This file was automatically generated and should not be edited.

import { UpdateWorkflowsViewInput, FilterKind, FieldDisplay, SortKind } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateWorkflowsViewMutation
// ====================================================

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsConfig_order {
  __typename: "SiteOrder";
  desc: boolean;
  sortKind: SortKind;
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsConfig_visibleOptions {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsConfig {
  __typename: "WorkflowAggField";
  name: string;
  rank: number | null;
  display: FieldDisplay;
  order: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsConfig_order | null;
  visibleOptions: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsConfig_visibleOptions;
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_wikiSectionsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_summaryFieldsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows {
  __typename: "WorkflowConfig";
  allSuggestedLabels: string[];
  allWikiSections: string[];
  allSummaryFields: string[];
  disableAddRating: boolean;
  hideReviews: boolean;
  name: string;
  suggestedLabelsFilter: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsFilter;
  suggestedLabelsConfig: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsConfig[];
  wikiSectionsFilter: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_wikiSectionsFilter;
  summaryFieldsFilter: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_summaryFieldsFilter;
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView {
  __typename: "WorkflowsView";
  id: number;
  workflows: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows[];
}

export interface UpdateWorkflowsViewMutation_updateWorkflowsView {
  __typename: "UpdateWorkflowsViewPayload";
  workflowsView: UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView | null;
  errors: string[] | null;
}

export interface UpdateWorkflowsViewMutation {
  updateWorkflowsView: UpdateWorkflowsViewMutation_updateWorkflowsView | null;
}

export interface UpdateWorkflowsViewMutationVariables {
  input: UpdateWorkflowsViewInput;
}
