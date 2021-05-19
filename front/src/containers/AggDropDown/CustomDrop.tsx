import * as React from 'react';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import styled from 'styled-components';
import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import * as FontAwesome from 'react-fontawesome';
import { BeatLoader } from 'react-spinners';
import * as InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
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
import {
  AggBucket,
} from '../SearchPage/Types';
import aggToField from 'utils/aggs/aggToField';
import { capitalize } from 'utils/helpers';
import {
  propEq,
  findIndex,
  find
} from 'ramda';
import withTheme from 'containers/ThemeProvider';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import CustomDropCrumbs from './CustomDropCrumbs';
import CustomDropPanel from './CustomDropPanel';
import { settings } from 'cluster';

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
  updater: AggFilterInputUpdater;
  disabled?: boolean;
  allowsMissing?:boolean;
  searchResultData:any;
  isUpdatingParams:boolean;
}
interface CustomDropDownState {
  buckets?: AggBucket[],
  showItems: boolean,
  selectedItem: any[],
  type: string,
  defaultOpen: boolean,
  selectedItems: any[],
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

 .select-box--buckets-presearch .allow-missing{
  background-color: #ececec;
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
  .crumb-icon{
    padding-left:3px;
  }
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
.disabled-check{
  color: #e6e6e6 !important;
}
.disabled-text{
  color: #b4b4b4 !important;
  cursor: not-allowed
}
.disabled-checkbox{
  border: 1px solid #b4b4b4;
}
.disabled-cursor{
  cursor: not-allowed !important;
  .select-item{
    cursor: not-allowed !important;

  }
}

`
const ThemedSelectBox = withTheme(SelectBoxBox)
class CustomDropDown extends React.Component<CustomDropDownProps, CustomDropDownState> {
  //@ts-ignore
  state = {
    buckets: this.props.buckets as AggBucket[],
    showItems: this.props.field.defaultToOpen,
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
    this.props.handleLoadMore();
    this.setState((prevState) => ({
      showItems: !prevState.showItems,
      showAdditionalCrumbs: !prevState.showItems
    })
    );
    this.props.onContainerToggle && this.props.onContainerToggle()
  };
  onChangeRange = () => {
    this.props.updater.changeRange([
      //@ts-ignore
      this.state.selectedItems[0].start || this.props.updater.input?.gte,
      //@ts-ignore
      this.state.selectedItems[0].end || this.props.updater.input?.lte,
    ]);
  }

  selectItem = (item) => {
    if (this.props.field.display == "GREATER_THAN_DROP_DOWN") {
      this.setState({ selectedItems: [{ start: item.key, end: null }] },
        () => this.onChangeRange())
      return
    }
    if (this.props.field.display == "LESS_THAN_DROP_DOWN") {
    this.setState({ selectedItems: [{ start: null, end: item.key }] },
        () => this.onChangeRange())
      return
    }

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
  componentDidMount = () => {
    if (this.props.selectedKeys) {
      //console.log("SELECTED KEYS ", this.props.selectedKeys)
      let selectedKeysPlaceHolders: any[] = [];
      this.props.selectedKeys.forEach(o => (
        selectedKeysPlaceHolders.push({ key: o, docCount: null })
      ))
      this.setState({ selectedItems: selectedKeysPlaceHolders });
    }
    if(this.props.field.display == "GREATER_THAN_DROP_DOWN"){
      this.setState({ selectedItems: [{start: this.props.updater.input?.gte, end : this.props.updater.input?.lte}] });
    }
    if(this.props.field.display == "LOCATION"){
      
      let searchParams= this.props.searchResultData?.data?.searchParams.searchParams
      const aggSettings = find(
        (x) => x.field == "location",
        searchParams["aggFilters"]
      );

      if (!aggSettings) return;
      this.setState({ selectedItems: [{zipcode: aggSettings.zipcode, radius : aggSettings.radius, lat : aggSettings.lat, long : aggSettings.long}] });
    }
  };
  componentDidUpdate(prevProps,prevState){
    if(this.props.selectedKeys !== prevProps.selectedKeys || this.props.selectedKeys[0] ){
      let selectedKeysPlaceHolders: any[] = [];
      this.props.selectedKeys.forEach(o => (
        selectedKeysPlaceHolders.push({ key: o, docCount: null })
      ))

      this.setState({ selectedItems: selectedKeysPlaceHolders })
    }
    if (prevProps.isOpen !== this.props.isOpen){
      this.setState({showItems : this.props.isOpen})
    }
    if(this.props.field.display == "GREATER_THAN_DROP_DOWN"  && prevState.selectedItems == this.state.selectedItems){
      this.setState({ selectedItems: [{start: this.props.updater.input?.gte, end : this.props.updater.input?.lte}] })
    }
    if(this.props.field.display == "LOCATION"  && prevState.selectedItems == this.state.selectedItems){ 
      let searchParams= this.props.searchResultData?.data?.searchParams.searchParams
      const aggSettings = find(
        (x) => x.field == "location",
        searchParams["aggFilters"]
      );

      if (!aggSettings) return;
      this.setState({ selectedItems: [{zipcode: aggSettings.zipcode, radius : aggSettings.radius, lat : aggSettings.lat, long : aggSettings.long}] });
    }
  }


  handleRange = (rangeArray) => {
    this.setState({ selectedItems: rangeArray })
  }
  handleLocation = (location) => {
    this.setState({ selectedItems: [{zipcode: location[0], radius : location[3], lat : location[1], long : location[2]}] })
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

  
    isSelected = (key: string): boolean =>
    this.props.selectedKeys && this.props.selectedKeys.has(key);
  render() {
    const ThemedContainer = this.props.isPresearch ? ThemedPresearchCard : ThemedFacetAgg
    const ThemedHeader = this.props.isPresearch ? ThemedPresearchHeader : ThemedFacetHeader
    //Find why this is not themedPresearchTitle 
    const ThemedTitle = this.props.isPresearch ? PresearchTitle : ThemedFacetTitle
    let configuredLabel = this.props.field?.displayName || '';
    const title = aggToField(this.props.field.name, configuredLabel);
    const showAllowMissing = this.props.field.showAllowMissing;

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
                 <CustomDropCrumbs 
                 field = { this.props.field } 
                 selectedItems = {this.state.selectedItems}
                 isSelected={this.isSelected}
                 selectItem={this.selectItem} />
                {showAllowMissing && this.props.allowsMissing && (
                  <div className='select-box--crumb-container'>
                    {'Allow Missing'}
                    <FontAwesome
                      className="remove crumb-icon"
                      name="remove"
                      onClick={() => this.props.updater.toggleAllowMissing()}
                    />
                  </div>
                )}
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

            className={`${this.props.isPresearch ? "select-box--buckets-presearch" : "select-box--buckets-facet" } ${this.props.disabled ? "disabled-cursor" : ""}`}
          >
            <CustomDropPanel 
            buckets={this.props.buckets} 
            field={this.props.field}
            handleLoadMore={this.props.handleLoadMore}
            hasMore={this.props.hasMore}
            isOpen={this.props.isOpen}
            handleRange={this.handleRange}
            loading={this.state.loading}
            selectItem={this.selectItem}
            isSelected={this.isSelected}
            handleLocation={this.handleLocation}
            onCheckBoxToggle={this.props.onCheckBoxToggle}
            selectedItem={this.state.selectedItem}
            isPresearch={this.props.isPresearch}
            disabled={this.props.disabled}
            allowsMissing={this.props.allowsMissing}

            />
          </div>
        </ThemedContainer>
      </ThemedSelectBox>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  // user: state.user,
  isUpdatingParams: state.search.isUpdatingParams,
  searchResultData: state.search.searchResults,
  isFetchingAutoSuggest:  state.search.isFetchingAutoSuggest
})
export default connect(mapStateToProps, null)(withAggContext(CustomDropDown));