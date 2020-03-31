import * as React from 'react';
import { find, prop, propEq, defaultTo } from 'ramda';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { Checkbox } from 'react-bootstrap';
import { AggBucket } from '../SearchPage/Types';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';

interface AllowMissingCheckboxProps {
  buckets: AggBucket[] | null;
  updater: AggFilterInputUpdater;
}

function AllowMissingCheckbox(props: AllowMissingCheckboxProps) {
  const { buckets, updater } = props;
  let totalMissing: number = 0;
  (buckets || []).forEach(bucket => {
    if (bucketKeyIsMissing(bucket)) {
      totalMissing = bucket.docCount;
    }
  });
  console.log(totalMissing);
  return (
    <Checkbox
      checked={updater.allowsMissing()}
      onChange={() =>
        updater.toggleAllowMissing()
      }>{`Allow Missing (${totalMissing})`}</Checkbox>
  );
}

export default withAggContext(AllowMissingCheckbox);
