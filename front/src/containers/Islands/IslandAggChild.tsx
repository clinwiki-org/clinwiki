import React, { useState, useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router-dom';
import useUrlParams from 'utils/UrlParamsProvider';
import SortKind from 'containers/AggDropDown/SortKind';
import CustomDropDown from 'containers/AggDropDown/CustomDrop';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAgg, updateSearchParamsAction } from 'services/search/actions'
import { RootState } from 'reducers';
import { fetchSearchPageAggBuckets, fetchSearchPageCrowdAggBuckets } from 'services/search/actions';
import { SearchQuery, SearchParams } from '../SearchPage/shared';
import { SortInput } from 'types/globalTypes';
import {
  AggBucket,
  maskAgg,
  defaultPageSize
} from '../SearchPage/Types';

import {
  pipe,
  length,
  prop,
  sortBy,
  uniqBy,
  find,
  reverse,
  contains,
  filter,
  isEmpty,
  isNil,
  map,
  dissoc,
  head,
  propOr,
  groupBy,
  lensPath,
  over,
  findIndex,
  propEq,
  reject,
  view,
  remove,
} from 'ramda';
import { AggFilterInput } from 'types/globalTypes';
import {
  SearchPageParamsQuery_searchParams,
} from '../../services/search/model/SearchPageParamsQuery';
import { SiteViewFragment } from 'services/site/model/SiteViewFragment';
import { preselectedFilters } from 'utils/siteViewHelpers';
import { fetchIslandConfig, fetchSearchPageOpenCrowdAggBuckets, fetchSearchPageOpenAggBuckets } from 'services/search/actions'

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

function IslandAggChild(props: Props) {

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



  const [desc, setDesc] = useState(true);
  const [sortKind, setSortKind] = useState(SortKind.Alpha);
  const [buckets, setBuckets] = useState([]);
  const [aggFilter, setFilter] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [removeSelectAll, setRemoveSelectAll] = useState(false);
  const [shouldLoadMore, setLoadMoreResponse] = useState(false);


  const data = useSelector((state: RootState) => state.search.searchResults);
  // const aggsList = useSelector((state : RootState ) => state.search.aggs);
  const aggBuckets = useSelector((state: RootState) => state.search.aggBuckets);
  const isFetchingAggBuckets = useSelector((state: RootState) => state.search.isFetchingAggBuckets);
  const crowdAggBuckets = useSelector((state: RootState) => state.search.crowdAggBuckets);
  const isFetchingCrowdAggBuckets = useSelector((state: RootState) => state.search.isFetchingCrowdAggBuckets);
  const isUpdatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);
  const site = useSelector((state: RootState) => state.site.hasuraPresentSiteProvider.sites[0]);
  const searchParams = data?.data?.searchParams.searchParams;
  const paramsUrl = useUrlParams();
  const match = useRouteMatch();

  const presentSiteView = site?.siteView;




  const updateSearchParams = (value) => {

    const currentRams = { ...searchParamsCurrent.current, value }
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
  let grouping = currentAgg?.aggKind == "aggs" ? 'aggFilters' : 'crowdAggFilters'
  console.log("YOOO",currentAgg.name);
  console.log("Yo2",searchParams)
  let aggValues = find(
    (x) => (x.field == currentAgg?.name),
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
    } else {

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
      agg: [currentAgg.name],
      pageSize: PAGE_SIZE,
      page: getFullPagesCount(buckets),
      aggOptionsFilter: aggFilter,
      aggOptionsSort: aggSort,
      q: searchParams.q,
      bucketsWanted: [currentAgg.visibleOptions]
    };

    //Come back and rework how we load more individually
    currentAgg.aggKind === "crowdAggs" ? !isFetchingCrowdAggBuckets && dispatch(fetchSearchPageOpenCrowdAggBuckets(variables)) : !isFetchingAggBuckets && dispatch(fetchSearchPageOpenAggBuckets(variables));
    handleLoadMoreResponse();
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
    newBuckets && setBuckets(newBuckets);
    const hasMore = length(buckets) !== length(newBuckets);
    // console.log(hasMore)
    setHasMore(hasMore);
    // console.log(newBuckets)
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

  useEffect(() => {
    handleLoadMoreResponse()
  }, [aggBuckets, crowdAggBuckets]);

  useEffect(() => {
    setSortKind(currentAgg?.order?.sortKind == "count"? SortKind.Alpha:SortKind.Number);
    setDesc(currentAgg?.order?.desc);  
  }, [currentAgg]);

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

  const handleContainerToggle = () => {
    if (aggId) {
      // console.log("AGG", aggId)
      // islandConfig[aggId].defaultToOpen = !islandConfig[aggId].defaultToOpen
      dispatch(toggleAgg(aggId, islandConfig[aggId], searchParams))

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
        onContainerToggle={() => handleContainerToggle()}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
        onCheckBoxToggle={handleCheckboxToggle}
        handleSelectAll={() => selectAll(currentAgg!.name)}
        filter={filter}
        desc={desc}
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
      />
    </>
  );
}
export default IslandAggChild;