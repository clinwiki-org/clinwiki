import * as React from 'react';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { AggBucket } from '../SearchPage/Types';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';

interface AllowMissingDropDownItemProps {
  buckets: AggBucket[] | null;
}

function AllowMissingDropDownItem(props: AllowMissingDropDownItemProps) {
  const { buckets } = props;
  let totalMissing: number = 0;
  (buckets || []).forEach(bucket => {
    if (bucketKeyIsMissing(bucket)) {
      totalMissing = bucket.docCount;
    }
  });
  return (
    <div 
      className="item-content"
      >{`Allow Missing (${totalMissing})`}</div>
  );
}

export default withAggContext(AllowMissingDropDownItem);
