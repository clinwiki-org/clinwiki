import * as React from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { truncateString } from 'containers/FacilitiesPage/FacilityUtils';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { SearchParams } from '../SearchPage/Types'

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];
interface BarChartComponentProps {
    isPresearch: boolean;
    field: SiteViewFragment_search_aggs_fields | any;
    buckets: Array<AggBucket>;
    hasMore: boolean;
    handleLoadMore: any;
    updater: AggFilterInputUpdater;
    searchParams: SearchParams;
  }
  
  interface BarChartComponentState {
    activeIndex: any;
    currentBuckets: any[];
    otherBuckets: any[];
  }
class BarChartComponent extends React.Component< BarChartComponentProps, BarChartComponentState>{
    constructor(props) {
        super(props);
        this.state = {
          activeIndex: null,
          currentBuckets: [],
          otherBuckets: [],
        };
      } 
      componentDidMount = () => {
        this.props.handleLoadMore();
      };
      componentDidUpdate = prevProps => {
        if (
          prevProps.buckets !== this.props.buckets &&
          this.props.buckets.length > 0
        ) {
          let finalDataArray: any[] = [];
          let finalOtherBucketsArray: any[] = [];
          let queryDate = this.props.buckets;
          let newData = queryDate.map((bucket, index) => {
            let bucketKey = bucket.key;
            let bucketDocCount = bucket.docCount;
    
            let currentBucket = { name: bucketKey, value: bucketDocCount };
    
            let otherBucket = { name: 'Others', value: 0 };
            if (currentBucket.name === '-99999999999') {
              return;
            } else if (index < 10) {
              finalDataArray.push(currentBucket);
              return;
            } else if (index === 10) {
              otherBucket.value += currentBucket.value;
              finalDataArray.push(otherBucket);
              finalOtherBucketsArray.push(currentBucket);
              return;
            } else {
              let oldValue = finalDataArray[9].value;
              otherBucket = { ...otherBucket, value: oldValue + 1 };
              finalDataArray[9] = otherBucket;
              finalOtherBucketsArray.push(currentBucket);
            }
          });
    
          this.setState({
            currentBuckets: finalDataArray,
            otherBuckets: finalOtherBucketsArray,
          });
        } else if (prevProps.searchParams !== this.props.searchParams) {
          this.props.handleLoadMore();
        }
      };
      handleClick=(e)=>{
        console.log(e)
        const { currentBuckets } = this.state;
        if (e.name !== "Other") {
          this.props.updater.toggleFilter(e.name);
        } else {
          this.state.otherBuckets.map((otherBucket, index) => {
            this.props.updater.toggleFilter(otherBucket.name);
          });
        }
      }
  render() {
      console.log("Current Buckets", this.state.currentBuckets)
    return (
      <BarChart
        width={250}
        height={220}
        data={this.state.currentBuckets}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        
        <Bar dataKey="value" fill="#8884d8" onClick={(e)=>this.handleClick(e)}/>
      </BarChart>
    );
  }
}
export default withAggContext(BarChartComponent);