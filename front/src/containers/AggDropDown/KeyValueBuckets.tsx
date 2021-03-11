import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import { AggBucket } from '../SearchPage/Types';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import {
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
  handleKeyValueMutations: (e: { currentTarget: { name: string; value: any } }) => void;
  getPath: (string) => void;
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
      this.setState({ bucketKeyValuePairs: this.props.field.bucketKeyValuePairs })
    }
  }

  handleKeyValuePairsMutations = (e, bucket, bucketKeyValuePair, pairIndex) => {
    let parsedKeyValuePairs: bucketKeyValuePairType[] = this.state.bucketKeyValuePairs


    if (bucketKeyValuePair == undefined && parsedKeyValuePairs.length < 1) {
      this.setState({
        bucketKeyValuePairs: [{ "key": bucket.key, "label": e.currentTarget.value }]
      })
      this.props.handleKeyValueMutations({ currentTarget: { name: e.currentTarget.name, value: `[{key: ${bucket.key}, label:${e.currentTarget.value}]` } })



    } else if (bucketKeyValuePair == undefined && parsedKeyValuePairs.length >= 1) {
      parsedKeyValuePairs.push({ key: bucket.key, label: e.currentTarget.value })
      let syntheticE = { currentTarget: { name: e.currentTarget.name, value: parsedKeyValuePairs } }
      this.setState({ bucketKeyValuePairs: parsedKeyValuePairs },
        () => this.props.handleKeyValueMutations(syntheticE)

      )

    } else {
      let newValueHolder: bucketKeyValuePairType[] = this.state.bucketKeyValuePairs.slice();
      newValueHolder[pairIndex] = { ...bucketKeyValuePair, label: e.currentTarget.value }
      let syntheticE = { currentTarget: { name: e.currentTarget.name, value: newValueHolder } }
      this.setState({ bucketKeyValuePairs: newValueHolder },
        () => this.props.handleKeyValueMutations(syntheticE)

      )

    }
  }
  render() {

    const { buckets, visibleOptions = [] } = this.props;
    let parsedKeyValuePairs: bucketKeyValuePairType[] = this.state.bucketKeyValuePairs
    return buckets
      .filter(
        bucket =>
          !bucketKeyIsMissing(bucket) &&
          (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
      )
      .map(bucket => {
        let bucketName = bucket.key;
        let bucketKeyValuePair = find(propEq('key', bucketName))(parsedKeyValuePairs)
        let pairIndex = findIndex(propEq('key', bucketName))(parsedKeyValuePairs)
        let label = bucketKeyValuePair ? bucketKeyValuePair.label : ''
        return (
          <InputGroup key={bucket.key + bucket.docCount}>

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

              }
              }
            />
          </InputGroup>
        )
      })
  }
}

export default withAggContext(KeyValueBuckets);
