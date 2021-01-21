import * as React from 'react';
import { FieldDisplay } from 'types/globalTypes';
import styled from 'styled-components';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import * as FontAwesome from 'react-fontawesome';
import { BeatLoader } from 'react-spinners';
import * as InfiniteScroll from 'react-infinite-scroller';

import {
  ThemedPresearchCard,
  ThemedPresearchHeader,
  PresearchTitle,
  ThemedFacetHeader,
  ThemedFacetAgg,
  ThemedFacetTitle,
} from 'components/StyledComponents';
import Filter from './Filter';
import SortKind from './SortKind';
// import './AggDropDownStyle.css';
import {
  AggBucket,
} from '../SearchPage/Types';
import aggToField from 'utils/aggs/aggToField';
import { capitalize } from 'utils/helpers';
import {
  propEq,
  findIndex
} from 'ramda';
import withTheme from 'containers/ThemeProvider';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';
import LocationAgg from './LocationAgg';
import RangeSelector from './RangeSelector';
import TwoLevelPieChart from './TwoLevelPieChart';
import BarChartComponent from './BarChart'
import ValueCrumb from '../../components/MultiCrumb/ValueCrumb';
import { isLeafType } from 'graphql';
// import ValuesCrumb from '../../components/MultiCrumb/ValueCrumbs';

interface CustomDropDownProps {
  field: SiteViewFragment_search_aggs_fields | any;
  buckets: AggBucket[],
  isPresearch: boolean,
  selectedKeys: Set<string>;
  onContainerToggle?: () => void;
  handleLoadMore: () => any;
  hasMore: boolean;
  onCheckBoxToggle: (string, []) => void;
  handleSelectAll: (string) => void;
  //Filter Functions
  filter: string;
  desc: boolean;
  sortKind: SortKind;
  selectAll: any;
  checkSelect: any;
  checkboxValue: any;
  removeSelectAll: any;
  setShowLabel: any;
  toggleAlphaSort: any;
  toggleNumericSort: any;
  handleFilterChange: any;
  showLabel: boolean;
  isOpen: boolean;
  fromAggField: boolean;
}
interface CustomDropDownState {
  buckets?: AggBucket[],
  showItems: boolean,
  selectedItem: any[],
  type: string,
  defaultOpen: boolean,
  selectedItems: any[]
  hasMore: boolean,
  loading: boolean,
  filter: string,
  sortKind: SortKind,
  desc: boolean,
  checkboxValue: boolean,
  showLabel: boolean,
  showAdditionalCrumbs: boolean;
}


const SelectBoxBox = styled.div`
  
  .select-box--container {
    min-height: 30px;
    border: 1px solid #aaa;
    width: 100%;
    margin: 0;
    padding: 0;
    position: relative;
  }
  * {
    box-sizing: border-box;
  }

  .check-outer {
    min-width: 13px;
    max-width: 13px;
    height: 13px;
    border: 1px solid black;
    position: relative;
    margin-right: 7px;
    top: 4px;
    border-radius: 2px;

  }
  .check-outer-facet {
    min-width: 13px;
    max-width: 13px;
    height: 13px;
    position: relative;
    margin-right: 7px;
    top: 4px;
    border-radius: 4px;
    background: #ffffff;
    box-shadow: inset 0px 0px 1px 1px #969696;
    box-sizing: border-box;
    color:${props => props.theme.aggSideBar.sideBarFont};
  }
  .check{
    min-width: 13px;
    max-width: 13px;
    height: 13px;
    position: relative;
    margin-right: 7px;
    top: 3px;
    border-radius: 2px;
    font-size: 1.1em;
  }

  .item-content {
    display: flex;
    flex-direction: row;
  }

  .select-box--box {
    width: 200px;
  }
  .select-box--title{
    display: inline-block;
    height: 100%;
    width: 100%;
    padding: 4px 12px;
    vertical-align: middle;
    font-size: 1.15em;
    font-weight: bolder;
  }
  .select-box--selected-item {
    display: inline-block;
    height: 100%;
    width: 100%;
    padding: 4px 12px;
    vertical-align: middle;
  }

  .select-box--buckets .select-item {
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 6px;
    /* padding-left: 20px; */
  }
.select-box--buckets-facet{
  max-height:300px;
  overflow: scroll;
  // padding-left: 10px;
  color: rgb(255, 255, 255);
}

.select-box--buckets-facet .form-group{
 padding: 0 .5em;
}
.select-box--buckets-facet .select-item {
  background-color: ${props => props.theme.authHeader.headerBackground};

}

.select-box--buckets-presearch .select-item:nth-child(even){
  background-color: #ececec;
 }

 .select-box--buckets-presearch .select-item:hover{
  background-color: ${props => props.theme.button};
 }


.select-box--buckets-presearch{
  max-height:200px;
  overflow-y: scroll;
  // padding-left: 10px;
  color: black;
  border: 1px solid #e7e7e7;
}
.select-box--crumbs{
  display:flex;
  flex-wrap: wrap;

  .crumb-icon:hover {
    cursor: pointer;
    -webkit-text-stroke: 0.5px #333;
  }

}
.select-box--crumb-container{
  border: 2px solid ${props => props.theme.crumbs.crumbBackground};
  border-radius: 4px;
  padding: 0 5px 0 5px;
  margin: 1px;
  background: ${props => props.theme.crumbs.crumbBackground};
  color: ${props => props.theme.crumbs.crumbFont} !important;
  line-height: 1.1em;
}
.select-item{
  min-height: 20px;
  padding: 1em;
  // margin: 10px 0;
  font-weight: 400;
  cursor: pointer;
  border-bottom: 1px solid #e7e7e7;
  transition: .2s;

  .square-checkmark{
    display: flex;
    color: ${props => props.theme.crumbs.crumbBackground};
  }
  .square-checkmark-facet{
    display: flex;
    color: ${props => props.theme.aggSideBar.sideBarFont};
  }

}

.select-item:hover {
  background-color: ${props => props.theme.button};
  color: white;

  .square-checkmark{
    display: flex;
    color: ${props => props.theme.crumbs.crumbFont};
  }
  .square-checkmark-facet{
    display: flex;
    color: ${props => props.theme.aggSideBar.sideBarFontHover};
  }
}
`
const ThemedSelectBox = withTheme(SelectBoxBox)
class CustomDropDown extends React.Component<CustomDropDownProps, CustomDropDownState> {
  //@ts-ignore
  state = {
    buckets: this.props.buckets as AggBucket[],
    showItems: false,
    selectedItem: this.props.buckets && this.props.buckets[0],
    type: this.props.field.display || "checkbox",
    defaultOpen: this.props.field.dropDownDefaultOpen || false,
    selectedItems: [],
    hasMore: true,
    loading: false,
    filter: '',
    sortKind: SortKind.Alpha,
    desc: true,
    checkboxValue: false,
    showLabel: false,
    showAdditionalCrumbs: false
  };

  dropDown = () => {
    if (this.props.field.display == "CRUMBS_ONLY") return
    this.setState((prevState) => ({
      showItems: !prevState.showItems,
      showAdditionalCrumbs: !prevState.showItems
    })
    );
    this.props.onContainerToggle && this.props.onContainerToggle()
  };

  selectItem = (item) => {
    this.props.onCheckBoxToggle(item.key, this.state.selectedItems);

    //important to note conditionals are handling our selected items behavior within the component
    //Actual data manipulation should happen from the toggleFunction 
    if (!this.props.isPresearch) return;

    //handles our single select which is same behavior our old dropdown had
    if (this.props.field.display == "SINGLE" || this.props.field.display == "DROP_DOWN") {
      this.setState({
        selectedItem: item,
        selectedItems: [item],
        showItems: false
      });
    }

    //handles our mutliselect happens to be same behavior as old TEXT/STRING type 
    if (this.props.field.display == "MULTISELECT" || this.props.field.display == "STRING" || this.props.field.display == "PIE_CHART" || this.props.field.display == "BAR_CHART" || this.props.field.display == "CHECKBOX") {
      let index = findIndex(propEq('key', item.key))(this.state.selectedItems)
      let selectedItemsArray = this.state.selectedItems.slice()

      if (index !== -1) {
        selectedItemsArray.splice(index, 1)
        console.log(selectedItemsArray)
        this.setState({
          selectedItem: [],
          selectedItems: selectedItemsArray
        });
      }
      else {
        this.setState({
          selectedItem: item,
          selectedItems: [...this.state.selectedItems, item]
        });
      }
    }

  };
  renderRangeLabel = () => {
    let range = this.state.selectedItems[0]
    if (!this.state.selectedItems) return
    //@ts-ignore
    if (!range.start) return `≤ ${range.end}`
    //@ts-ignore
    if (!range.end) return `≥ ${range.start}`
    //@ts-ignore
    return `${range.start} - ${range.end}`

  }
  renderLocationLabel = () => {
    let location = this.state.selectedItems[0]
    //@ts-ignore
    if (!location.zipcode && !location.radius) return
    //@ts-ignore
    if (!location.zipcode) return `Within ${location.radius} of current location`
    //@ts-ignore
    if (!location.lat && !location.long) return `Within ${location.radius} of ${location.zipcode}`

  }

  renderSelectedItems = () => {
    const { field } = this.props
    if (this.state.selectedItems.length > 0) {
      let displayedCrumbs: any[] = this.state.selectedItems.slice(0, field.maxCrumbs)
      let otherValues = { key: `... ${this.state.selectedItems.length - displayedCrumbs.length} others` }
      displayedCrumbs.push(otherValues)
      if (field.maxCrumbs == 0 || field.maxCrumbs == null) return
      return displayedCrumbs.map((item: AggBucket, index) => {
        if (
          field?.display === FieldDisplay.DATE_RANGE ||
          field?.display === FieldDisplay.NUMBER_RANGE ||
          field?.display === FieldDisplay.LESS_THAN_RANGE ||
          field?.display === FieldDisplay.GREATER_THAN_RANGE) {
          return (
            <div className='select-box--crumb-container' key={item.key+"crumb-container"}>
              {this.renderRangeLabel()}
              <FontAwesome
                className="remove crumb-icon"
                name="remove"
                onClick={() => console.log("need a remove function")}
              />
              {/* <ValueCrumb label={item.key}  onClick={() => this.props.onCheckBoxToggle(item.key, this.state.selectedItems)} /> */}
            </div>
          )

        } else if (field.display == FieldDisplay.LOCATION) {
          return (
            <div key="location-crumb" className='select-box--crumb-container' >
              {this.renderLocationLabel()}
              <FontAwesome
                className="remove crumb-icon"
                name="remove"
                onClick={() => console.log("need a remove function")}
              />
              {/* <ValueCrumb label={item.key}  onClick={() => this.props.onCheckBoxToggle(item.key, this.state.selectedItems)} /> */}
            </div>
          )
        } else if (field?.display === FieldDisplay.BAR_CHART || field?.display === FieldDisplay.PIE_CHART) {
        }

        //@ts-ignore
        if (this.isSelected(item.key)) {
          //@ts-ignore
          return <div className='select-box--crumb-container' key={item.key+'isSelected'}>
            {item.key}          <FontAwesome
              className="remove crumb-icon"
              name="remove"
              onClick={() => this.selectItem(item)}
            />
            {/* <ValueCrumb label={item.key}  onClick={() => this.props.onCheckBoxToggle(item.key, this.state.selectedItems)} /> */}
          </div>
        }
        if (this.state.selectedItems.length > field.maxCrumbs) {
          let chevronDirection = this.state.showAdditionalCrumbs ? 'left' : 'right';
          if (this.state.showAdditionalCrumbs) {
            let otherCrumbs: any[] = this.state.selectedItems.slice(field.maxCrumbs, this.state.selectedItems.length)
            return otherCrumbs.map(item => {
              return (<div className='select-box--crumb-container' key={item.key}>
                {item.key}          <FontAwesome
                  className={`remove crumb-icon`}
                  name={`remove`}
                  onClick={() => this.selectItem(item)}
                />
              </div>)
            })
          }
          return (
            <div className='select-box--crumb-container'>
              {item.key}          <FontAwesome
                className={`chevron-${chevronDirection} crumb-icon`}
                name={`chevron-${chevronDirection}`}
                onClick={() => this.setState({ showAdditionalCrumbs: !this.state.showAdditionalCrumbs })}
              />
            </div>
          )
        }
      });
    } else {
      console.log(3)
    }
  };
  renderSubLabel = () => {
    return (
      <div className={"select-box--sublabel"}>{this.props.field.aggSublabel}</div>)

  }
  componentDidMount = () => {
    if (this.props.field.defaultToOpen === true) {
      this.setState({ showItems: true, showAdditionalCrumbs: true });
      this.props.handleLoadMore()

    }
    if (this.props.selectedKeys) {
      let selectedKeysPlaceHolders: any[] = [];
      this.props.selectedKeys.forEach(o => (
        selectedKeysPlaceHolders.push({ key: o, docCount: null })
      ))
      this.setState({ selectedItems: selectedKeysPlaceHolders })
    }
  };
  componentDidUpdate(prevProps){
    if(this.props.selectedKeys !== prevProps.selectedKeys){
      let selectedKeysPlaceHolders: any[] = [];
      this.props.selectedKeys.forEach(o => (
        selectedKeysPlaceHolders.push({ key: o, docCount: null })
      ))
      this.setState({ selectedItems: selectedKeysPlaceHolders })
    }
  }
  renderPreValue = (item) => {
    if (this.props.field.display == "CHECKBOX" ||this.props.field.display == "STRING" ) {
      return this.isSelected(item) ? <FontAwesome name='far fa-check-square check' className={`square-checkmark${this.props.isPresearch ? "" : "-facet"}`}/> : <div className={`check-outer${this.props.isPresearch ? "" : "-facet"}`}></div>
    }
    return null
  };
  handleRange = (rangeArray) => {
    this.setState({ selectedItems: rangeArray })
  }
  handleLocation = (location) => {
    this.setState({ selectedItems: location })
  }
  renderFilter = () => {
    if (this.props.fromAggField || this.props.field.showFilterToolbar == true || this.props.field.showFilterToolbar == null) {
      return (
        <Filter
          buckets={this.props.buckets}
          filter={this.props.filter}
          desc={this.props.desc}
          sortKind={this.props.sortKind}
          selectAll={this.props.handleSelectAll}
          checkSelect={this.props.checkSelect}
          checkboxValue={this.props.checkboxValue}
          removeSelectAll={this.props.removeSelectAll}
          showLabel={false}
          handleFilterChange={this.props.handleFilterChange}
          toggleAlphaSort={this.props.toggleAlphaSort}
          toggleNumericSort={this.props.toggleNumericSort}
          setShowLabel={() => this.props.setShowLabel}
        />
      )

    }
    return
  }

  renderPanel = () => {
    const { hasMore, buckets, handleLoadMore, field } = this.props
    const { showItems, loading } = this.state
    if (!this.props.isOpen) return
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
          handleLoadMore={this.props.handleLoadMore}
          aggType={field?.display}
          field={field}
          handleRange={this.handleRange}
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
          onClickHandler={this.selectItem}
        />
      )
    } else if (field?.display === FieldDisplay.BAR_CHART) {
      return (
        <BarChartComponent
          isPresearch={this.props.isPresearch}
          onClickHandler={this.selectItem}
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
          isSelected={this.isSelected}
          hasMore={hasMore}
          field={field}
          handleLocation={this.handleLocation}
        />
      )
    }
    else if (field.display == "CRUMBS_ONLY") {
      return null
    }
    else if (this.props.field.display == "CHECKBOX" || this.props.field.display == "STRING") {

      return (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.props.handleLoadMore}
          hasMore={this.props.hasMore}
          useWindow={false}
          loader={
            <div key={0} style={{ display: 'flex', justifyContent: 'center' }}>
              <BeatLoader key="loader" color={this.props.isPresearch ? '#000' : '#fff'} />
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
                key={item.key+'buckets'}
                onClick={() => this.selectItem(item)}
                className={
                  this.state.selectedItem === item
                    ? "selected select-item"
                    : "select-item"
                }
              >
                <div className="item-content">
                  {this.renderPreValue(item.key)}
                  <span>{item.key} ({item.docCount})</span>
                </div>
              </div>
            ))}
        </InfiniteScroll>
      )
    }
    else {

      return (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.props.handleLoadMore}
          hasMore={this.props.hasMore}
          useWindow={false}
          loader={
            <div key={0} style={{ display: 'flex', justifyContent: 'center' }}>
              <BeatLoader key="loader" color={this.props.isPresearch ? '#000' : '#fff'} />
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
              this.isSelected(item.key) ? null :
                <div
                  key={item.key+'buckets'}
                  onClick={() => this.selectItem(item)}
                  className={
                    this.state.selectedItem === item
                      ? "selected select-item"
                      : "select-item"
                  }
                >
                  <div className="item-content">
                    {/* {this.renderPreValue(item.key)} */}
                    <span>{item.key} ({item.docCount})</span>
                  </div>
                </div>
            ))}
        </InfiniteScroll>
      )
    }
  }
  isSelected = (key: string): boolean =>
    this.props.selectedKeys && this.props.selectedKeys.has(key);
  render() {
    const ThemedContainer = this.props.isPresearch ? ThemedPresearchCard : ThemedFacetAgg
    const ThemedHeader = this.props.isPresearch ? ThemedPresearchHeader : ThemedFacetHeader
    //Find why this is not themedPresearchTitle 
    const ThemedTitle = this.props.isPresearch ? PresearchTitle : ThemedFacetTitle
    let configuredLabel = this.props.field?.displayName || '';
    const title = aggToField(this.props.field.name, configuredLabel);
    if (this.props.buckets == undefined && this.props.isOpen) {
      return <BeatLoader />
    }
    const icon = `chevron${this.state.showItems ? '-up' : '-down'}`;
    return (
      <ThemedSelectBox>
        <ThemedContainer>
          <ThemedHeader>

            < ThemedTitle style={{ flexDirection: 'row', display: 'flex' }} onClick={this.dropDown}>
              {/* {this.props.aggKind === 'crowdAggs'
                       ? configuredLabel
                       : title}         */}
              {capitalize(title)}
              {this.props.field.display == "CRUMBS_ONLY" ? (null) : (<FontAwesome name={icon} style={{ display: 'flex', marginLeft: 'auto' }} />)}            
            </ThemedTitle>
            {this.props.isPresearch ? (
              <div className='select-box--crumbs'>
                {this.state.selectedItems.length > 0 ? this.renderSelectedItems() : this.renderSubLabel()}
              </div>
            ) : null}

          </ThemedHeader>
          <div
            style={{ padding: '0 10px', display: this.state.showItems ? "block" : "none" }}

          >
            {this.renderFilter()}
          </div>
          <div
            style={{ display: this.state.showItems ? "block" : "none" }}

            className={this.props.isPresearch ? "select-box--buckets-presearch" : "select-box--buckets-facet"}
          >
            {this.renderPanel()}
          </div>
        </ThemedContainer>
      </ThemedSelectBox>
    );
  }
}

export default CustomDropDown;