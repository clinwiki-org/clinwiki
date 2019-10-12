import * as React from 'react';
import { match } from 'react-router';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { displayFields } from 'utils/siteViewHelpers';
import {
  path,
  drop,
  addIndex,
  map,
  pipe,
  isNil,
  find,
  propEq,
  lensPath,
  set,
  keys,
  reject,
  filter,
  equals,
  isEmpty,
  prop,
} from 'ramda';
import SiteProvider from 'containers/SiteProvider';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider';
import BulkEditView from './BulkEditView'

interface BulkEditProps {
  match: match<{ searchId?: string }>;
}
class BulkEditPage extends React.PureComponent<BulkEditProps> {
  render() {
      return (
        <WorkflowsViewProvider>
          {workflowsView => {
            const workflow = pipe(
              prop('workflows'),
              find(propEq('name', "wf_bulk")),
            )(workflowsView) as WorkflowConfigFragment | null;
         
            if (workflow) {
              const allowedSuggestedLabels = displayFields(
                workflow.suggestedLabelsFilter.kind,
                workflow.suggestedLabelsFilter.values,
                workflow.allSuggestedLabels.map(name => ({ name, rank: null })),
              ).map(prop('name'));
                
              return <BulkEditView labels={allowedSuggestedLabels} />

            }
            else {
              return null;
            }
          }}
        </WorkflowsViewProvider>
      )
  }
}

export default BulkEditPage;