import * as FontAwesome from 'react-fontawesome';
import * as InfiniteScroll from 'react-infinite-scroller';
import * as React from 'react';
import { applyTemplate,compileTemplate } from '../../components/MailMerge/MailMergeView';
import { AggBucket } from '../SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import AllowMissingDropDownItem from './AllowMissingDropDownItem';
import BarChartComponent from './BarChart'
import { BeatLoader } from 'react-spinners';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import HtmlToReact from 'html-to-react';
import LocationAgg from './LocationAgg';
import RangeSelector from './RangeSelector';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import TwoLevelPieChart from './TwoLevelPieChart';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';

interface CustomDropPanelProps {
  field: SiteViewFragment_search_aggs_fields | any;
  buckets: AggBucket[];
  isPresearch: boolean;
  handleLoadMore: () => any;
  hasMore: boolean;
  handleRange: any;
  handleLocation: any;
  selectItem: any;
  isSelected: any;
  onCheckBoxToggle: (string, []) => void;
  isOpen: boolean;
  updater: AggFilterInputUpdater;
  loading: boolean;
  selectedItem: any;
  disabled?: boolean;
  allowsMissing?: boolean;


}
interface CustomDropPanelState {
  buckets?: AggBucket[],

}

const NoFiltersMessage = () => {
  return (
    <>
      <div className="no-filter">
        <span>No Available Filters</span>
      </div>
    </>)
}

const PlaceHolder = () => {
  return (
    <>
      <div className="wrapper">
        <div className="box square-placeholder">A</div>
        <div className="box text-placeholder">A</div>
      </div>
    </>)
}

const LoadingMessage = () => {
  return (
    <>
      <PlaceHolder />
      <PlaceHolder />
      <PlaceHolder />
      <PlaceHolder />
    </>)
}

class CustomDropPanel extends React.Component<CustomDropPanelProps, CustomDropPanelState> {

  // state ={
  //   // buckets: this.props.buckets as AggBucket[],
  // }

  renderPreValue = (item) => {
    const { disabled } = this.props;
    if (this.props.field.display == "CHECKBOX" || this.props.field.display == "STRING") {
      return this.props.isSelected(item) ? <FontAwesome name='far fa-check-square check' className={`square-checkmark${this.props.isPresearch ? "" : "-facet"} ${disabled ? "disabled-check" : ""}`} /> : <div className={`check-outer${this.props.isPresearch ? "" : "-facet"} ${disabled ? "disabled-checkbox" : ""}`}></div>
    }
    return null
  };
  renderBucketTemplate = (key, docCount, helperText) => {
    let bucketContext = {
      docCount: docCount,
      crowd_value: key,
      crowd_value_helper_text: helperText
    };


    //TO-DO UPDATE bucketTemplate, this.props.field undefined all the time something is wrong 

    const { bucketTemplate } = this.props.field;
    const  DEFAULT_BUCKET_TEMPLATE = `${key} (${docCount})`;
    
    const compiled =  compileTemplate(bucketTemplate || DEFAULT_BUCKET_TEMPLATE)
    const raw = applyTemplate(compiled, bucketContext)

    const parser = new HtmlToReact.Parser();
    const reactElementHelperText = parser.parse(raw)

    //  if (helperText !== "") {
    return reactElementHelperText // docCount ? `${text} (${docCount})` : `${text}`;
    //  }

    // CHeck for doc Count { item.key } { item.docCount ? `(${item.docCount})` : "" }
    //  return key + docCount ? `(${docCount})` : ""

  }

  renderValue = (item, bucketKeyValuePair) => {
    let text = '';
    const { docCount } = item;
    const value = item.key;
    const display = this.props.field.display
    let intValue = Math.floor(Number(value))
    switch (display) {
      case FieldDisplay.STAR:
        text = {
          0: '☆☆☆☆☆',
          1: '★☆☆☆☆',
          2: '★★☆☆☆',
          3: '★★★☆☆',
          4: '★★★★☆',
          5: '★★★★★',
        }[intValue] || "NaN";
        break;
      case FieldDisplay.DATE:
        text = new Date(parseInt(value.toString(), 10))
          .getFullYear()
          .toString();
        break;
      default:
        text = bucketKeyValuePair ? `${bucketKeyValuePair.key} - ${bucketKeyValuePair.label}` : value.toString();
    }
    return docCount ? `${text} (${docCount})` : `${text}`;
  }
  render() {
    const { disabled } = this.props;

    /*   if(this.props.buckets.length > 0) {
      console.log(this.props.isPresearch,"CusDr Panel BUckets ", this.props.buckets)
    } */

    const { hasMore, buckets, handleLoadMore, field, loading } = this.props
    const showAllowMissing = field.showAllowMissing;
    //if (!this.props.isOpen) return
    if (
      field?.display === FieldDisplay.DATE_RANGE ||
      field?.display === FieldDisplay.NUMBER_RANGE ||
      field?.display === FieldDisplay.LESS_THAN_RANGE ||
      field?.display === FieldDisplay.GREATER_THAN_RANGE
    ) {

      return (
        <RangeSelector
          isOpen={this.props.isOpen}
          hasMore={hasMore}
          loading={loading}
          buckets={buckets}
          handleLoadMore={handleLoadMore}
          aggType={field?.display}
          field={field}
          handleRange={this.props.handleRange}
        />
      )
    } else if (field?.display === FieldDisplay.PIE_CHART) {
      return (
        <TwoLevelPieChart
          isPresearch={this.props.isPresearch}
          buckets={buckets}
          hasMore={hasMore}
          handleLoadMore={this.props.handleLoadMore}
          field={field}
          onClickHandler={this.props.selectItem}
        />
      )
    } else if (field?.display === FieldDisplay.BAR_CHART) {
      return (
        <BarChartComponent
          isPresearch={this.props.isPresearch}
          onClickHandler={this.props.selectItem}
          // visibleOptions={visibleOptions}
          buckets={buckets}
          // isSelected={this.isSelected}
          hasMore={hasMore}
          handleLoadMore={this.props.handleLoadMore}
          field={field}
        />
      )
    }
    else if (field.display == FieldDisplay.LOCATION) {
      return (
        <LocationAgg
          agg={field.name}
          removeFilters={this.props.onCheckBoxToggle}
          buckets={buckets}
          isSelected={this.props.isSelected}
          // hasMore={hasMore}
          field={field}
          handleLocation={this.props.handleLocation}
        />
      )
    }
    else if (field.display == "CRUMBS_ONLY") {
      return null
    }
    else if (this.props.field.display == "CHECKBOX" || this.props.field.display == "STRING") {

      //  console.log(`RENDERING DROP PANEL   ${this.props.field.name}`, this.props.buckets);

      //console.log("BUCKETS @ InfiniteScroll", this.props.field.name, this.props.buckets); 

      if (this.props.buckets[0] === undefined && this.props.buckets.length !== 0) {

        return <BeatLoader />
      }
      if (this.props.buckets[0] === undefined) {
        return <LoadingMessage />
      }
      if (!showAllowMissing && this.props.buckets[0].key == "-99999999999" && this.props.buckets.length == 0) {
        return <NoFiltersMessage />

      }
      return (
        <>
          {showAllowMissing && (
            // <div className="select-item allow-missing" onClick={() => this.props.updater.toggleAllowMissing()} >
            <div className="select-item allow-missing" onClick={() => console.log("Need a new function, prev updater")} >
              <div className="item-content">
                {this.props.allowsMissing ? <FontAwesome name='far fa-check-square check' className={`square-checkmark${this.props.isPresearch ? "" : "-facet"}`} /> : <div className={`check-outer${this.props.isPresearch ? "" : "-facet"}`}></div>}

                <AllowMissingDropDownItem buckets={buckets} />
              </div>
            </div>
          )}
          <InfiniteScroll
            pageStart={0}
            loadMore={this.props.handleLoadMore}
            hasMore={this.props.hasMore}
            useWindow={false}
            initialLoad={false}
            loader={
              <div key={0} style={{ display: 'flex', justifyContent: 'center' }}>
                <BeatLoader key="loader" />
              </div>
            }>
            {this.props.buckets
              .filter(
                bucket =>
                  !bucketKeyIsMissing(bucket) &&
                  (this.props.field.visibleOptions.length
                    ? this.props.field.visibleOptions.includes(bucket.key)
                    : true)
              )
              .map((item) => (
                <div
                  key={item.key + 'buckets'}
                  onClick={() => this.props.selectItem(item)}
                  className={
                    this.props.selectedItem === item
                      ? "selected select-item"
                      : "select-item"
                  }
                >
                  <div className={`item-content ${disabled ? "disabled-text" : ""}`}>
                    {this.renderPreValue(item.key)}
                    <span>{this.renderBucketTemplate(item.key, item.docCount, item.crowd_value_helper_text)} </span>
                  </div>
                </div>
              ))}
          </InfiniteScroll>
        </>
      )

    }
    // else {
    //   if (this.props.buckets[0] === undefined && this.props.buckets.length !== 0) {
    //     return <BeatLoader />
    //   }
    //   if (this.props.buckets.length == 0 || this.props.buckets[0] === undefined) {
    //     return <NoFiltersMessage />
    //   }
    //   if (!showAllowMissing && this.props.buckets[0].key == "-99999999999" && this.props.buckets.length == 1) {
    //     return <NoFiltersMessage />

    //   }
    //   return (
    //     <>
    //       {showAllowMissing && this.props.allowsMissing && (
    //         <div className="select-item allow-missing" onClick={() => this.props.updater.toggleAllowMissing()}>
    //           <AllowMissingDropDownItem buckets={buckets} className="item-content" />
    //         </div>
    //       )}
    //       <InfiniteScroll
    //         pageStart={0}
    //         loadMore={this.props.handleLoadMore}
    //         hasMore={this.props.hasMore}
    //         useWindow={false}
    //         initialLoad={false}
    //         loader={
    //           <div key={0} style={{ display: 'flex', justifyContent: 'center' }}>
    //             <BeatLoader key="loader" color={this.props.isPresearch ? '#000' : '#fff'} />
    //           </div>
    //         }>
    //         {this.props.buckets && this.props.buckets
    //           .filter(
    //             bucket =>
    //               !bucketKeyIsMissing(bucket) &&
    //               (this.props.field.visibleOptions.length
    //                 ? this.props.field.visibleOptions.includes(bucket.key)
    //                 : true)
    //           )
    //           .map((item) => {
    //             const bucketKeyValuePair = field.bucketKeyValuePairs ? find(propEq('key', item.key))(field.bucketKeyValuePairs) : false;
    //             return (
    //               this.props.isSelected(item.key) ? null :
    //                 <div
    //                   key={item.key + 'buckets'}
    //                   onClick={() => this.props.selectItem(item)}
    //                   className={
    //                     this.props.selectedItem === item
    //                       ? "selected select-item"
    //                       : "select-item"
    //                   }
    //                 >
    //                   <div className="item-content">
    //                     {/* {this.renderPreValue(item.key)} */}
    //                     <span>{this.renderValue(item, bucketKeyValuePair)}</span>
    //                   </div>
    //                 </div>
    //             )
    //           })}
    //       </InfiniteScroll>
    //     </>
    //   )
    // }
  }
}

export default withAggContext(CustomDropPanel);