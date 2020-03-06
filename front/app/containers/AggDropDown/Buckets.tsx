import * as React from 'react';
import { pipe, filter, map } from 'ramda';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { FieldDisplay } from 'types/globalTypes';
import { SiteFragment } from 'types/SiteFragment';
import { AggBucket } from '../SearchPage/Types';
import { Checkbox } from 'react-bootstrap';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import Bucket from './Bucket';

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
}

class Buckets extends React.Component<BucketsProps> {
  render() {
    const {
      display,
      field,
      aggs,
      buckets,
      isSelected,
      toggleAgg,
      site,
      agg,
      visibleOptions = [],
    } = this.props;
    return pipe(
      filter(({ key }) =>
        visibleOptions.length ? visibleOptions.includes(key) : true
      ),
      map((bucket: AggBucket) => (
        <Checkbox
          key={bucket.key}
          checked={isSelected(bucket.key)}
          onChange={() => toggleAgg(bucket.key)}>
          <Bucket
            value={bucket.key}
            display={display}
            docCount={bucket.docCount}
          />
        </Checkbox>
      ))
    )(buckets);
  }
}

export default withSite(Buckets);
