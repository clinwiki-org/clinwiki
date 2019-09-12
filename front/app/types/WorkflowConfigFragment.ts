/* tslint:disable */
// This file was automatically generated and should not be edited.

import { FilterKind } from "./globalTypes";

// ====================================================
// GraphQL fragment: WorkflowConfigFragment
// ====================================================

export interface WorkflowConfigFragment_suggestedLabelsFilter {
  __typename: "SiteSelect";
  kind: FilterKind;
  values: string[];
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
  wikiSectionsFilter: WorkflowConfigFragment_wikiSectionsFilter;
  summaryFieldsFilter: WorkflowConfigFragment_summaryFieldsFilter;
}
