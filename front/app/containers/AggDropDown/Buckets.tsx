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

interface BucketsProps {
  display: FieldDisplay;
  field: SiteViewFragment_search_aggs_fields | any;
  agg: string;
  visibleOptions: any;
  site: SiteFragment;
  buckets: Array<AggBucket>;
  isSelected: any;
  toggleAgg: any;
  aggs: any;
  updater: AggFilterInputUpdater;
}

class Buckets extends React.Component<BucketsProps> {
  render() {
    const {
      display,
      field,
      aggs,
      buckets,
      toggleAgg,
      site,
      agg,
      visibleOptions = [],
      updater,
    } = this.props;
    return pipe(
      filter(({ key }) =>
        visibleOptions.length ? visibleOptions.includes(key) : true
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

export default withSite(withAggContext(Buckets));
