// TODO  Component based in checkbox BucketsPanel
// Need to setup as dropdown

import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { AggBucket } from '../SearchPage/Types';
import Buckets from './Buckets';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';

interface BucketsDropDownProps {
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  hasMore: boolean;
  handleLoadMore: any;
}


const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
  border-radius: 2px;
  border-color: "red";
`;

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

export default BucketsDropDown;
