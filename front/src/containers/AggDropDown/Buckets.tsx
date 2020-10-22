import * as React from 'react';
import { defaultTo } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { AggBucket } from '../SearchPage/Types';
import { Checkbox } from 'react-bootstrap';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import Bucket from './Bucket';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';

interface BucketsProps {
  display: FieldDisplay;
  visibleOptions: any;
  buckets: Array<AggBucket>;
 // isSelected: any;
  updater: AggFilterInputUpdater;
}

class Buckets extends React.Component<BucketsProps> {
  render() {
    const { display, buckets, visibleOptions = [], updater } = this.props;
    return buckets
      .filter(
        bucket =>
          !bucketKeyIsMissing(bucket) &&
          (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
      )
      .map(bucket => (
        <Checkbox
          key={bucket.key}
          checked={updater.isSelected(bucket.key)}
          onChange={() => updater.toggleFilter(bucket.key)}>
          <Bucket
            value={defaultTo(bucket.key)(bucket.keyAsString)}
            display={display}
            docCount={bucket.docCount}
          />
        </Checkbox>
      ));
  }
}

export default withAggContext(Buckets);
