import * as React from 'react';
import { match } from 'react-router';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { SiteFragment } from 'types/SiteFragment';
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

interface BulkEditProps {
  labels : String[]
}
interface BulkEditState {
}

class BulkEditView extends React.Component<BulkEditProps, BulkEditState> {
  // Load wf_bulk workflow properties (if they exist)
  // Load facets
  // store facet changes in state
  render() {
    // See: WorkflowsPage -> SuggestedLabels
    return <div>{this.props.labels}</div>;
  }
}

export default BulkEditView;