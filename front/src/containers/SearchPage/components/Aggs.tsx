import * as React from 'react';
import {
  isEmpty,
  isNil,
  filter,
  prop,
  compose,
  reduce,
  pathOr,
} from 'ramda';
import { Query, QueryComponentOptions } from '@apollo/client/react/components';
import { gql }  from '@apollo/client';
import AggDropDown from 'containers/AggDropDown';
import {
  AggBucketMap,
  AggCallback,
  AggregateAggCallback,
  SearchParamsAsInput,
  AggKind,
  AggFilterMap,
} from '../Types';
import {
  SearchPageAggsQuery,
  SearchPageAggsQueryVariables,
} from 'types/SearchPageAggsQuery';
import { BeatLoader } from 'react-spinners';
import { PresentSiteFragment, PresentSiteFragment_siteView } from 'types/PresentSiteFragment';
import { displayFields } from 'utils/siteViewHelpers';
import styled from 'styled-components';
import AggFilterInputUpdater from './AggFilterInputUpdater';
import AggContext from './AggFilterUpdateContext';
import { withSearchParams } from './SearchParamsContext';
import withTheme from 'containers/ThemeProvider';
import { useQuery } from '@apollo/client';

const QUERY = gql`
  query SearchPageAggsQuery(
    $q: SearchQueryInput!
    $page: Int
    $pageSize: Int
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
  ) {
    crowdAggs: aggBuckets(
      params: {
        q: $q
        page: 0
        pageSize: 100000
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
        agg: "front_matter_keys"
      }
    ) {
      aggs {
        name
      }
    }
    search(
      params: {
        q: $q
        page: $page
        pageSize: $pageSize
        sorts: $sorts
        aggFilters: $aggFilters
        crowdAggFilters: $crowdAggFilters
      }
    ) {
      recordsTotal
      aggs {
        name
      }
    }
  }
`;
const getVisibleOptionsByName: (PresentSiteFragment) => any = compose(
  reduce(
    (byName, { name, visibleOptions }) => ({
      ...byName,
      [name]: visibleOptions.values,
    }),
    {}
  ),

  pathOr([], ['search', 'crowdAggs', 'fields'])
);
const getVisibleOptionsByNamePresearch: (PresentSiteFragment) => any = compose(
  reduce(
    (byName, { name, visibleOptions }) => ({
      ...byName,
      [name]: visibleOptions.values,
    }),
    {}
  ),

  pathOr([], ['search', 'presearch', 'crowdAggs', 'fields'])
);
interface AggsProps {
  key?: any;
  // selected
  filters: AggFilterMap;
  crowdFilters: AggFilterMap;
  addFilter: AggCallback;
  addFilters: AggregateAggCallback;
  removeFilter: AggCallback;
  removeFilters: AggregateAggCallback;
  // searchParams: SearchParamsAsInput;
  opened: string | null;
  openedKind: AggKind | null;
  onOpen: (agg: string, kind: AggKind) => void;
  removeSelectAll?: boolean;
  resetSelectAll?: () => void;
  presearch?: boolean;
  presentSiteView: PresentSiteFragment_siteView;
  preSearchAggs?: string[];
  preSearchCrowdAggs?: string[];
  site: PresentSiteFragment;
  updateSearchParams: any;
  searchParams: any;
  getTotalResults: Function;
}

const PresearchContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    max-height: 1500px;
  }
  span {
    display: contents;
  }
`;

const AggSideBarTitle = styled.h4`
  color: ${props => props.theme.aggSideBar.sideBarTitleFont};
  position: relative;
  left: 20px;
`;
const ThemedAggSideBarTitle = withTheme(AggSideBarTitle);

const QueryComponent = (
  props: QueryComponentOptions<
    SearchPageAggsQuery,
    SearchPageAggsQueryVariables
  >
) => Query(props);

const Aggs = (props: AggsProps) => {
  const getAggs = (siteView: PresentSiteFragment_siteView, presearch): string[] => {
    // to save having to write multiple displayFIelds functions we are splitting the path based on wheter it's presearch or aggs here
    const path = presearch ? siteView.search.presearch.aggs : siteView.search.aggs
    return displayFields(
      path.selected.kind,
      path.selected.values,
      path.fields
    ).map(prop('name'));
  };

  const getCrowdAggs = (crowdAggs: string[], presearch): string[] => {
    const path = presearch ? props.presentSiteView.search.presearch.crowdAggs : props.presentSiteView.search.crowdAggs
    const displayed = displayFields(
      path.selected.kind,
      path.selected.values,
      path.fields
    ).map(prop('name'));
    return filter(x => crowdAggs.includes(x), displayed);
  };

  // shouldComponentUpdate(nextProps) {
  //   console.log('SCU', props.searchParams)
  //   if (props.searchParams === nextProps.searchParams) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  
    const {
      filters,
      crowdFilters,
      addFilter,
      addFilters,
      removeFilter,
      removeFilters,
      searchParams,
      updateSearchParams,
      presearch,
      presentSiteView,
      preSearchAggs,
      preSearchCrowdAggs,
    } = props;
    //commented out because not sure how to pass two parameters when using compose
    // const sortByNameCi = sortBy(compose(toLower, aggToField);

     
    // if (searchParams) {
      // return (
      //   <QueryComponent
      //     query={QUERY}
      //     variables={searchParams}
      //   >
      //     {({ data, loading, error }) => {
        console.log('searchParams from AGGS', searchParams)
      const result = useQuery(QUERY, {
        variables: { ...searchParams }, 
        // onCompleted: () => updateStateFromHash(data.searchParams, presentSiteView)
      });
        let data = result.data
        console.log('results from aggs', result.data)
        if (data == undefined && result.previousData !== undefined ) {data = result.previousData}
        if (result.error || (result.loading && data == undefined)) return <BeatLoader />;
       
            console.log('data from aggs', data)
            if (data && data.crowdAggs && data.search?.aggs) {
              let recordsTotal = data.search?.recordsTotal;
              props.getTotalResults(recordsTotal);
              const aggs: AggBucketMap = {};
              for (const a of data.search?.aggs || []) {
                aggs[a.name] = [];
              }
              const crowdAggs: AggBucketMap = {};
              for (const bucket of data.crowdAggs?.aggs?.[0]?.buckets || []) {
                crowdAggs[bucket.key] = [];
              }
            let crowdAggDropdowns: React.ReactElement<any> | null = null;
            let crowdAggPresearch: React.ReactElement<any> | null = null;
            const emptySet = new Set();

            if (preSearchCrowdAggs && crowdAggs) {
              const visibleOptionsByName = getVisibleOptionsByNamePresearch(
                presentSiteView
              );
              crowdAggPresearch = (
                <span>
                  {getCrowdAggs(Object.keys(crowdAggs), true).map(k =>
                    crowdAggs[k] ? (
                      <AggContext.Provider
                        key={k}
                        value={{
                          updater: new AggFilterInputUpdater(
                            k,
                            searchParams,
                            updateSearchParams,
                            'crowdAggFilters'
                          ),
                        }}>
                        <AggDropDown
                          key={k}
                          agg={k}
                          selectedKeys={crowdFilters[k] || emptySet}
                          buckets={preSearchCrowdAggs[k]}
                          isOpen={true}
                          aggKind="crowdAggs"
                          addFilter={(agg, item) => addFilter(agg, item, true)}
                          addFilters={(agg, items) => addFilters(agg, items, true)}
                          removeFilter={(agg, item) =>
                            removeFilter && removeFilter(agg, item, true)
                          }
                          removeFilters={(agg, items) =>
                            removeFilters(agg, items, true)
                          }
                          searchParams={searchParams}
                          resetSelectAll={props.resetSelectAll}
                          removeSelectAll={props.removeSelectAll}
                          presearch
                          presentSiteView={props.presentSiteView}
                          configType="presearch"
                          visibleOptions={visibleOptionsByName[k]}
                        />
                      </AggContext.Provider>
                    ) : (
                      <div
                        key={k}
                        style={{ display: 'flex', justifyContent: 'center' }}>
                        <BeatLoader key="loader" color="#fff" />
                      </div>
                    )
                  )}
                </span>
              );
            }

            if (presearch && preSearchAggs) {
              console.log('PRESEARCH AGGS')
              return (
                <PresearchContainer>
                  {getAggs(props.presentSiteView, true).map(k =>
                    aggs[k] ? (
                      <AggContext.Provider
                        key={k}
                        value={{
                          updater: new AggFilterInputUpdater(
                            k,
                            searchParams,
                            updateSearchParams,
                            'aggFilters'
                          ),
                        }}>
                        <AggDropDown
                          key={k}
                          agg={k}
                          selectedKeys={filters[k] || emptySet}
                          buckets={aggs[k]}
                          isOpen={true}
                          aggKind="aggs"
                          addFilter={addFilter}
                          addFilters={addFilters}
                          removeFilter={removeFilter}
                          removeFilters={removeFilters}
                          searchParams={searchParams}
                          resetSelectAll={props.resetSelectAll}
                          removeSelectAll={props.removeSelectAll}
                          presearch
                          presentSiteView={props.presentSiteView}
                          configType="presearch"
                        />
                      </AggContext.Provider>
                    ) : (
                      <div
                        key={k}
                        style={{ display: 'flex', justifyContent: 'center' }}>
                        <BeatLoader key="loader" color="#fff" />
                      </div>
                    )
                  )}
                  {crowdAggPresearch}
                </PresearchContainer>
              );
            }

            if (!isEmpty(crowdAggs) && !isNil(crowdAggs)) {
              const visibleOptionsByName = getVisibleOptionsByName(presentSiteView);

              crowdAggDropdowns = (
                <div>
                  <ThemedAggSideBarTitle>Crowd Facets</ThemedAggSideBarTitle>
                  {getCrowdAggs(Object.keys(crowdAggs), false).map(k => (
                    <AggContext.Provider
                      key={k}
                      value={{
                        updater: new AggFilterInputUpdater(
                          k,
                          searchParams,
                          updateSearchParams,
                          'crowdAggFilters'
                        ),
                      }}>
                      <AggDropDown
                        agg={k}
                        removeSelectAll={props.removeSelectAll}
                        selectedKeys={crowdFilters[k] || emptySet}
                        buckets={crowdAggs[k]}
                        isOpen={
                          props.opened === k &&
                          props.openedKind === 'crowdAggs'
                        }
                        onOpen={props.onOpen}
                        aggKind="crowdAggs"
                        addFilter={(agg, item) => addFilter(agg, item, true)}
                        addFilters={(agg, items) => addFilters(agg, items, true)}
                        removeFilter={(agg, item) =>
                          removeFilter && removeFilter(agg, item, true)
                        }
                        removeFilters={(agg, items) => removeFilters(agg, items, true)}
                        searchParams={searchParams}
                        visibleOptions={visibleOptionsByName[k]}
                        presentSiteView={presentSiteView}
                        configType="facetbar"
                      />
                    </AggContext.Provider>
                  ))}
                </div>
              );
            }
            if (!isEmpty(aggs) && !isNil(aggs)) {
              // console.log('plain old facet bar')
              return (
                <div>
                  <div>
                    {getAggs(props.presentSiteView, false).map(k => {
                      return (
                        aggs[k] ? (
                          <AggContext.Provider
                            key={k}
                            value={{
                              updater: new AggFilterInputUpdater(
                                k,
                                searchParams,
                                updateSearchParams,
                                'aggFilters'
                              ),
                            }}>
                            <AggDropDown
                              key={k}
                              agg={k}
                              selectedKeys={filters[k] || emptySet}
                              buckets={aggs[k]}
                              isOpen={
                                props.opened === k &&
                                props.openedKind === 'aggs'
                              }
                              onOpen={props.onOpen}
                              aggKind="aggs"
                              addFilter={addFilter}
                              addFilters={addFilters}
                              removeFilter={removeFilter}
                              removeFilters={removeFilters}
                              searchParams={searchParams}
                              resetSelectAll={props.resetSelectAll}
                              removeSelectAll={props.removeSelectAll}
                              presentSiteView={props.presentSiteView}
                              configType="facetbar"
                            />
                          </AggContext.Provider>
                        ) : null
                      )
                    }
                    )}
                  </div>
                  {crowdAggDropdowns}
                </div>
              );
            }
          }
          return null

  }


export default Aggs;
