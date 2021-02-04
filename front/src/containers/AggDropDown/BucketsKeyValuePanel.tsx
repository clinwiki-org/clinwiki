 import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { AggBucket } from '../SearchPage/Types';
import KeyValueBuckets from './KeyValueBuckets';

interface KeyValueBucketsPanelProps {
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  hasMore: boolean;
  handleLoadMore: any;
  handleKeyValueMutations: (e: { currentTarget: { name: string; value: any } }) => void;
  getPath: ()=>void;
  configType?: 'presearch' | 'autosuggest' | 'facetbar';
}

class KeyValueBucketsPanel extends React.Component<KeyValueBucketsPanelProps> {
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
        <KeyValueBuckets
          field={field}
          display={(field && field.display) || FieldDisplay.STRING}
          visibleOptions={visibleOptions}
          buckets={buckets}
          isSelected={isSelected}
          handleKeyValueMutations={this.props.handleKeyValueMutations}
          getPath={this.props.getPath}
          configType={this.props.configType}
        />
      </InfiniteScroll>
    );
  }
}

export default KeyValueBucketsPanel;
