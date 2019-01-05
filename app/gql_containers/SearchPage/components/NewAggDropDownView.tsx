import * as React from 'react';
import * as _ from 'lodash';
import styled from 'styled-components';
import { Panel, Checkbox, FormControl } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';
import { AggBucket, AggCallback } from '../Types'
import { BeatLoader } from 'react-spinners';



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

const PanelWrapper = styled.div`
.panel {
  margin-top: 5px;
  margin-bottom: 0px;
}
.panel-heading {
  margin: 0px;
  padding: 5px;
}
.panel-title {
  margin: 0px;
  font-size: 14px;
  width: 100%;
}
.flex {
  display:flex;
  justify-content: space-between;
}
.checkbox {
  margin: 3px 0px;
}
.panel-body {
  padding: 5px;
  overflow-x: auto;
  max-height: 400px;
}
`

export class AggDropDownView extends React.PureComponent<AggDropDownViewProps> {
  render_body() {
    if (!this.props.isOpen) return null;
    else if (this.props.loading) return <BeatLoader key="loader" color="#333" /> 
    const {
      agg,
      buckets
    }= this.props;

    return Object.keys(buckets).map(key => {
      return <Checkbox
          key={key}
          onChange={()=> {console.log("todo: toggle this key in teh set")}}>
          {aggKeyToInner(agg, buckets[key].key)}
          <span> ({buckets[key].docCount})</span>
        </Checkbox>
    })
  }
  render() {
    let {
        agg,
        isOpen,
        onLoadMore,
    } = this.props;

    const title = aggToField(agg)
    const icon = "chevron" + (isOpen ? "-up" : "-down")
    return (
      <PanelWrapper>
      <Panel onToggle={onLoadMore}>
        <Panel.Heading>
          <Panel.Title toggle>
            <div className="flex">
              <span>{title}</span>
              <span> <FontAwesome name={icon} /> </span>
            </div>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <FormControl
              type="text"
              placeholder="filter"
            />
          </Panel.Body>
          <Panel.Body>
            { this.render_body() }
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
      </PanelWrapper>
    );
  }
}