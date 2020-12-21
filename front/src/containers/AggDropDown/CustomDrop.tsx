import * as React from 'react';
import { FieldDisplay } from 'types/globalTypes';
import styled from 'styled-components';
import { SiteViewFragment_search_aggs_fields } from 'types/SiteViewFragment';
import * as FontAwesome from 'react-fontawesome';
import { BeatLoader } from 'react-spinners';
import * as InfiniteScroll from 'react-infinite-scroller';

import {
  ThemedPresearchCard,
  ThemedPresearchHeader,
  PresearchTitle,
  PresearchContent,
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
} from 'ramda';
import withTheme from 'containers/ThemeProvider';
import bucketKeyIsMissing from 'utils/aggs/bucketKeyIsMissing';

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
 .select-box--container-facet{
  min-height: 50px;
  border-bottom: 1px solid #3d3d3d;
  width: 100%;
  margin: 0;
  position: relative;
  color: ${props => props.theme.aggSideBar.sideBarFont};
 }
  * {
    box-sizing: border-box;
  }

  .check-outer {
    width: 13px;
    height: 13px;
    border: 1px solid black;
    position: relative;
    margin-right: 7px;
    top: 4px;
    border-radius: 2px;

  }
  .check-outer-facet {
    width: 13px;
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
  .select-box--title-facet{
    display: inline-block;
    height: 100%;
    width: 100%;
    padding: 4px 12px;
    vertical-align: middle;
    font-size: 1.15em;
    margin-top:10px;
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

  .select-box--arrow {
    width: 30px;
    height: 30px;
    margin: 0;
    padding: 15px 3px;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
  }

  .select-box--arrow-down {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid black;
  }

  .select-box--arrow-up {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid black;
}
.select-box--buckets-facet{
  max-height:300px;
  overflow: scroll;
  padding-left: 10px;
  color: rgb(255, 255, 255);
}
.select-box--buckets-presearch{
  height:200px;
  overflow-y: scroll;
  padding-left: 10px;
  color: black;
}
.select-item{
  min-height: 20px;
  padding-left: 10px;
  margin: 10px 0;
  font-weight: 400;
  cursor: pointer;
}
`
const ThemedSelectBox= withTheme(SelectBoxBox)
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
  };

  dropDown = () => {
    this.setState((prevState) => ({
      showItems: !prevState.showItems
    }), () => this.props.handleLoadMore()
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
    if (this.props.field.display == "MULTI" || this.props.field.display == "STRING") {
      //need to filter to prevent dups
      this.setState({
        selectedItem: item,
        selectedItems: [...this.state.selectedItems, item]
      });
    }

  };

  renderSelectedItems = () => {
    if (this.state.selectedItems.length > 0) {
      console.log(1)
      return this.state.selectedItems.map((item) => {
        console.log(2)
        //@ts-ignore
        if (this.isSelected(item.key)) {
          //@ts-ignore
          return <div> {item.key} ({item.docCount})</div>

        }
        return
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
      this.setState({ showItems: true });
      this.props.handleLoadMore()

    }


  };
  renderPreValue = (item) => {
     if (this.props.field.display =="STRING") {
    return <div className={`check-outer${this.props.isPresearch ? "" : "-facet"}`}>{
      this.isSelected(item) ? <FontAwesome name='check' style={{ display: 'flex' }} /> : null
    }</div>;
    }
    return null 
  };
  isSelected = (key: string): boolean =>
    this.props.selectedKeys && this.props.selectedKeys.has(key);
  render() {
    let configuredLabel = this.props.field?.displayName || '';
    const title = aggToField(this.props.field.name, configuredLabel);
    if (this.props.buckets == undefined) {
      return <BeatLoader />
    }
    const icon = `chevron${this.state.showItems ? '-up' : '-down'}`;

    if (this.props.isPresearch) {
      //Calling this our standard presearch for now
      return (
        <ThemedSelectBox>
          <ThemedPresearchCard>
            <ThemedPresearchHeader>

              < PresearchTitle style={{ flexDirection: 'row', display: 'flex' }}>
                {/* {this.props.aggKind === 'crowdAggs'
                       ? configuredLabel
                       : title}         */}
                {capitalize(title)}
                <FontAwesome name={icon} onClick={this.dropDown} style={{ display: 'flex', marginLeft: 'auto' }} />{' '}
              </PresearchTitle>
              {this.state.selectedItems.length > 0 ? this.renderSelectedItems() : this.renderSubLabel()}
            </ThemedPresearchHeader>
            <div
              style={{ padding: '0 10px', display: this.state.showItems ? "block" : "none" }}

            >
              {this.props.field.showFilterToolbar ? (<Filter
                buckets={this.props.buckets}
                filter={this.state.filter}
                desc={this.state.desc}
                sortKind={this.state.sortKind}
                selectAll={this.props.handleSelectAll}
                checkSelect={console.log("this.props.checkSelectAll")}
                checkboxValue={console.log("this.props.checkboxValue")}
                removeSelectAll={console.log("this.props.removeSelectAll")}
                showLabel={false}
                handleFilterChange={console.log("this.props.this.handleFilterChange")}
                toggleAlphaSort={console.log("this.props.toggleAlphaSort")}
                toggleNumericSort={console.log("this.props.toggleNumericSort")}
                setShowLabel={() => console.log("this.props.setShowLabel")}
              />) : (null)}
            </div>
            <div
              style={{ display: this.state.showItems ? "block" : "none" }}

              className={"select-box--buckets-presearch"}
            >
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
                    key={item.key}
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
            </div>
          </ThemedPresearchCard>
        </ThemedSelectBox>
      );
    } else {

      return (
        <ThemedSelectBox>
          <div className="select-box--container-facet">
            <div className={"select-box--title-facet"}>
              {capitalize(title)}
            </div>
            {/* <div className="select-box--selected-item">
              {this.state.selectedItems && this.renderSelectedItems()}
            </div> */}
            <div className="select-box--arrow" onClick={this.dropDown}>
              <span>
                <FontAwesome name={icon} />{' '}
              </span>
            </div>

            <div
              style={{ display: this.state.showItems ? "block" : "none" }}
              className={"select-box--buckets-facet"}
            >
              {this.props.field.showFilterToolbar ? (<Filter
            buckets={this.props.buckets}
            filter={this.props.filter}
            desc={this.props.desc}
            sortKind={this.props.sortKind}
            selectAll={this.props.selectAll}
            checkSelect={this.props.checkSelect}
            checkboxValue={this.props.checkboxValue}
            removeSelectAll={this.props.removeSelectAll}
            showLabel={this.props.showLabel}
            handleFilterChange={this.props.handleFilterChange}
            toggleAlphaSort={this.props.toggleAlphaSort}
            toggleNumericSort={this.props.toggleNumericSort}
            setShowLabel={this.props.showLabel}
              />) : (null)}
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
                    key={item.key}
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

            </div>
          </div>
        </ThemedSelectBox>
      );
    }
  }
}

export default CustomDropDown;