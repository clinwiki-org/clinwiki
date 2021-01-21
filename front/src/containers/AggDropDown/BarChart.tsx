import * as React from 'react';
import {
  ComposedChart, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { SearchParams } from '../SearchPage/Types'

interface BarChartComponentProps {
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  buckets: Array<AggBucket>;
  hasMore: boolean;
  handleLoadMore: any;
  onClickHandler: (any)=>void;
}

interface BarChartComponentState {
  activeIndex: any;
  currentBuckets: any[];
  otherBuckets: any[];
}
class BarChartComponent extends React.Component<BarChartComponentProps, BarChartComponentState>{
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
      queryDate.map((bucket, index) => {
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
    } else if (this.props.buckets.length == 0) {
      this.props.handleLoadMore();
    }
  };
  handleClick = (e) => {
    console.log(e)
    const { currentBuckets } = this.state;
    if (e.name !== "Other") {
      this.props.onClickHandler({key: e.name});
    } else {
      this.state.otherBuckets.map((otherBucket, index) => {
        this.props.onClickHandler({key: otherBucket.name});
      });
    }
  }
  render() {
    return (
      <ComposedChart
        layout="vertical"
        width={250}
        height={220}
        data={this.state.currentBuckets}
        margin={{
          top: 5, right: 30, bottom: 20, left: 5
        }}>
        <CartesianGrid stroke='#f5f5f5' />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey='value' barSize={20} fill='#8884d8' onClick={(e) => this.handleClick(e)} />
      </ComposedChart>)
  }
}
export default BarChartComponent;