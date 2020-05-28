import * as React from 'react';
import { Query } from 'react-apollo';
import { WorkflowsViewProviderQuery } from 'types/WorkflowsViewProviderQuery';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { query } from 'queries/WorkflowsViewProviderquery';

interface WorkflowsViewProviderProps {
  children: (workflows: WorkflowsViewFragment) => React.ReactNode;
}

class QueryComponent extends Query<WorkflowsViewProviderQuery> {}

class WorkflowsViewProvider extends React.PureComponent<
  WorkflowsViewProviderProps
> {
  render() {
    return (
      <QueryComponent query={query}>
        {({ data, loading, error }) => {
          if (loading || error || !data) return null;
          return this.props.children(data.workflowsView);
        }}
      </QueryComponent>
    );
  }
}

export default WorkflowsViewProvider;
