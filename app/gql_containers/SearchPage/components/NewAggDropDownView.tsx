import * as React from 'react';
import * as _ from 'lodash';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { Panel, Label } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';
import { AggBucket, AggCallback } from '../Types'

interface AggDropDownViewProps {
  agg: string
  buckets: AggBucket[]
  selectedKeys : Set<string>
  addFilter: AggCallback
  removeFilter: AggCallback
  loading: boolean
  isOpen: boolean
  onLoadMore: (isopen:boolean) => void
}

/*
 - style header so the icon goes to the right
 - style away giant margin
 - add 'filter' on top (local state=filter?)
 - add busy spinner for loading
 - add scrollable div with checkboxes
 - https://stackoverflow.com/questions/7280389/scrollable-box-containing-list-of-checkboxes-in-html
*/

export class AggDropDownView extends React.PureComponent<AggDropDownViewProps> {
  render() {
    const title = aggToField(this.props.agg)
    const icon = "chevron-circle" + (this.props.isOpen ? "-up" : "-down")
    console.log(icon)
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title toggle>
            <span>
              {title}{' '}
              <FontAwesome 
                name={icon} />
            </span>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            content?
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}