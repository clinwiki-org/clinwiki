import * as React from 'react';
import { PieChart, Pie, Sector } from 'recharts';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggBucket } from '../SearchPage/Types';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';

interface TwoLevelPieChartProps {
  data: any;
  isPresearch: boolean;
  field: SiteViewFragment_search_aggs_fields | any;
  visibleOptions: any;
  buckets: Array<AggBucket>;
  isSelected: any;
  hasMore: boolean;
  handleLoadMore: any;
  updater: AggFilterInputUpdater;
}

interface TwoLevelPieChartState {
  activeIndex: any;
  currentBuckets: any[];
  clickedSections:any[];
}

class TwoLevelPieChart extends React.Component<
  TwoLevelPieChartProps,
  TwoLevelPieChartState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: '',
      currentBuckets: [],
      clickedSections: [],
    };
  }
  componentDidMount = () => {
    this.props.handleLoadMore()
  };
  componentDidUpdate=(prevProps)=>{
      if(prevProps.buckets !== this.props.buckets){

        let finalDataArray: any[]=[];
        let queryDate = this.props.buckets
        let newData = queryDate.map(bucket=>{
            let bucketKey = bucket.key
            let bucketDocCount= bucket.docCount

            let finalBucket={ name: bucketKey, value: bucketDocCount }
            finalDataArray.push(finalBucket)
            return
        })

        finalDataArray.shift()
        this.setState({currentBuckets: finalDataArray})
      }
  }

  getInitialState() {
    return {
      activeIndex: 0,
    };
  }

  onPieEnter=(data, index)=> {
    this.setState({
      activeIndex: index,
    });
  }

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
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333">{`PV ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  onClickHelper=(data,index)=>{
    const {currentBuckets} = this.state
      console.log(currentBuckets)

      console.log(index)
      console.log(currentBuckets[index])
      this.props.updater.toggleFilter(currentBuckets[index].name)
      let sections: any[]=this.state.clickedSections
      sections.push({index})
      this.setState({clickedSections: sections})
      
      this.renderActiveShape
      this.props.handleLoadMore()
  }
  handleClear =() =>{
      this.setState({activeIndex:''})
  }
  render() {
    if(this.props.buckets){
        return (
            <PieChart width={250} height={200}>
              <Pie
                activeIndex={this.state.activeIndex}
                activeShape={this.renderActiveShape}
                data={this.state.currentBuckets}
                cx={125}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                onMouseEnter={this.onPieEnter}
                onMouseLeave={this.handleClear}
                onClick={this.onClickHelper}
              />
            </PieChart>
          );
    }
  }
}

export default withAggContext(TwoLevelPieChart);
