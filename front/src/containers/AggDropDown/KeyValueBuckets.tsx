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
import { find, propEq } from 'ramda';
interface KeyValueBucketsProps {
  field: any;
  display: FieldDisplay;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  // isSelected: any;
  updater: AggFilterInputUpdater;
  handleKeyValueMutations: (e: { currentTarget: { name: string; value: any } }) => void;
}

class KeyValueBuckets extends React.Component<KeyValueBucketsProps> {
  // Need to add logic to parse through our bucketKeyValuePairs
  render() {

    const { display, buckets, visibleOptions = [], updater, field } = this.props;
       console.log("Field", field.bucketKeyValuePairs)
      let parsedKeyValuePairs = JSON.parse(field.bucketKeyValuePairs) || [];
      let tempObjetc = [{key:'green', label: 'this is green'}, {key:'test', label: 'in beta testing'}]
    return buckets
      .filter(
        bucket =>
          !bucketKeyIsMissing(bucket) &&
          (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
      )
      .map(bucket => {
        console.log("Bucket", bucket)
        let bucketName = bucket.key;
        let bucketKeyValuePair= find(propEq('key',bucketName), parsedKeyValuePairs)
        console.log(bucketKeyValuePair)
        let label = bucketKeyValuePair? bucketKeyValuePair.label: ''
        return(
        <InputGroup>

          <InputGroup.Addon>{defaultTo(bucket.key)(bucket.keyAsString)}</InputGroup.Addon>
          <FormControl 
            type="text" 
            name={`set:search.crowdAggs.fields.${this.props.field.name}.bucketKeyValuePairs`}
            value={label}
             onChange=
            {(e: {
              currentTarget: { name: string; value: any };
            }) => {
          if(bucketKeyValuePair==undefined){
            console.log(parsedKeyValuePairs)
            let syntheticE = {currentTarget:{name:e.currentTarget.name, value:  `[{key: ${bucket.key}, label:${e.currentTarget.value}}]`}} 
            console.log("Synthetic ",syntheticE.currentTarget.name, syntheticE.currentTarget.value)
            this.props.handleKeyValueMutations(syntheticE)

          }else{
            console.log("In else")
            // this.props.handleKeyValueMutations(e)

          }
            // console.log("EEEE",e, e.currentTarget.name, e.currentTarget.value)
            }
          }
          />
        </InputGroup>
        )
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
  })
  }
}

export default withAggContext(KeyValueBuckets);
