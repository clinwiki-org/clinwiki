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
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  agg: string;
  visibleOptions: any;
  site: SiteFragment;
  buckets: Array<AggBucket>;
  isSelected: any;
  toggleAgg: any;
  hasMore: boolean;
  handleLoadMore: any;
}

class BucketsPanel extends React.Component<BucketsPanelProps> {
  render() {
    const {
      isPresearch,
      field,
      agg,
      visibleOptions,
      site,
      buckets,
      isSelected,
      toggleAgg,
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
          <div key={0} style={{ display: 'flex', justifyContent: 'center' }}>
            <BeatLoader key="loader" color={isPresearch ? '#000' : '#fff'} />
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
