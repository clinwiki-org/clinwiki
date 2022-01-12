import {
  AggBucket,
  defaultPageSize,
  maskAgg
} from '../SearchPage/Types';
import React, { useEffect, useRef, useState } from 'react';
import { SearchParams, SearchQuery } from '../SearchPage/shared';
import {
  contains,
  dissoc,
  filter,
  find,
  findIndex,
  groupBy,
  head,
  isEmpty,
  isNil,
  length,
  lensPath,
  map,
  over,
  pipe,
  prop,
  propEq,
  propOr,
  reject,
  remove,
  reverse,
  sortBy,
  uniq,
  uniqBy,
  view
} from 'ramda';
import { fetchIslandConfig, fetchSearchPageOpenAggBuckets, fetchSearchPageOpenCrowdAggBuckets } from 'services/search/actions'
import { fetchSearchPageAggBuckets, fetchSearchPageCrowdAggBuckets } from 'services/search/actions';
import { toggleAgg, updateBucketsState, updateSearchParamsAction } from 'services/search/actions'
import { useDispatch, useSelector } from 'react-redux';

import { AggFilterInput } from 'types/globalTypes';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { RootState } from 'reducers';
import {
  SearchPageParamsQuery_searchParams,
} from '../../services/search/model/SearchPageParamsQuery';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import { SortInput } from 'types/globalTypes';
import SortKind from 'containers/AggDropDown/SortKind';
import { preselectedFilters } from 'utils/siteViewHelpers';
import { useRouteMatch } from 'react-router-dom';
import useUrlParams from 'utils/UrlParamsProvider';

const DEFAULT_PARAMS: SearchParams = {
  q: { children: [], key: 'AND' },
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: defaultPageSize,
};
interface Props {
  aggId?: string;

}

const IslandAggChild = (props: Props) => {

  const { aggId } = props;
  const dispatch = useDispatch();
  const params = useUrlParams();
  const hash = params.hash
  const PAGE_SIZE = 25;

  const emptySet = new Set();
  const searchParamsCurrent = useRef({
    q: { key: 'AND', children: [] as SearchQuery[] },
    aggFilters: [] as AggFilterInput[],
    crowdAggFilters: [] as AggFilterInput[],
    sorts: [] as SortInput[],
    page: 0,
    pageSize: defaultPageSize

  })
  let getCurrentAgg = () => {

    let jsonConfig = islandConfig
    return aggId && jsonConfig[aggId]

  }



  const [hasMore, setHasMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [removeSelectAll, setRemoveSelectAll] = useState(false);
  const [shouldLoadMore, setLoadMoreResponse] = useState(false);


  const data = useSelector((state: RootState) => state.search.searchResults);
  // const aggsList = useSelector((state : RootState ) => state.search.aggs);
  const aggBuckets = useSelector((state: RootState) => state.search.aggBuckets);
  const aggBucketsFilter = useSelector((state: RootState) => state.search.aggBucketFilter);
  const isFetchingCurrentAggBucket = useSelector((state: RootState) => state.search.aggBucketFilter?.isFetchingCurrentAggBucket);
  const isFetchingAggBuckets = useSelector((state: RootState) => state.search.isFetchingAggBuckets);
  const crowdAggBuckets = useSelector((state: RootState) => state.search.crowdAggBuckets);
  const isFetchingCrowdAggBuckets = useSelector((state: RootState) => state.search.isFetchingCrowdAggBuckets);
  const isFetchingStudy = useSelector((state: RootState) => state.study.isFetchingStudy);
  const isUpdatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const site = useSelector((state: RootState) => state.site.hasuraPresentSiteProvider.sites[0]);
  const searchParams = data?.data?.searchParams.searchParams;
  const paramsUrl = useUrlParams();
  const match = useRouteMatch();

  const presentSiteView = site?.siteView;

  const aggIslandsCurrent = useRef({
    currentAggIsalnds: [] as any[],

  })
  for (const [key, value] of Object.entries(islandConfig)) {
    //@ts-ignore
    if (value.defaultToOpen) {
      aggIslandsCurrent.current.currentAggIsalnds = [...aggIslandsCurrent.current.currentAggIsalnds, key];
    }
  }
  let uniqueAggIds = uniq(aggIslandsCurrent.current.currentAggIsalnds);



  const updateSearchParams = (value) => {

    const currentRams = { ...searchParamsCurrent.current, ...value }
    !isUpdatingParams && dispatch(updateSearchParamsAction(currentRams));
  };
  const updateSearchParams2 = (value) => {

    const currentRams = { ...searchParams, [grouping as string]: value[grouping] }
    !isUpdatingParams && dispatch(updateSearchParamsAction(currentRams));

  };


  // const searchParamsFromQuery = (
  //   params: SearchPageParamsQuery_searchParams | null | undefined,
  //   view: SiteViewFragment
  // ): SearchParams => {
  //   const defaultParams = {
  //     ...DEFAULT_PARAMS,
  //     ...preselectedFilters(view),
  //   };
  //   if (!params) return defaultParams;

  //   const q = params.q
  //     ? params.q
  //     : defaultParams.q;

  //   const aggFilters = map(
  //     dissoc('__typename'),
  //     params.aggFilters || []
  //   ) as AggFilterInput[];
  //   const crowdAggFilters = map(
  //     dissoc('__typename'),
  //     params.crowdAggFilters || []
  //   ) as AggFilterInput[];
  //   const sorts = map(dissoc('__typename'), params.sorts || []) as SortInput[];
  //   return {
  //     aggFilters,
  //     crowdAggFilters,
  //     sorts,
  //     q,
  //     //page and pageSize no longer exists since it was removed from the shortlink hash
  //     //defaulting to page 0 and defaultPageSize(100) to recieve the first 100 results for
  //     page: 0,
  //     pageSize: defaultPageSize,
  //   };
  // };

  // const dataParams = searchParamsFromQuery(
  //   searchParams,
  //   presentSiteView
  // );
  searchParamsCurrent.current = searchParams;
  let currentAgg = getCurrentAgg();
  let grouping = currentAgg?.aggKind == "aggs" ? 'aggFilters' : 'crowdAggFilters';
  let aggValues = find(
    (x) => (x.field == currentAgg?.name),
    searchParams[grouping]
  );

  const desc = currentAgg?.order?.desc
  const sortKind = currentAgg?.order?.sortKind == "count" ? SortKind.Number : SortKind.Alpha
  //helper functions\
  const getFullPagesCount = buckets => Math.floor(length(buckets) / PAGE_SIZE);
  const handleSort = (desc: boolean, sortKindVar: SortKind) => {
    switch (sortKindVar) {
      case SortKind.Alpha:
        return [{ id: 'key', desc: !desc }];
      case SortKind.Number:
        return [{ id: 'count', desc: !desc }];
    }
  };

  const ACCEPTED_FIELDS = ['values', 'gte', 'lte', 'includeMissingFields', 'zipcode', 'radius', 'lat', 'long'];

  const onUpdateFilter = () => {
    const aggSettings = find(
      (x) => x.field == currentAgg.name,
      searchParamsCurrent.current 
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

    if(allButThisAgg.length ==0 && !aggValues.includeMissingFields){
      updateSearchParams({
        [grouping as string]: allButThisAgg,
      });

    }else{
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
      console.log(newInput)
      updateSearchParams({
        [grouping]: [...allButThisAgg, newInput],
      });
    }
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
    if (aggValues && value !== '-99999999999') {
      aggValues.values = aggValues?.values
        ? [...aggValues.values, value]
        : [value];
      onUpdateFilter();
    } else {

      let newInput = {
        field: currentAgg.name,
        values: value!=='-99999999999' ? [value] : [] ,
        gte: aggValues?.gte || null,
        lte: aggValues?.lte || null,
        includeMissingFields: value!=='-99999999999' ? aggValues?.includeMissingFields || null : true,
        zipcode: aggValues?.zipcode || null,
        radius: aggValues?.radius || null,
        lat: aggValues?.lat || null,
        long: aggValues?.long || null
      }
      return updateSearchParams2({
        [grouping as string]: [...searchParams[grouping], newInput],
      });
    }



    updateSearchParams2({
      [grouping as string]: [...searchParams[grouping]],
    });
  }

  const removeFilter = (value: string) => {
    if (aggValues.values) {

  aggValues.values = filter(x => x !== value, aggValues.values)
      if (aggValues.values.length > 0) {

        updateSearchParams2({
          [grouping as string]: aggValues,
        });
      } else {
        onUpdateFilter();
      }
    } else {
      aggValues.values = []
      onUpdateFilter();

    }
  }

  const isSelected = (key: string) => {


    if (aggValues === undefined) {
      return false;
    }
    if(key=="-99999999999"){
      return {...aggValues, includeMissingFields: false}
    }else{
      return contains(key as string, aggValues.values as Array<string>);
    }
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
  const buckets = aggBuckets?.aggs[aggId!] || []
  const handleLoadMore = (e) => {


    let aggSort = handleSort(desc, sortKind);
    console.log("IN HLM", currentAgg.name)
    const variables = {
      ...searchParams,
      url: paramsUrl.sv,
      configType: 'presearch',
      returnAll: false,
      agg: currentAgg.aggKind == "crowdAggs" ? `fm_${currentAgg.name}` : currentAgg.name,
      pageSize: PAGE_SIZE,
      page: getFullPagesCount(buckets) + 1,
      aggOptionsFilter: props.aggId && aggBucketsFilter && aggBucketsFilter[props.aggId] && aggBucketsFilter[props.aggId].bucketFilter || "",
      aggOptionsSort: [{ id: sortKind == 1 ? "count" : "key", desc: desc }],
      q: searchParams.q,
      aggBucketsWanted: currentAgg.visibleOptions,
    };
    dispatch(fetchSearchPageAggBuckets(variables, props.aggId));
  }

  const handleLoadMoreResponse = () => {
    let aggName = currentAgg!.name
    // let responseBuckets = currentAgg.aggKind == "crowdAggs" && aggId ?  crowdAggBuckets?.aggs[aggId!] :  aggBuckets?.aggs[aggId!];
    let newBuckets = pipe(
      uniqBy<AggBucket>(prop('key')),
      sortBy<AggBucket>(prop('key')),
      reverse
    )(buckets);

    if (!desc && sortKind === SortKind.Alpha) {
      newBuckets = pipe(
        uniqBy<AggBucket>(prop('key')),
        sortBy(prop('key')),
      )(buckets) as AggBucket[];
    }
    if (desc && sortKind === SortKind.Number) {
      newBuckets = pipe(
        uniqBy(prop('key')),
        sortBy<AggBucket>(prop('docCount')),
        reverse
      )(buckets) as AggBucket[];
    }
    if (!desc && sortKind === SortKind.Number) {
      newBuckets = pipe(
        uniqBy(prop('key')),
        sortBy<AggBucket>(prop('docCount')),
      )(buckets) as AggBucket[];
    }
    // newBuckets && setBuckets(newBuckets);
    // updateSearchPageAggs(newBuckets)
    //This hasMore logic may need some work
    let modValue = buckets.length % PAGE_SIZE //length(newBuckets) >=25 && length(buckets) >=25 ?  true : length(buckets) !== length(newBuckets)  ;
    const hasMore = modValue == 0
    // OLD CHECK:   const hasMore = length(buckets) !== length(newBuckets);
    setHasMore(hasMore);
  };


  useEffect(() => {

    aggBuckets && handleLoadMoreResponse()
  }, [aggBuckets, aggId]);

  const toggleAlphaSort = () => {
    aggId && dispatch(updateBucketsState(aggId, {
      bucketFilter: aggBucketsFilter && aggBucketsFilter[aggId] && aggBucketsFilter[aggId].bucketFilter && aggBucketsFilter.isFetchingCurrentAggBucket || "",
      sortKind: SortKind.Alpha,
      desc: !desc

    }));
    // setBuckets([]);
    setHasMore(true);
  }
  const toggleNumericSort = () => {
    // console.log("IN TOGGLE")
    aggId && dispatch(updateBucketsState(aggId, {
      bucketFilter: aggBucketsFilter && aggBucketsFilter[aggId] && aggBucketsFilter[aggId].bucketFilter && aggBucketsFilter.isFetchingCurrentAggBucket || "",
      sortKind: SortKind.Number,
      desc: !desc

    }));
    // setBuckets([]);
    setHasMore(true);
  }
  const handleFilterChange = (value: string) => {
    aggId && dispatch(updateBucketsState(aggId, {
      bucketFilter: value,
      sortKind: sortKind,
      desc

    }));
    // setBuckets([]);
    setHasMore(true);
    // handleLoadMore();
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

  const newChangeFilter = (add: boolean) => (
    aggName: string,
    key: string,
    isCrowd?: boolean
  ) => (params: SearchParams) => {


    const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
    const lens = lensPath([propName]);
    return (over(
      lens,
      (aggs: AggFilterInput[]) => {
        const index = findIndex(propEq('field', aggName), aggs);
        if (index === -1 && add) {
          return [...aggs, { field: aggName, values: [key] }];
        }
        const aggLens = lensPath([index, 'values']);
        const updater = (values: string[]) => (
          add ? [...values, key] : reject(x => x === key, values))
        let res = over(aggLens, updater, aggs);
        // Drop filter if no values left
        if (isEmpty(view(aggLens, res))) {
          res = remove(index, 1, res as any);
        }
        return res;
      },
      {
        ...params,
        page: 0,
      }
    ) as unknown) as SearchParams;
  };

  const newAddFilter = newChangeFilter(true);
  const newRemoveFilter = newChangeFilter(false);

  const newAddFilters = async (aggName: string, keys: string[], isCrowd?: boolean) => {
    searchParamsCurrent.current = searchParams;

    keys.forEach(k => {
      if (isSelected(k)) {
        return searchParamsCurrent.current
      }
      return searchParamsCurrent.current = newAddFilter(aggName, k, isCrowd)(searchParamsCurrent.current);
    });

    updateSearchParams2(searchParamsCurrent.current)
    return searchParamsCurrent.current;
  };

  const newRemoveFilters = (aggName: string, keys: string[], isCrowd?: boolean) => {
    keys.forEach(k => {
      searchParamsCurrent.current = newRemoveFilter(aggName, k, isCrowd)(searchParamsCurrent.current);

    });
    newChangeFilter(false);
    updateSearchParams(searchParamsCurrent.current)
    return params;
  };

  const isAllSelected = (): boolean => {
    let i = 0;
    buckets.map(({ key }) => {
      if (isSelected(key)) {
        i++;
      }
    });
    if (buckets.length === i) {
      return true;
    }
    return false;
  };
  const selectAll = (agg: string): void => {
    let newParams: string[] = [];

    buckets.map(({ key }) => {
      newParams.push(key);
    });

    if (isAllSelected() !== true) {
      setCheckboxValue(true)
      newAddFilters(agg, newParams, false)

    } else {
      setCheckboxValue(true)
    }
  };

  const handleContainerToggle = async () => {
    if (aggId) {
      dispatch(toggleAgg(aggId, islandConfig[aggId], searchParams));
      //Need to possibly handle this in the saga instead @TO-DO


      let aggSort = handleSort(desc, sortKind);

      //Might need to manually add some things as the togle happens right before this 

      const variables = {
        ...searchParams,
        url: paramsUrl.sv,
        configType: 'presearch',
        returnAll: false,
        agg: currentAgg.aggKind == "crowdAggs" ? `fm_${currentAgg.name}` : currentAgg.name,
        pageSize: PAGE_SIZE,
        page: getFullPagesCount(buckets) + 1,
        aggOptionsFilter: props.aggId && aggBucketsFilter && aggBucketsFilter[props.aggId] && aggBucketsFilter[props.aggId].bucketFilter || "",
        aggOptionsSort: [{ id: sortKind == 1 ? "count" : "key", desc: desc }],
        q: searchParams.q,
        aggBucketsWanted: currentAgg.visibleOptions,
      };

      let shouldNotDispatch = isFetchingCrowdAggBuckets || isFetchingAggBuckets || isFetchingStudy || isUpdatingParams

      !shouldNotDispatch && dispatch(fetchSearchPageAggBuckets(variables, props.aggId));

    }
  }
  const filters = transformFilters(searchParams[grouping]);
  return (
    <>
      <CustomDropDown
        buckets={buckets || []}
        isPresearch={true}
        selectedKeys={filters[currentAgg!.name] || emptySet}
        field={currentAgg}
        aggId={aggId}
        onContainerToggle={() => handleContainerToggle()}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
        onCheckBoxToggle={handleCheckboxToggle}
        handleSelectAll={() => selectAll(currentAgg!.name)}
        filter={filter}
        desc={!desc}
        sortKind={sortKind}
        selectAll={checkboxValue}
        checkSelect={() => setCheckboxValue(checkboxValue)}
        checkboxValue={checkboxValue}
        removeSelectAll={checkboxValue}
        showLabel={showLabel}
        handleFilterChange={handleFilterChange}
        toggleAlphaSort={toggleAlphaSort}
        toggleNumericSort={toggleNumericSort}
        setShowLabel={showLabel => setShowLabel(showLabel)}
        isOpen={currentAgg.defaultToOpen}
        fromAggField={false}
        allowsMissing={aggValues?.includeMissingFields}
        disabled={isFetchingStudy || isFetchingCurrentAggBucket}
      />
    </>
  );

}
export default React.memo(IslandAggChild);