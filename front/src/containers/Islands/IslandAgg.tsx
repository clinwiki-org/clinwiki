import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import SortKind from 'containers/AggDropDown/SortKind';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchParams, updateSearchParamsAction, fetchFacetConfig } from 'services/search/actions'
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
  contains,
  filter,
  isEmpty, 
  isNil,
  map,
  dissoc,
  any,
  head,
  propOr,
  groupBy,
} from 'ramda';
import { BeatLoader } from 'react-spinners';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withAggContext } from 'containers/SearchPage/components/AggFilterUpdateContext';
import { AggFilterInput, SortInput } from 'types/globalTypes';

interface Props {
  aggId?: string;

}

 function IslandAgg(props: Props) {
  const { aggId } = props;
  const dispatch = useDispatch();
  const params = useUrlParams();
  const hash = params.hash
//constants to be switched
const PAGE_SIZE = 25;

const emptySet = new Set();
// const currentAgg= {
//   aggSublabel: null,
//   autoSuggest: false,
//   bucketKeyValuePairs: null,
//   defaultToOpen: null,
//   display: "STRING",
//   displayName: "overall_status",
//   layout: "horizontal",
//   maxCrumbs: null,
//   name: "overall_status",
//   order: {sortKind: "key", desc: true},
//   preselected: {kind: "WHITELIST", values: Array(0)},
//   rangeEndLabel: null,
//   rangeStartLabel: null,
//   rank: null,
//   showAllowMissing: null,
//   showFilterToolbar: null,
//   visibleOptions: {kind: "WHITELIST", values: Array(0)} , 
//   aggKind: "aggs"
// }
// const mainConfig =  "{\"default\":{\"0\":{\"agg_sublabel\":null,\"auto_suggest\":false,\"bucket_key_value_pairs\":null,\"default_to_open\":null,\"display\":\"STRING\",\"display_name\":\"default\",\"layout\":\"horizontal\",\"max_crumbs\":null,\"name\":\"default\",\"order\":{\"sortKind\":\"key\",\"desc\":true},\"preselected\":{\"kind\":\"WHITELIST\",\"values\":[]},\"range_end_label\":null,\"range_start_label\":null,\"rank\":null,\"show_allow_missing\":null,\"show_filter_toolbar\":null,\"visible_options\":{\"kind\":\"WHITELIST\",\"values\":[]},\"agg_kind\":\"aggs\"}}}"

 let getCurrentAgg = () =>{
   console.log('current agg id', aggId)

   let jsonConfig = JSON.parse(facetConfig.data.facetConfig.mainConfig)
   console.log(jsonConfig)
  aggId &&  console.log(jsonConfig.default[aggId])
  return aggId && jsonConfig.default[aggId]

 }


    useEffect(()=>{
      dispatch(fetchSearchParams(hash));
    },[dispatch]);
    useEffect(()=>{
      console.log("In facet config ")
      dispatch(fetchFacetConfig());
    },[dispatch]);

    const [desc, setDesc] = useState(true);
    const [sortKind, setSortKind] = useState(SortKind.Alpha); 
    const [buckets, setBuckets] = useState([]);
    const [aggFilter, setFilter] = useState('') ;
    const [hasMore, setHasMore]= useState(true);
    const [isOpen, setIsOpen]= useState(false);
    const [showLabel, setShowLabel]= useState(false);
    const [checkboxValue, setCheckboxValue]=useState(false);
    
    
    const data = useSelector((state : RootState ) => state.search.searchResults);
    const aggBuckets = useSelector((state : RootState) => state.search.aggBuckets);
    const crowdAggBuckets = useSelector((state : RootState) => state.search.crowdAggBuckets);
    const isUpdatingParams = useSelector((state : RootState) => state.search.isUpdatingParams);
    const isFetchingFacetConfig = useSelector((state : RootState) => state.search.isFetchingFacetConfig);
    const facetConfig = useSelector((state : RootState) => state.search.facetConfig);
    const searchParams = data?.data?.searchParams;
    const paramsUrl = useUrlParams();
    const updateSearchParams = (value) => {
      console.log("In Update PARAMS", searchParams)
      const currentRams = {...searchParams, value, q : JSON.parse(searchParams.q)}

      !isUpdatingParams &&  dispatch( updateSearchParamsAction(currentRams));

    };
    if(!searchParams || !aggId || !facetConfig){
      // getCurrentAgg()
      return <BeatLoader/>
    }

    let currentAgg = getCurrentAgg();
    let aggValues = find(
      (x) =>(console.log(x), x.field == currentAgg.name),
      searchParams['aggFilters']
    );
    //helper functions\

    const getFullPagesCount = buckets => Math.floor(length(buckets) / PAGE_SIZE);
    const handleSort = (desc: boolean, sortKind: SortKind) => {
      switch (sortKind) {
        case SortKind.Alpha:
          return [{ id: 'key', desc: !desc }];
        case SortKind.Number:
          return [{ id: 'count', desc: !desc }];
      }
    };

    // const updater = new AggFilterInputUpdater(
    //   currentAgg.name,
    //   searchParams || {},
    //   updateSearchParams,
    //  ' aggFilters'
    // );
    const  ACCEPTED_FIELDS = ['values', 'gte', 'lte', 'includeMissingFields', 'zipcode','radius', 'lat', 'long'];

   const  onUpdateFilter=()=> {

   const aggSettings = find(
    (x) => x.field == currentAgg.name,
    searchParams
  );
  const grouping = 'aggFilters'
      if(searchParams[grouping] || aggSettings ){
      const allButThisAgg = filter(
        (x) => x.field !== currentAgg.name,
        searchParams[grouping] || aggSettings
      );
      console.log(aggSettings)
      console.log(allButThisAgg)
      if (hasNoFilters()) {

        console.log("About to update")
        updateSearchParams({
          [grouping as string]: allButThisAgg,
        });
      } else if (aggValues?.includeMissingFields == false &&aggValues.values?.length == 0) {
        console.log("About to update")
        updateSearchParams({
          [grouping as string]: allButThisAgg,
        });
      } else {
        let newInput = {
          field:aggValues?.field,
          values:aggValues?.values,
          gte:aggValues?.gte || null,
          lte:aggValues?.lte || null,
          includeMissingFields:aggValues?.includeMissingFields || null,
          zipcode:aggValues?.zipcode || null,
          radius:aggValues?.radius || null,
          lat:aggValues?.lat || null,
          long:aggValues?.long || null
        }      
        console.log("About to update")
        updateSearchParams({
          [grouping]: [...allButThisAgg, newInput],
        });
      }
    }
  //   console.log(grouping)
  //  console.log( searchParams )
  //  console.log( searchParams[grouping] )
    
  //  let newInput = {
  //   field:aggValues?.field,
  //   values:aggValues?.values,
  //   gte:aggValues?.gte || null,
  //   lte:aggValues?.lte || null,
  //   includeMissingFields:aggValues?.includeMissingFields || null,
  //   zipcode:aggValues?.zipcode || null,
  //   radius:aggValues?.radius || null,
  //   lat:aggValues?.lat || null,
  //   long:aggValues?.long || null
  // }      
  // console.log(newInput)
  // console.log("About to update")
  // updateSearchParams({
  //   [grouping]: [... searchParams.aggFilters, newInput],
  // });
    }
    
    const hasNoFilters=()=> {
      for (let field of ACCEPTED_FIELDS) {
        if (isEmpty(aggValues?.[field])) {
          continue;
        }
        if (isNil(aggValues?.[field])) {
          continue;
        }
        return false;
      }
      return true;
    }
    const addFilter =(value: string)=> {
      if (aggValues) {
        console.log("addFilter", aggValues)
        aggValues.values = aggValues?.values
          ? [...aggValues.values, value]
          : [value];
        onUpdateFilter();
      }
    }
  
    const removeFilter =(value: string)=> {
      console.log('renmove filter', aggValues)
      if (aggValues) {
        // aggValues.values = aggValues.values
        //    aggValues.values;
      aggValues.values =aggValues.values
        ? filter(x => x !== value,aggValues.values)
        :aggValues.values;
        onUpdateFilter();
      }
    }
  
    const isSelected=(key: string)=> {
      console.log("PARAMS",searchParams)
      console.log(searchParams['aggFilters'])


    console.log("ValueCity",aggValues)
      if (aggValues === undefined) {
        return false;
      }
      return contains(key as string, aggValues.values as Array<string>);
    }
  
    const toggleFilter=(key: string)=> {
      console.log("Kay",key)

      isSelected(key) ? removeFilter(key) : addFilter(key);
    }

    const handleCheckboxToggle=(bucketKey, activeOptions)=>{
      //@ts-ignore
      //need to handle the single select functionality
      if(currentAgg.display == "DROP_DOWN" || currentAgg.display == "DROP_DOWN"){
        activeOptions.forEach(o => {
          // updater &&     updater.removeFilter(o.key);
          console.log("Need to hit updater",o)
        })
      }
      //Need to handle mutliselect functionality
      // console.log(updater)

      // updater &&  updater.toggleFilter(bucketKey);
      console.log("Need to hit updater", bucketKey)
      toggleFilter(bucketKey)

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
      aggOptionsFilter: aggFilter,
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
  const transformFilters = (
    filters: AggFilterInput[]
  ): { [key: string]: Set<string> } => {
    return pipe(
      groupBy<AggFilterInput>(prop('field')),
      map(head),
      map(propOr([], 'values')),
      map(arr => new Set(arr))
    )(filters) as { [key: string]: Set<string> };
  };
  const filters = transformFilters(searchParams['aggFilters'])
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
  return (
    <>
      <div>
        Im an agg Island @ hash {hash} and ID: {aggId}
      </div>

      <CustomDropDown
        buckets={buckets || []}
        isPresearch={true}
        selectedKeys={filters[currentAgg.name]}
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