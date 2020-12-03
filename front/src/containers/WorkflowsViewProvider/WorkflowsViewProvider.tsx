import * as React from 'react';
import { Query, QueryComponentOptions, useQuery } from 'react-apollo';
import { WorkflowsViewProviderQuery } from 'types/WorkflowsViewProviderQuery';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { query } from 'queries/WorkflowsViewProviderquery';

interface WorkflowsViewProviderProps {
  children: (workflows: WorkflowsViewFragment) => React.ReactNode;
}

const QueryComponent = (
  props: QueryComponentOptions<WorkflowsViewProviderQuery>
) => Query(props);

class WorkflowsViewProvider extends React.PureComponent<
  WorkflowsViewProviderProps
> {
  render() {
    return (
      <QueryComponent query={query}>
        {({ data, loading, error }) => {
          if (loading || error || !data) return null;
          return this.props.children(data.workflowsView) as JSX.Element;
        }}
      </QueryComponent>
    );
  }
}


export default WorkflowsViewProvider;

export function useWorkflowsView() {
  return useQuery<WorkflowsViewProviderQuery>(query);
}