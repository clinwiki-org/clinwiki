import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import SortKind from 'containers/AggDropDown/SortKind';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchParams, updateSearchParamsAction } from 'services/search/actions'
import {RootState} from 'reducers';
import { fetchSearchPageAggBuckets, fetchSearchPageCrowdAggBuckets } from 'services/search/actions';

import {
  AggBucket,
  AggCallback,
  AggregateAggCallback,
  SearchParams,
  AggKind,
  maskAgg,
} from '../SearchPage/Types';

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
import { BeatLoader } from 'react-spinners';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
interface Props {
  hash?: string;
  aggId?: string;
  // updater: AggFilterInputUpdater | null;

}

 function IslandAgg(props: Props) {
  const { hash, aggId } = props;
  const dispatch = useDispatch();
//constants to be switched
const PAGE_SIZE = 25;

const emptySet = new Set();
const currentAgg= {
  aggSublabel: null,
  autoSuggest: false,
  bucketKeyValuePairs: null,
  defaultToOpen: null,
  display: "STRING",
  displayName: "overall_status",
  layout: "horizontal",
  maxCrumbs: null,
  name: "overall_status",
  order: {sortKind: "key", desc: true},
  preselected: {kind: "WHITELIST", values: Array(0)},
  rangeEndLabel: null,
  rangeStartLabel: null,
  rank: null,
  showAllowMissing: null,
  showFilterToolbar: null,
  visibleOptions: {kind: "WHITELIST", values: Array(0)} , 
  aggKind: "aggs"
}




useEffect(()=>{
  dispatch(fetchSearchParams(hash));
},[dispatch]);
const [desc, setDesc] = useState(true);
const [sortKind, setSortKind] = useState(SortKind.Alpha); 
    const [buckets, setBuckets] = useState([]);
    const [filter, setFilter] = useState('') ;
    const [hasMore, setHasMore]= useState(true);
    const [isOpen, setIsOpen]= useState(false);
    const [showLabel, setShowLabel]= useState(false);
    const [checkboxValue, setCheckboxValue]=useState(false);
    
    
    const data = useSelector((state : RootState ) => state.search.searchResults);
    const aggBuckets = useSelector((state : RootState) => state.search.aggBuckets)
    const crowdAggBuckets = useSelector((state : RootState) => state.search.crowdAggBuckets)
    
    const searchParams = data?.data?.searchParams;
    const paramsUrl = useUrlParams();
    const updateSearchParams = (searchParams) => {
      console.log("In Update PARAMS")
      const currentRams = {...searchParams, q : JSON.parse(searchParams.q)}
  dispatch( updateSearchParamsAction(currentRams));

};
    if(!searchParams){
      return <BeatLoader/>
    }

    //helper functions
    const getFullPagesCount = buckets => Math.floor(length(buckets) / PAGE_SIZE);
    const handleSort = (desc: boolean, sortKind: SortKind) => {
      switch (sortKind) {
        case SortKind.Alpha:
          return [{ id: 'key', desc: !desc }];
        case SortKind.Number:
          return [{ id: 'count', desc: !desc }];
      }
    };
    const handleCheckboxToggle=(bucketKey, activeOptions)=>{
      //@ts-ignore
      //need to handle the single select functionality
      if(currentAgg.display == "DROP_DOWN" || currentAgg.display == "DROP_DOWN"){
        activeOptions.forEach(o => {
          updater &&     updater.removeFilter(o.key);
          console.log("Need to hit updater",o)
        })
      }
      //Need to handle mutliselect functionality
      console.log(updater)

      updater &&  updater.toggleFilter(bucketKey);
      console.log("Need to hit updater", bucketKey)

    }
    const handleLoadMore = () => {
    console.log("HML")
    let aggSort = handleSort(desc, sortKind);
    
    
    const variables = {
      ...searchParams,
      url: paramsUrl.sv,
      configType: 'presearch',
      returnAll: false,
      aggFilters: maskAgg(searchParams.aggFilters, currentAgg.name),
      crowdAggFilters: maskAgg(
        searchParams.crowdAggFilters,
        currentAgg.name
      ),
      agg: currentAgg.name,
      pageSize: PAGE_SIZE,
      page: getFullPagesCount(buckets),
      aggOptionsFilter: filter,
      aggOptionsSort: aggSort,
      q: JSON.parse(searchParams.q)
    };
    currentAgg.aggKind === "crowdAggs" ? !crowdAggBuckets && dispatch(fetchSearchPageCrowdAggBuckets(variables)) : !aggBuckets && dispatch(fetchSearchPageAggBuckets(variables));
    handleLoadMoreResponse();
  }

  const handleLoadMoreResponse = () => {

    //console.log("🚀 ~ currentAgg", currentAgg?.name);
    let aggName = currentAgg!.name
    let responseBuckets = currentAgg.aggKind === "crowdAggs" ?  crowdAggBuckets?.aggs[aggName] : aggBuckets?.aggs[aggName]

    console.log("handle RESPONSE", aggBuckets);

    let currentBuckets = buckets[0] === undefined ? []  : buckets
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
    console.log("new", newBuckets)
    setBuckets(newBuckets);
      setHasMore(hasMore);
  };
  const toggleAlphaSort =()=>{
    setDesc(!desc);
    setSortKind(SortKind.Alpha);
    setBuckets([]);
    setHasMore(true);
  }
  const toggleNumericSort =()=>{
    setDesc(!desc);
    setSortKind(SortKind.Number);
    setBuckets([]);
    setHasMore(true);
  }
  const   handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setFilter(value);
    setBuckets([]);
    setHasMore(true);
  };
  console.log("HI from Island ", props)
//  if (!crowdAggBuckets && !aggBuckets){
//    return <BeatLoader/>
//  }
if(currentAgg.aggKind === "crowdAggs" && !crowdAggBuckets){
  return <BeatLoader/>
}
if(!aggBuckets && isOpen){
  return <BeatLoader/>
}
const updater = new AggFilterInputUpdater(
  currentAgg.name,
  searchParams || {},
  updateSearchParams,
 ' aggFilters'
);
  return (
    <>
      <div>
        Im an agg Island @ hash {hash} and ID: {aggId}
      </div>

      <CustomDropDown
        buckets={buckets || []}
        isPresearch={true}
        selectedKeys={emptySet}
        field={currentAgg}
        onContainerToggle={()=>setIsOpen(!isOpen)}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
        onCheckBoxToggle={handleCheckboxToggle}
        handleSelectAll={console.log("something") }
        filter={filter}
        desc={desc}
        sortKind={sortKind}
        selectAll={console.log("something") }
        checkSelect={console.log("something") }
        checkboxValue={checkboxValue}
        removeSelectAll={console.log("HI")}
        showLabel={showLabel}
        handleFilterChange={handleFilterChange}
        toggleAlphaSort={toggleAlphaSort}
        toggleNumericSort={toggleNumericSort}
        setShowLabel={showLabel => setShowLabel(showLabel)}
        isOpen={isOpen}
        fromAggField={false}
        /> 
    </>
  );
}
export default IslandAgg;