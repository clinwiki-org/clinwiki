import * as React from 'react';
import { pipe, filter, map } from 'ramda';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { FieldDisplay } from 'types/globalTypes';
import { SiteFragment } from 'types/SiteFragment';
import { AggBucket } from '../SearchPage/Types';
import { Checkbox } from 'react-bootstrap';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import Bucket from './Bucket';
import UpdateWorkflowsViewMutation from 'mutations/UpdateWorflowsViewMutation';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';

interface BucketsProps {
  display: FieldDisplay;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  updater: AggFilterInputUpdater;
}

class Buckets extends React.Component<BucketsProps> {
  render() {
    const { display, buckets, visibleOptions = [], updater } = this.props;
    return pipe(
      filter(
        (bucket: AggBucket) =>
          !bucketKeyIsMissing(bucket) &&
          (visibleOptions.length ? visibleOptions.includes(bucket.key) : true)
      ),
      map((bucket: AggBucket) => {
        return (
          <Checkbox
            key={bucket.key}
            checked={updater.isSelected(bucket.key)}
            onChange={() => updater.toggleFilter(bucket.key)}>
            <Bucket
              value={bucket.key}
              display={display}
              docCount={bucket.docCount}
            />
          </Checkbox>
        );
      })
    )(buckets);
  }
}

export default withAggContext(Buckets);
