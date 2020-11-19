// TODO  Component based in checkbox BucketsPanel
// Need to setup as dropdown

import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader } from 'react-spinners';
import { FieldDisplay } from 'types/globalTypes';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { AggBucket } from '../SearchPage/Types';
import { FormControl } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import DistanceDropDownOptions from './DistanceDropDownOptions';



interface DistanceAggProps {
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

class DistanceAgg extends React.Component<DistanceAggProps> {
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


      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: 'solid 2px #ddd',
          alignItems: 'center',
        }}>
        <div
          style={{
            flex: 2,
            justifyContent: 'space-around',
            alignItems: 'center',
            display: 'flex',
          }}>
          

          <ThemedButton 
        style={{float:"left", padding: 3, }}
        onClick={() => console.log("Clicked Current Location")}>
          &nbsp;
          <FontAwesome         
            //style={{ opacity: 1 + '!important'}}
            name="compass" />
          &nbsp;
        </ThemedButton>

        </div>
        <FormControl
          type="text"
          placeholder="Enter Zip Code"
         // value={"zipCode"}
          onChange={() => console.log("Need a handleSearchByZipCode")}
          style={{ flex: 4, margin: '4px' }}
        />
      </div>


          <DistanceDropDownOptions
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

export default DistanceAgg;