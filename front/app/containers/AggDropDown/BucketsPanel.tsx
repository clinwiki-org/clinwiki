import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import { any } from 'ramda';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { SiteFragment } from 'types/SiteFragment';
import { AggBucket } from '../SearchPage/Types';
import { withSite } from 'containers/SiteProvider/SiteProvider';
import Buckets from './Buckets';

interface BucketsPanelProps {
  field: SiteViewFragment_search_aggs_fields | any;
  agg: string;
  visibleOptions: any;
  site: SiteFragment;
  buckets: Array<AggBucket>;
  isSelected: any;
  toggleAgg: any;
  aggs: any;
  hasMore: boolean;
  handleLoadMore: any;
}

class BucketsPanel extends React.Component<BucketsPanelProps> {
  render() {
    const {
      field,
      agg,
      visibleOptions,
      site,
      buckets,
      isSelected,
      toggleAgg,
      aggs,
      hasMore,
      handleLoadMore,
    } = this.props;
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={handleLoadMore}
        hasMore={hasMore}
        useWindow={false}
        loader={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BeatLoader key="loader" color="#fff" />
          </div>
        }>
        <Buckets
          field={field}
          display={(field && field.display) || FieldDisplay.STRING}
          site={site}
          agg={agg}
          visibleOptions={visibleOptions}
          buckets={buckets}
          isSelected={isSelected}
          toggleAgg={toggleAgg}
        />
      </InfiniteScroll>
    );
  }
}

export default withSite(BucketsPanel);
