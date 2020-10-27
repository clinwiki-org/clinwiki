import { gql } from 'apollo-boost';

const FRAGMENT = gql`
  fragment WorkflowsViewFragment on WorkflowsView {
    id
    workflows {
      ...WorkflowConfigFragment
    }
  }

  fragment WorkflowConfigFragment on WorkflowConfig {
    allSuggestedLabels
    allWikiSections
    allSummaryFields
    disableAddRating
    hideReviews
    name
    summaryTemplate
    suggestedLabelsFilter {
      kind
      values
    }
    suggestedLabelsConfig {
      name
      rank
      display
      order {
        desc
        sortKind
      }
      visibleOptions {
        kind
        values
      }
    }
    wikiSectionsFilter {
      kind
      values
    }
    summaryFieldsFilter {
      kind
      values
    }
  }
`;

export const mutation = gql`
  mutation UpdateWorkflowsViewMutation($input: UpdateWorkflowsViewInput!) {
    updateWorkflowsView(input: $input) {
      workflowsView {
        ...WorkflowsViewFragment
      }
      errors
    }
  }

  ${FRAGMENT}
`;

export const query = gql`
  query WorkflowsViewProviderQuery {
    workflowsView {
      ...WorkflowsViewFragment
    }
  }

  ${FRAGMENT}
`;
