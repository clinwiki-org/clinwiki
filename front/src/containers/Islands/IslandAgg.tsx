import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import SortKind from 'containers/AggDropDown/SortKind';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchParams, updateSearchParamsAction, fetchFacetConfig } from 'services/search/actions'
import { RootState } from 'reducers';
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
import { AggFilterInput } from 'types/globalTypes';

interface Props {
  aggId?: string;

}

function IslandAgg(props: Props) {
  const { aggId } = props;
  const dispatch = useDispatch();
  const params = useUrlParams();
  const hash = params.hash
  const PAGE_SIZE = 25;

  const emptySet = new Set();

  let getCurrentAgg = () => {

    let jsonConfig = JSON.parse(facetConfig.data.facetConfig.mainConfig)
    return aggId && jsonConfig.default[aggId]

  }



  const [desc, setDesc] = useState(true);
  const [sortKind, setSortKind] = useState(SortKind.Alpha);
  const [buckets, setBuckets] = useState([]);
  const [aggFilter, setFilter] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);


  const data = useSelector((state: RootState) => state.search.searchResults);
  // const aggsList = useSelector((state : RootState ) => state.search.aggs);
  const aggBuckets = useSelector((state: RootState) => state.search.aggBuckets);
  const crowdAggBuckets = useSelector((state: RootState) => state.search.crowdAggBuckets);
  const isUpdatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  const isFetchingFacetConfig = useSelector((state: RootState) => state.search.isFetchingFacetConfig);
  const facetConfig = useSelector((state: RootState) => state.search.facetConfig);
  const searchParams = data?.data?.searchParams;
  const paramsUrl = useUrlParams();
  const match = useRouteMatch();

  useEffect(() => {
    match.path == "/search2/" && dispatch(fetchSearchParams(hash));
  }, [dispatch]);

  useEffect(() => {
    !facetConfig && dispatch(fetchFacetConfig());
  }, [dispatch]);


  const updateSearchParams = (value) => {

    const currentRams = { ...searchParams, value, q: JSON.parse(searchParams.q) }
    !isUpdatingParams && dispatch(updateSearchParamsAction(currentRams));
  };
  const updateSearchParams2 = (value) => {

    const currentRams = { ...searchParams, [grouping as string]: value[grouping], q: JSON.parse(searchParams.q) }
    !isUpdatingParams && dispatch(updateSearchParamsAction(currentRams));

  };
  if (!searchParams || !aggId || !facetConfig) {
    // getCurrentAgg()
    return <BeatLoader />
  }

  let currentAgg = getCurrentAgg();
  let grouping = currentAgg?.aggKind == "aggs" ? 'aggFilters' : 'crowdAggFilters'
  let aggValues = find(
    (x) => (console.log(x), x.field == currentAgg?.name),
    searchParams[grouping]
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
  const ACCEPTED_FIELDS = ['values', 'gte', 'lte', 'includeMissingFields', 'zipcode', 'radius', 'lat', 'long'];

  const onUpdateFilter = () => {

    const aggSettings = find(
      (x) => x.field == currentAgg.name,
      searchParams
    );

    if (searchParams[grouping] && aggSettings) {

      const allButThisAgg = filter(
        (x) => x.field !== currentAgg.name,
        searchParams[grouping] || aggSettings
      );
      if (hasNoFilters()) {

        updateSearchParams({
          [grouping as string]: allButThisAgg,
        });
      } else if (aggValues?.includeMissingFields == false && aggValues.values?.length == 0) {
        updateSearchParams({
          [grouping as string]: allButThisAgg,
        });
      } else {
        let newInput = {
          field: aggValues?.field,
          values: aggValues?.values,
          gte: aggValues?.gte || null,
          lte: aggValues?.lte || null,
          includeMissingFields: aggValues?.includeMissingFields || null,
          zipcode: aggValues?.zipcode || null,
          radius: aggValues?.radius || null,
          lat: aggValues?.lat || null,
          long: aggValues?.long || null
        }
        updateSearchParams({
          [grouping]: [...allButThisAgg, newInput],
        });
      }
    }
    const allButThisAgg = filter(
      (x) => x.field !== currentAgg.name,
      searchParams[grouping] || aggSettings
    );
    updateSearchParams2({
      [grouping as string]: allButThisAgg,
    });
  }

  const hasNoFilters = () => {
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
  const addFilter = (value: string) => {
    if (aggValues) {
      aggValues.values = aggValues?.values
        ? [...aggValues.values, value]
        : [value];
      onUpdateFilter();
    }

    let newInput = {
      field: currentAgg.name,
      values: [value],
      gte: aggValues?.gte || null,
      lte: aggValues?.lte || null,
      includeMissingFields: aggValues?.includeMissingFields || null,
      zipcode: aggValues?.zipcode || null,
      radius: aggValues?.radius || null,
      lat: aggValues?.lat || null,
      long: aggValues?.long || null
    }



    updateSearchParams2({
      [grouping as string]: [...searchParams[grouping], newInput],
    });
  }

  const removeFilter = (value: string) => {
    if (aggValues.values) {

      aggValues.values = filter(x => x !== value, aggValues.values)

      onUpdateFilter();
    } else {
      aggValues.values = []
      onUpdateFilter();

    }
  }

  const isSelected = (key: string) => {


    if (aggValues === undefined) {
      return false;
    }
    return contains(key as string, aggValues.values as Array<string>);
  }

  const toggleFilter = (key: string) => {

    isSelected(key) ? removeFilter(key) : addFilter(key);
  }

  const handleCheckboxToggle = (bucketKey, activeOptions) => {
    //need to handle the single select functionality
    if (currentAgg.display == "DROP_DOWN" || currentAgg.display == "DROP_DOWN") {
      activeOptions.forEach(o => {
        // updater &&     updater.removeFilter(o.key);
      })
    }
    //Need to handle mutliselect functionality
    // updater &&  updater.toggleFilter(bucketKey);
    toggleFilter(bucketKey)

  }

  const handleLoadMore = () => {
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
    currentAgg.aggKind === "crowdAggs" ? !crowdAggBuckets?.aggs[currentAgg.name] && dispatch(fetchSearchPageCrowdAggBuckets(variables)) : !aggBuckets?.aggs[currentAgg.name] && dispatch(fetchSearchPageAggBuckets(variables));
    currentAgg.aggKind === "crowdAggs" ? crowdAggBuckets?.aggs[currentAgg.name] && handleLoadMoreResponse() : aggBuckets?.aggs[currentAgg.name] && handleLoadMoreResponse();
  }

  const handleLoadMoreResponse = () => {

    let aggName = currentAgg!.name
    let responseBuckets = currentAgg.aggKind === "crowdAggs" ? crowdAggBuckets?.aggs[aggName] : aggBuckets?.aggs[aggName]

    let currentBuckets = buckets[0] === undefined ? [] : buckets
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
    newBuckets && setBuckets(newBuckets);
    setHasMore(hasMore);
  };
  const toggleAlphaSort = () => {
    setDesc(!desc);
    setSortKind(SortKind.Alpha);
    setBuckets([]);
    setHasMore(true);
  }
  const toggleNumericSort = () => {
    setDesc(!desc);
    setSortKind(SortKind.Number);
    setBuckets([]);
    setHasMore(true);
  }
  const handleFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
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
  // Believe the following conditionals are deprecated but not certain. Need to check other cases 
  //  if (!crowdAggBuckets && !aggBuckets){
  //    return <BeatLoader/>
  //  }
  // if(currentAgg.aggKind === "crowdAggs" && !crowdAggBuckets){
  //   return <BeatLoader/>
  // }
  // if(!aggBuckets && isOpen){
  //   return <BeatLoader/>
  // }
  const filters = transformFilters(searchParams[grouping])
  return (
    <>
      <CustomDropDown
        buckets={buckets || []}
        isPresearch={true}
        selectedKeys={filters[currentAgg.name] || emptySet}
        field={currentAgg}
        onContainerToggle={() => setIsOpen(!isOpen)}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
        onCheckBoxToggle={handleCheckboxToggle}
        handleSelectAll={() => console.log("something")}
        filter={filter}
        desc={desc}
        sortKind={sortKind}
        selectAll={() => console.log("something")}
        checkSelect={() => console.log("something")}
        checkboxValue={checkboxValue}
        removeSelectAll={() => console.log("HI")}
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