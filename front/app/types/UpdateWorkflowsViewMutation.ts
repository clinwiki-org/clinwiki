/* tslint:disable */
// This file was automatically generated and should not be edited.

import { UpdateWorkflowsViewInput, FilterKind } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateWorkflowsViewMutation
// ====================================================

export interface UpdateWorkflowsViewMutation_updateWorkflowsView_workflowsView_workflows_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
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
