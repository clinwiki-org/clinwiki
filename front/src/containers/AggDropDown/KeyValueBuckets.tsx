import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { AggBucket } from '../SearchPage/Types';
import { Checkbox } from 'react-bootstrap';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import Bucket from './Bucket';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import {
  Row,
  Col,
  Panel,
  PanelGroup,
  DropdownButton,
  MenuItem,
  FormControl,
  InputGroup
} from 'react-bootstrap';
interface KeyValueBucketsProps {
  field: any;
  display: FieldDisplay;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  // isSelected: any;
  updater: AggFilterInputUpdater;
}

class KeyValueBuckets extends React.Component<KeyValueBucketsProps> {
  // Need to add logic to parse through our bucketKeyValuePairs
  render() {
    console.log("Field",this.props.field)
    const { display, buckets, visibleOptions = [], updater } = this.props;
    return buckets
      .filter(
        bucket =>
          !bucketKeyIsMissing(bucket) &&
          (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
      )
      .map(bucket => (
        <InputGroup>

          <InputGroup.Addon>{defaultTo(bucket.key)(bucket.keyAsString)}</InputGroup.Addon>
          <FormControl 
            type="text" 
            name={`set:search.crowd.aggs.fields.${this.props.field.name}.bucketKeyValuePairs`}
            value={this.props.field.bucketKeyValuePairs}
            onChange={(e)=> console.log("Green", e, e.value)}

          />
        </InputGroup>
        // <Checkbox
        //   key={bucket.key}
        //   checked={updater.isSelected(bucket.key)}
        //   onChange={() => updater.toggleFilter(bucket.key)}>
        // <Bucket
        //   value={defaultTo(bucket.key)(bucket.keyAsString)}
        //   display={display}
        //   docCount={bucket.docCount}
        // />
        // </Checkbox>
      ));
  }
}

export default withAggContext(KeyValueBuckets);
