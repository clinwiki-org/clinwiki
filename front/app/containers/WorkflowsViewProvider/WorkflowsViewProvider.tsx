import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { WorkflowsViewProviderQuery } from 'types/WorkflowsViewProviderQuery';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';

interface WorkflowsViewProviderProps {
  children: (workflows: WorkflowsViewFragment) => React.ReactNode;
}

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
    suggestedLabelsFilter {
      kind
      values
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

const QUERY = gql`
  query WorkflowsViewProviderQuery {
    workflowsView {
      ...WorkflowsViewFragment
    }
  }

  ${FRAGMENT}
`;

class QueryComponent extends Query<WorkflowsViewProviderQuery> {}

class WorkflowsViewProvider extends React.PureComponent<
  WorkflowsViewProviderProps
> {
  static fragment = FRAGMENT;

  render() {
    return (
      <QueryComponent query={QUERY}>
        {({ data, loading, error }) => {
          if (loading || error || !data) return null;
          return this.props.children(data.workflowsView);
        }}
      </QueryComponent>
    );
  }
}

export default WorkflowsViewProvider;
