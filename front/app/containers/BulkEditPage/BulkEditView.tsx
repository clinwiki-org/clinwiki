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

interface Undo {
  description : string
  action : ()=>void
}
interface Label {
  name : string
  values : string[]
  selectedValues : string[]
  indeterminiteValues : string[]
}
interface LabelValue {
  name : string
  value : string
}

interface BulkEditProps {
  labels : Label[]
  commit : (toAdd:Label[], toRemove:Label[], description:string) => Undo
}
interface BulkEditState {
  labelsToAdd : LabelValue[]
  labelsToRemove : LabelValue[]
}

class BulkEditView extends React.Component<BulkEditProps, BulkEditState> {
  render() {
    return <div>{this.props.labels}</div>;
  }
}

export default BulkEditView;