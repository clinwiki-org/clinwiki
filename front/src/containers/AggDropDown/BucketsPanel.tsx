import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { AggBucket } from '../SearchPage/Types';
import Buckets from './Buckets';

interface BucketsPanelProps {
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  hasMore: boolean;
  handleLoadMore: any;
}

class BucketsPanel extends React.Component<BucketsPanelProps> {
  render() {
    const {
      isPresearch,
      field,
      visibleOptions,
      buckets,
      isSelected,
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
          display={(field && field.display) || FieldDisplay.STRING}
          visibleOptions={visibleOptions}
          buckets={buckets}
          isSelected={isSelected}
        />
      </InfiniteScroll>
    );
  }
}

export default BucketsPanel;
