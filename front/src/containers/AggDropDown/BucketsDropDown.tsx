//Component based in checkbox BucketsPanel

import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { AggBucket } from '../SearchPage/Types';
import BucketsDropDownOptions from './BucketsDropDownOptions';

interface BucketsDropDownProps {
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  hasMore: boolean;
  handleLoadMore: any;
  removeFilters: any;
  agg: string;
}

class BucketsDropDown extends React.Component<BucketsDropDownProps> {
  render() {
    const {
      isPresearch,
      field,
      visibleOptions,
      buckets,
      isSelected,
      hasMore,
      handleLoadMore,
      removeFilters,
      agg
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
          <BucketsDropDownOptions
            removeFilters={removeFilters}
            display={(field && field.display) || FieldDisplay.STRING}
            visibleOptions={visibleOptions}
            buckets={buckets}
            isSelected={isSelected}
            field={field}
            agg={agg}
          />
      </InfiniteScroll>
    );
  }
}

export default BucketsDropDown;
