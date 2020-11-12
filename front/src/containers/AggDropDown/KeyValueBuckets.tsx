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
import { find, propEq, findIndex } from 'ramda';
export interface bucketKeyValuePairType {
  key: string;
  label: string;
}
interface KeyValueBucketsProps {
  field: any;
  display: FieldDisplay;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  // isSelected: any;
  updater: AggFilterInputUpdater;
  handleKeyValueMutations: (e: { currentTarget: { name: string; value: any } }) => void;
  getPath: (string)=>void;
  configType?: 'presearch' | 'autosuggest' | 'facetbar';
}
interface KeyValueBucketsState {
  bucketKeyValuePairs: bucketKeyValuePairType[];
}

class KeyValueBuckets extends React.Component<KeyValueBucketsProps, KeyValueBucketsState> {
  state = {
    bucketKeyValuePairs: []
  }
  componentDidMount() {
    if (this.props.field.bucketKeyValuePairs) {
      console.log("IN if", this.props.field.bucketKeyValuePairs)
      this.setState({ bucketKeyValuePairs: this.props.field.bucketKeyValuePairs })
    }
  }

  handleKeyValuePairsMutations = (e, bucket, bucketKeyValuePair, pairIndex) => {
    let parsedKeyValuePairs: bucketKeyValuePairType[] = this.state.bucketKeyValuePairs

    if (bucketKeyValuePair == undefined && parsedKeyValuePairs.length < 1) {
      console.log(1)
      this.setState({
        bucketKeyValuePairs: [{"key": bucket.key, "label":e.currentTarget.value}]
      })
      this.props.handleKeyValueMutations({ currentTarget: { name: e.currentTarget.name, value: `[{key: ${bucket.key}, label:${e.currentTarget.value}]`}})



    } else if (bucketKeyValuePair == undefined && parsedKeyValuePairs.length >= 1) {
    console.log(2)
      parsedKeyValuePairs.push({ key: bucket.key, label: e.currentTarget.value })
      let syntheticE = { currentTarget: { name: e.currentTarget.name, value: parsedKeyValuePairs } }
      this.setState({ bucketKeyValuePairs: parsedKeyValuePairs },
        () => this.props.handleKeyValueMutations(syntheticE)

      )

    } else {
      console.log("OH WELLL", bucketKeyValuePair)
      //Need to find the index of the bucketKeyValuePair
      let newValueHolder: bucketKeyValuePairType[] = this.state.bucketKeyValuePairs;
      // newValueHolder[pairIndex] ={key: bucket.key, label: e.currentTarget.value}
      newValueHolder[pairIndex] = {
        ...bucketKeyValuePair,
        label: e.currentTarget.value
      }
      let syntheticE = { currentTarget: { name: e.currentTarget.name, value: newValueHolder } }
      this.setState({ bucketKeyValuePairs: newValueHolder },
        () => this.props.handleKeyValueMutations(syntheticE)

      )

    }
  }
  // Need to add logic to parse through our bucketKeyValuePairs
  render() {

    const { display, buckets, visibleOptions = [], updater, field } = this.props;
    let parsedKeyValuePairs: bucketKeyValuePairType[] = this.state.bucketKeyValuePairs
    // let tempObjetc = [{ key: 'green', label: 'this is green' }, { key: 'test', label: 'in beta testing' }]
    return buckets
      .filter(
        bucket =>
          !bucketKeyIsMissing(bucket) &&
          (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
      )
      .map((bucket, index) => {
        let bucketName = bucket.key;
        let bucketKeyValuePair = find(propEq('key', bucketName))(parsedKeyValuePairs)
        let pairIndex = findIndex(propEq('key', bucketName))(parsedKeyValuePairs)
        let label = bucketKeyValuePair ? bucketKeyValuePair.label : ''
        console.log("04",this.props.field.name)
        return (
          <InputGroup key={bucket.key+bucket.docCount}>

            <InputGroup.Addon>{defaultTo(bucket.key)(bucket.keyAsString)}</InputGroup.Addon>
            <FormControl
              type="text"
              name={`set:${this.props.getPath(this.props.configType)}.bucketKeyValuePairs`}
              value={label}
              onChange=
              {(e: {
                currentTarget: { name: string; value: any };
              }) => {
                this.handleKeyValuePairsMutations(e, bucket, bucketKeyValuePair, pairIndex)

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
