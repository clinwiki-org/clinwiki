import React, { useEffect } from 'react';
import {
  isEmpty,
  isNil,
  filter,
  prop,
  compose,
  reduce,
  pathOr,
} from 'ramda';
import findFields from 'utils/aggs/findFields';
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
import { SearchParams } from '../../../containers/SearchPage/shared';
import {
  SearchPageAggsQuery,
  SearchPageAggsQueryVariables,
} from 'services/search/model/SearchPageAggsQuery';
import { BeatLoader } from 'react-spinners';
import { PresentSiteFragment, PresentSiteFragment_siteView } from 'services/site/model/PresentSiteFragment';
import { displayFields } from 'utils/siteViewHelpers';
import styled from 'styled-components';
import AggFilterInputUpdater from './AggFilterInputUpdater';
import AggContext from './AggFilterUpdateContext';
import { withSearchParams } from './SearchParamsContext';
import withTheme from 'containers/ThemeProvider';
import { useQuery } from '@apollo/client';
import {PresearchContainer, ThemedButton} from '../../../components/StyledComponents';
import { fetchSearchPageAggs } from 'services/search/actions';
import { useDispatch, useSelector } from 'react-redux';
import {RootState} from 'reducers';


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
  updateSearchParams: (params: SearchParams) => void;
  searchParams: SearchParams;
  getTotalResults: Function;
  handlePresearchButtonClick?: Function;
  presearchButtonOptions?: any
}



const AggSideBarTitle = styled.h4`
  color: ${props => props.theme.aggSideBar.sideBarTitleFont};
  position: relative;
  left: 10px;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 1.2em 0;
`;
const ThemedAggSideBarTitle = withTheme(AggSideBarTitle);

const QueryComponent = (
  props: QueryComponentOptions<
    SearchPageAggsQuery,
    SearchPageAggsQueryVariables
  >
) => Query(props);

const Aggs = (props: AggsProps) => {

  const dispatch = useDispatch();
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

// SEARCH_PAGE_AGGS_QUERY
    useEffect(()=>{
      dispatch(fetchSearchPageAggs(searchParams));
    },[dispatch]);
  // const result = useQuery(QUERY, {
  //   variables: { ...searchParams }, 
  // });
  const data = useSelector((state : RootState ) => state.search.aggs);
  const isLoading = useSelector((state : RootState ) => state.search.isFetchingAggs);
  // let data = result.data
  // if (data == undefined && result.previousData !== undefined ) {data = result.previousData}
  // if (result.error || (result.loading && data == undefined)) return <BeatLoader />;
  if(data == undefined) return <BeatLoader/>

  if (data.data && data.data.crowdAggs && data.data.search?.aggs) {
      let recordsTotal = data.data.search?.recordsTotal;
      props.getTotalResults(recordsTotal);
      const aggs: AggBucketMap = {};
      for (const a of data.data.search?.aggs || []) {
        aggs[a.name] = [];
      }
      const crowdAggs: AggBucketMap = {};
      for (const bucket of data.data.crowdAggs?.aggs?.[0]?.buckets || []) {
        crowdAggs[bucket.key] = [];
      }
      let crowdAggDropdowns: React.ReactElement<any> | null = null;
      let crowdAggPresearch: React.ReactElement<any> | null = null;
      let crowdAggPresearchHorizontal: any;
      let crowdAggPresearchVertical: any;
      let aggPresearchHorizontal: any;
      let aggPresearchVertical: any;
      const emptySet = new Set();

    const renderCrowdAggDropDownWContext = (k, preSearchCrowdAggs, visibleOptionsByName) => {
          return (
            crowdAggs[k] ? (
              <AggContext.Provider
                key={`presearch${k}`}
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
                  //presentSiteView={props.presentSiteView}
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
          )
      }

      if (preSearchCrowdAggs && crowdAggs) {
        const visibleOptionsByName = getVisibleOptionsByNamePresearch(
          presentSiteView
        );
        const crowdAggHFields = getCrowdAggs(Object.keys(crowdAggs), true).filter(k => findFields(k, props.presentSiteView, presearch)?.layout == "horizontal" || findFields(k, props.presentSiteView, presearch)?.layout == null)
        const crowdAggVFields = getCrowdAggs(Object.keys(crowdAggs), true).filter(k => findFields(k, props.presentSiteView, presearch)?.layout == "vertical")
        
        crowdAggPresearchHorizontal = crowdAggHFields.map(k => { return (
          renderCrowdAggDropDownWContext(k, preSearchCrowdAggs, visibleOptionsByName)
          ) 
        }) 
        crowdAggPresearchVertical = crowdAggVFields.map(k => { return (
          renderCrowdAggDropDownWContext(k, preSearchCrowdAggs, visibleOptionsByName)
          ) 
        }) 
      }

      const renderAggDropDownWContext = (k) => {
        console.log('render ps dropw')
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
               // presentSiteView={props.presentSiteView}
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
        )
    }

      if (presearch && preSearchAggs) {
        const aggHFields = getAggs(props.presentSiteView, true).filter(k => findFields(k, props.presentSiteView, presearch)?.layout == "horizontal" || findFields(k, props.presentSiteView, presearch)?.layout == null)
        const aggVFields = getAggs(props.presentSiteView, true).filter(k => findFields(k, props.presentSiteView, presearch)?.layout == "vertical")
        {aggPresearchVertical = aggVFields.map(k => { return (
          renderAggDropDownWContext(k)
        )}
      )}
    
      {aggPresearchHorizontal = aggHFields.map(k => { return (
        renderAggDropDownWContext(k)
              )
            }
          )}  
        let showPresearchResults=props.presentSiteView.search.presearch.showResults
        return (
          <PresearchContainer>
            {showPresearchResults ? (
            <div className="presearch-total-results">
                <><b>Total Results:</b> {isLoading? (<span style={{display:'inline-table', width: '5em'}}><BeatLoader/></span>): `${recordsTotal} studies`}</>
            </div>):null}
            <div className="horizontal-pre">
              <div className="horizontal-aggs">
               {aggPresearchHorizontal}
               {crowdAggPresearchHorizontal}
              </div>
              {(aggPresearchHorizontal.length > 0 || crowdAggPresearchHorizontal.length > 0) ? 
              <div className="horizontal-pre-button">
                <ThemedButton 
                  style={{ width: 200 }}
                  onClick={() =>
                    //@ts-ignore
                    props.handlePresearchButtonClick (
                      props.presearchButtonOptions.hash,
                      props.presearchButtonOptions.presearchButton.target,
                      props.presearchButtonOptions.pageViewUrl
                    )
                  }
                >{props.presearchButtonOptions.presearchButton.name}
                </ThemedButton>
              </div>: null }
            </div>
            
            <div className="vertical-pre">
              {crowdAggPresearchVertical}
              {aggPresearchVertical}
              {(aggPresearchVertical.length > 0 || crowdAggPresearchVertical.length > 0) ? 
              <div className="vertical-pre-button">
                <ThemedButton 
                  style={{ width: 200, marginLeft: 13 }}
                  onClick={() =>
                    //@ts-ignore
                    props.handlePresearchButtonClick (
                      props.presearchButtonOptions.hash,
                      props.presearchButtonOptions.presearchButton.target,
                      props.presearchButtonOptions.pageViewUrl
                    )
                  }
                >{props.presearchButtonOptions.presearchButton.name}
                </ThemedButton>
              </div>: null }
            </div>
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
                 // presentSiteView={presentSiteView}
                  configType="facetbar"
                />
              </AggContext.Provider>
            ))}
          </div>
        );
      }
      if (!isEmpty(aggs) && !isNil(aggs)) {
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
                        //presentSiteView={props.presentSiteView}
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




