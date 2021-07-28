import * as React from 'react';
import styledComponents from 'styled-components';
import {
  pipe,
  length,
  prop,
  sortBy,
  pathOr,
  uniqBy,
  equals,
  find,
  reverse,
} from 'ramda';
import { Panel } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import {
  AggBucket,
  AggCallback,
  AggregateAggCallback,
  SearchParams,
  AggKind,
  maskAgg,
} from '../SearchPage/Types';
import aggToField from 'utils/aggs/aggToField';
import findFields from 'utils/aggs/findFields';
import { FieldDisplay } from '../../services/site/model/InputTypes';
import './AggDropDownStyle.css';
import { PresentSiteFragment, PresentSiteFragment_siteView } from 'services/site/model/PresentSiteFragment';
import SortKind from './SortKind';
import CustomDropDown from './CustomDrop';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { connect } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { fetchSearchPageAggBuckets, fetchSearchPageCrowdAggBuckets } from 'services/search/actions';

const PAGE_SIZE = 25;

const Container = styledComponents.div`
  padding: 10px;
  padding-right: 0;
`;
const ChartContainer = styledComponents.div`
  padding-top: 10px;
  overflow-x: auto;
  max-height: 200px;
  min-height: 200px;
`;

const PanelWrapper = styledComponents.div`
  .flex {
    display:flex;
    justify-content: space-between;
  }
  .checkbox {
    margin: 3px 0px;
  }
  .panel-body {
    padding: 5px;
    overflow-x: auto;
    max-height: 400px;
  }
  #range-dropdown {
    padding: 5px;
    max-height: 400px;
    overflow-x: visible;
  }
  .range-selector {
    padding: 5px;
    padding-right: 15px;
  }
  .range-selector .dropdown {
    width: 100%;
 }
  .range-selector button {
    width: 100%;
  }
`;
const ChartWrapper = styledComponents.div`
    margin-top: 0;
    max-height: 240px;
    min-height: 200px;
    margin-left: 5px;
    position: relative;
    overflow: hidden;
`

interface AggDropDownState {
  hasMore: boolean;
  isOpen: boolean;
  loading: boolean;
  filter: string;
  buckets: AggBucket[];
  prevParams: SearchParams | null;
  desc: boolean;
  sortKind: any;
  checkboxValue: boolean;
  showLabel: boolean;
}

interface AggDropDownProps {
  agg: string;
  isOpen: boolean;
  buckets: AggBucket[];
  searchParams: SearchParams;
  aggKind: AggKind;
  selectedKeys: Set<string>;
  addFilter: AggCallback;
  addFilters: AggregateAggCallback;
  addAllFilters: (agg: string, aggValues: string[], isCrowd: boolean)=>void;
  removeAllFilters: (agg: string, aggValues: string[], isCrowd: boolean)=>void;
  removeFilters: AggregateAggCallback;
  removeFilter: AggCallback;
  display?: FieldDisplay;
  visibleOptions?: String[];
  onOpen?: (agg: string, aggKind: AggKind) => void;
  removeSelectAll?: boolean;
  presearch?: boolean;
  configType?: 'presearch' | 'autosuggest' | 'facetbar';
  returnAll?: boolean;
  resetSelectAll?: () => void;
  site: PresentSiteFragment;
  presentSiteView: PresentSiteFragment_siteView;
  fromAggField: boolean;
  updater: AggFilterInputUpdater | null;
  fetchAggBuckets: any;
  fetchCrowdAggBuckets: any;
  aggBuckets: any;
  crowdAggBuckets: any;
  loadingAggBuckets: boolean;
  loadingCrowdAggBuckets: boolean;
}

class AggDropDown extends React.Component<AggDropDownProps, AggDropDownState> {
  state = {
    hasMore: true,
    loading: false,
    buckets: [] as AggBucket[],
    filter: '',
    isOpen: false,
    prevParams: null,
    sortKind: SortKind.Alpha,
    desc: true,
    checkboxValue: false,
    showLabel: false,
  };

  static getDerivedStateFromProps(
    props: AggDropDownProps,
    state: AggDropDownState
  ) {
    if (props.isOpen !== state.isOpen) {
      if (props.isOpen) {
        return {
          hasMore: true,
          loading: false,
          buckets: [],
          filter: '',
          isOpen: props.isOpen,
          prevParams: props.searchParams,
        };
      }
      return {
        hasMore: true,
        loading: false,
        buckets: props.buckets,
        filter: '',
        isOpen: props.isOpen,
        prevParams: props.searchParams,
      };
    }

    const findAgg = (searchParams: SearchParams | null) => {
      if (!searchParams) return null;

      const key = props.aggKind === 'aggs' ? 'aggFilters' : 'crowdAggFilters';
      return find(agg => agg.field === props.agg, searchParams[key]);
    };


  /*   if (props.presearch && !equals(state.prevParams, props.searchParams)) {  
    //! Do we still need this? Take out fix for other buckets/facets not updating bug
      return {
        hasMore: true,
        loading: false,
        // buckets: [],
        prevParams: props.searchParams,
      };
    } */
    const prevAggValue = findAgg(state.prevParams);
    const nextAggValue = findAgg(props.searchParams);

    if (
      state.isOpen &&
      !equals(state.prevParams, props.searchParams) &&
      equals(prevAggValue, nextAggValue)
    ) {

      return {
        hasMore: true,
        loading: false,
        buckets: props.buckets,
        filter: '',
        isOpen: props.isOpen,
        prevParams: props.searchParams,
      };
    }

    return null;
  }



  isSelected = (key: string): boolean =>     
    this.props.selectedKeys && this.props.selectedKeys.has(key);

  selectAll = (agg: string): void => {
    const { buckets } = this.state;
    let newParams: string[] = [];

    buckets.map(({ key }) => {
      newParams.push(key);
    });

    if (this.props.removeSelectAll) {
      this.setState({
        checkboxValue: false,
      });
    }
    if (this.isAllSelected() !== true) {
      if (!this.props.addFilters) {
        this.props.addAllFilters(agg, newParams, false);
        this.setState({
          checkboxValue: true,
        });
        return;
      }
      this.props.addFilters(this.props.agg, newParams, false);
      this.setState({
        checkboxValue: true,
      });
    } else {
      if (!this.props.removeFilters) {
        this.props.removeAllFilters(agg, newParams, false);
        this.setState({
          checkboxValue: false,
        });
        return;
      }
      this.setState({
        checkboxValue: false,
      });
      this.props.removeFilters(this.props.agg, newParams, false);
    }
        };

  isAllSelected = (): boolean => {
    const { buckets } = this.state;
    let i = 0;
    buckets.map(({ key }) => {
      if (this.isSelected(key)) {
        i++;
      }
    });
    if (buckets.length === i) {
      return true;
    }
    return false;
  };

  getFullPagesCount = buckets => Math.floor(length(buckets) / PAGE_SIZE);

  handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({ filter: value, buckets: [], hasMore: true });
  };

  handleToggle = () => {
    this.props.onOpen && this.props.onOpen(this.props.agg, this.props.aggKind);
  };

  handleSort = (desc: boolean, sortKind: SortKind) => {
    switch (sortKind) {
      case SortKind.Alpha:
        return [{ id: 'key', desc: !desc }];
      case SortKind.Number:
        return [{ id: 'count', desc: !desc }];
    }
  };


  componentDidUpdate(prevProps) {
    if (prevProps.aggBuckets !== this.props.aggBuckets || prevProps.crowdAggBuckets !== this.props.crowdAggBuckets) {
        this.handleLoadMoreResponse();
    }
}

  handleLoadMore = () => {
    // console.log("LOADIng MORE!!!!!!!!!!!!!!!!!!")
    //console.trace()
    const { desc, sortKind, buckets, filter } = this.state;
    const {
      agg,
      searchParams,
      presentSiteView,
      configType,
      returnAll,
    } = this.props;

    let aggSort = this.handleSort(desc, sortKind);
    let page = this.getFullPagesCount(this.state.buckets);
    const pageNumber = isNaN(page) || page === null ? 0 : page; 
    //console.log("🚀 ~ AggDropDown ~ pageNumber", pageNumber);
    
    const variables = {
      ...searchParams,
      url: presentSiteView.url,
      configType: configType,
      returnAll: returnAll,
      aggFilters: maskAgg(searchParams.aggFilters, this.props.agg),
      crowdAggFilters: maskAgg(
        this.props.searchParams.crowdAggFilters,
        this.props.agg
        ),
        agg: agg,
        pageSize: PAGE_SIZE,
        page: pageNumber,//this.getFullPagesCount(this.state.buckets),//! Pagination IS being used for InfiniteLoader, bug fix 351, component will be deprecated on MMSearchPage
        aggOptionsFilter: filter, 
        aggOptionsSort: aggSort,
      };
      //console.log("🚀 ~  ~ variables", variables);
    this.props.aggKind === "crowdAggs" ? this.props.fetchCrowdAggBuckets(variables) : this.props.fetchAggBuckets(variables);
    //this.handleLoadMoreResponse();
  }

  handleLoadMoreResponse = () => {
    const { desc, sortKind, buckets, filter } = this.state;
    const { agg, presearch, presentSiteView } = this.props;
    let currentAgg = findFields(agg, presentSiteView, presearch);
    //console.log("🚀 ~ currentAgg", currentAgg?.name);
    let aggName = currentAgg!.name
    let responseBuckets = this.props.aggKind === "crowdAggs" ?  this.props.crowdAggBuckets?.aggs[aggName] :  this.props.aggBuckets?.aggs[aggName]


    let currentBuckets = buckets === undefined || buckets[0] === undefined ? []  : buckets
    const allBuckets = currentBuckets.concat(responseBuckets);
    let newBuckets = pipe(
      uniqBy<AggBucket>(prop('key')),
      sortBy<AggBucket>(prop('key'))
    )(allBuckets);

    if (!desc && sortKind === SortKind.Alpha) {
      newBuckets = pipe(
        uniqBy<AggBucket>(prop('key')),
        sortBy(prop('key')),
        reverse
      )(allBuckets) as AggBucket[];
    }
    if (desc && sortKind === SortKind.Number) {
      newBuckets = pipe(
        uniqBy(prop('key')),
        sortBy<AggBucket>(prop('docCount'))
      )(allBuckets) as AggBucket[];
    }
    if (!desc && sortKind === SortKind.Number) {
      newBuckets = pipe(
        uniqBy(prop('key')),
        sortBy<AggBucket>(prop('docCount')),
        reverse
      )(allBuckets) as AggBucket[];
    }

    const hasMore = length(buckets) !== length(newBuckets);
    this.setState({ buckets: newBuckets, hasMore });
  };
  
  toggleAlphaSort = () => {
    this.setState({
      desc: !this.state.desc,
      sortKind: SortKind.Alpha,
      buckets: [],
      hasMore: true,
    });
  };

  toggleNumericSort = () => {
    this.setState({
      desc: !this.state.desc,
      sortKind: SortKind.Number,
      buckets: [],
      hasMore: true,
    });
  };

  checkSelect = () => {
    if (this.props.removeSelectAll) {
      this.setState(
        {
          checkboxValue: false,
        },
        () => {
          if (this.props.resetSelectAll != null) {
            this.props.resetSelectAll();
          }
        }
      );
    }
  };

  componentDidMount() {
    const { agg, presentSiteView, presearch } = this.props;
    
    const field = findFields(agg, presentSiteView, presearch);
    if (field?.order && field.order.sortKind === 'key') {
      this.setState({
        sortKind: 0,
        desc: field.order.desc,
      });
    } else if (field?.order && field.order.sortKind === 'count') {
      this.setState({
        sortKind: 1,
        desc: field.order.desc,
      });
    }
  }
  handleCheckboxToggle=(bucketKey, activeOptions)=>{
    const { agg, presentSiteView, presearch } = this.props;
    const field = findFields(agg, presentSiteView, presearch);
    //@ts-ignore
    //need to handle the single select functionality
    if(field.display == "DROP_DOWN" || field.display == "DROP_DOWN"){
      activeOptions.forEach(o => {
        this.props.updater &&     this.props.updater.removeFilter(o.key);
      })
    }
    //Need to handle mutliselect functionality 
    this.props.updater &&  this.props.updater.toggleFilter(bucketKey);
  }

  render() {
    const { agg, presearch, presentSiteView, removeSelectAll} = this.props;
    const {
      buckets = [],
      filter,
      desc,
      sortKind,
      isOpen,
      hasMore,
      checkboxValue,
      showLabel,
      loading,
    } = this.state;
    let currentAgg = findFields(agg, presentSiteView, presearch);
    let configuredLabel = currentAgg?.displayName || '';
    const title = aggToField(agg, configuredLabel);

    if(!currentAgg){
     return <BeatLoader/>
    }

    let customBuckets = this.state.buckets === undefined || this.state.buckets[0] === undefined ? []  : this.state.buckets
    //console.log("BUCKETS state @ CustomDropD",agg, customBuckets)  

    const icon = `chevron${isOpen ? '-up' : '-down'}`;
    if (presearch) {
      return (
        <CustomDropDown
        buckets={customBuckets}
        isPresearch={true}
        selectedKeys={this.props.selectedKeys}
        field={currentAgg}
        onContainerToggle={this.handleToggle}
        handleLoadMore={this.handleLoadMore}
        hasMore={this.state.hasMore}
        onCheckBoxToggle={this.handleCheckboxToggle}
        handleSelectAll={this.selectAll}
        filter={filter}
        desc={desc}
        sortKind={sortKind}
        selectAll={this.selectAll}
        checkSelect={this.checkSelect}
        checkboxValue={checkboxValue}
        removeSelectAll={removeSelectAll}
        showLabel={showLabel}
        handleFilterChange={this.handleFilterChange}
        toggleAlphaSort={this.toggleAlphaSort}
        toggleNumericSort={this.toggleNumericSort}
        setShowLabel={showLabel => this.setState({ showLabel })}
        isOpen={this.props.isOpen}
        fromAggField={this.props.fromAggField}
        />
      );
    } else {
      return (
        <CustomDropDown
        buckets={customBuckets}
        isPresearch={false}
        selectedKeys={this.props.selectedKeys}
        field={currentAgg}
        onContainerToggle={this.handleToggle}
        handleLoadMore={this.handleLoadMore}
        hasMore={this.state.hasMore}
        onCheckBoxToggle={this.handleCheckboxToggle}
        handleSelectAll={this.selectAll}
        filter={filter}
        desc={desc}
        sortKind={sortKind}
        selectAll={this.selectAll}
        checkSelect={this.checkSelect}
        checkboxValue={checkboxValue}
        removeSelectAll={removeSelectAll}
        showLabel={showLabel}
        handleFilterChange={this.handleFilterChange}
        toggleAlphaSort={this.toggleAlphaSort}
        toggleNumericSort={this.toggleNumericSort}
        setShowLabel={showLabel => this.setState({ showLabel })}
        isOpen={this.props.isOpen}
        fromAggField={this.props.fromAggField}
        />
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  // fetchAggBuckets: (searchParams) => dispatch(fetchSearchPageAggBuckets(searchParams)),
  fetchCrowdAggBuckets: (searchParams) => dispatch(fetchSearchPageCrowdAggBuckets(searchParams)),
})


const mapStateToProps = (state, ownProps) => ({
  presentSiteView: state.site.presentSiteProvider.site.siteView,
  aggBuckets: state.search.aggBuckets,
  crowdAggBuckets: state.search.crowdAggBuckets,
  loadingAggBuckets: state.search.isFetchingAggBuckets,
  loadingCrowdAggBuckets: state.search.isFetchingCrowdAggBuckets,
})

export default connect(mapStateToProps, mapDispatchToProps ) (withAggContext(AggDropDown));
