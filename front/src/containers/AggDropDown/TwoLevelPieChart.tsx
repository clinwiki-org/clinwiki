import * as React from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import { truncateString } from 'containers/FacilitiesPage/FacilityUtils';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { SearchParams } from '../SearchPage/Types'
interface TwoLevelPieChartProps {
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  buckets: Array<AggBucket>;
  hasMore: boolean;
  handleLoadMore: any;
  updater: AggFilterInputUpdater;
  searchParams: SearchParams;
}

interface TwoLevelPieChartState {
  activeIndex: any;
  currentBuckets: any[];
  otherBuckets: any[];
}

class TwoLevelPieChart extends React.Component<
  TwoLevelPieChartProps,
  TwoLevelPieChartState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
      currentBuckets: [],
      otherBuckets: [],
    };
  }
  COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
        if (currentBucket.name == '-99999999999') {
          return;
        } else if (index < 10) {
          finalDataArray.push(currentBucket);
          return;
        } else if (index == 10) {
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

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  renderActiveShape = props => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {truncateString(payload.name, 14, false)}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill={fill}>
          {`\n ${value} Results`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={this.COLORS[this.state.activeIndex % this.COLORS.length]}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={this.COLORS[this.state.activeIndex % this.COLORS.length]}
        />
      </g>
    );
  };

  onClickHelper = (data, index) => {
    const { currentBuckets } = this.state;
    if (index !== 9) {
      this.props.updater.toggleFilter(currentBuckets[index].name);
    } else {
      this.state.otherBuckets.map((otherBucket, index) => {
        this.props.updater.toggleFilter(otherBucket.name);
      });
    }
  };
  handleClear = () => {
    this.setState({ activeIndex: null });
  };
  render() {

    if (this.props.buckets) {
      return (
        <PieChart width={250} height={220}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={this.renderActiveShape}
            data={this.state.currentBuckets}
            dataKey="value"
            cx={125}
            cy={90}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            onMouseEnter={this.onPieEnter}
            onMouseLeave={this.handleClear}
            onClick={this.onClickHelper}>
            {this.state.currentBuckets.map((entry, index) => (
              <Cell fill={this.COLORS[index % this.COLORS.length]} key={entry + index} />
            ))}
          </Pie>
        </PieChart>
      );
    }
  }
}

export default withAggContext(TwoLevelPieChart);
