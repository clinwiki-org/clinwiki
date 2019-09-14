/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind } from "./globalTypes";

// ====================================================
// GraphQL fragment: WorkflowsViewFragment
// ====================================================

export interface WorkflowsViewFragment_workflows_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
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
  suggestedLabelsFilter: WorkflowsViewFragment_workflows_suggestedLabelsFilter;
  wikiSectionsFilter: WorkflowsViewFragment_workflows_wikiSectionsFilter;
  summaryFieldsFilter: WorkflowsViewFragment_workflows_summaryFieldsFilter;
}

export interface WorkflowsViewFragment {
  __typename: "WorkflowsView";
  id: number;
  workflows: WorkflowsViewFragment_workflows[];
}
