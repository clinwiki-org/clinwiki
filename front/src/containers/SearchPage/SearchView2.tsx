import * as React from 'react';
import { SearchParams, AggKind } from './shared';
import ReactTable from 'react-table';
import ReactStars from 'react-stars';
import { ThemedButton, ThemedSearchContainer } from 'components/StyledComponents';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';
import { BeatLoader, PulseLoader } from 'react-spinners';
import { Col, ButtonGroup, MenuItem, DropdownButton } from 'react-bootstrap';
import { CardIcon, TableIcon } from './components/Icons';
import { Helmet } from 'react-helmet';
import { SortInput } from 'types/globalTypes';
import { PresentSiteFragment_siteView } from 'types/PresentSiteFragment';
import {
  map,
  pipe,
  pathOr,
  over,
  lensProp,
  fromPairs,
} from 'ramda';
import { camelCase, snakeCase, capitalize } from 'utils/helpers';
import { gql, useQuery } from '@apollo/client';
import {
  SearchPageSearchQuery,
  SearchPageSearchQueryVariables,
  SearchPageSearchQuery_search_studies,
} from 'types/SearchPageSearchQuery';
import { Query, QueryComponentOptions } from '@apollo/client/react/components';
import 'react-table/react-table.css';
import PresentSiteProvider from 'containers/PresentSiteProvider';
import { studyFields, MAX_WINDOW_SIZE } from 'utils/constants';
import Cards from './components/Cards';
import MasonryCards from './components/MasonryCards';
//@ts-ignore
import ListCards from './components/ListCards';
import { SiteViewFragment } from 'types/SiteViewFragment';
import withTheme from 'containers/ThemeProvider';
import TableRV from './components/TableRV';
import {
  AutoSizer,
} from 'react-virtualized';
import aggToField from 'utils/aggs/aggToField';
import useUrlParams from '../../utils/UrlParamsProvider';
import { AggBucketMap } from './Types';

const QUERY = gql`
  query SearchPageSearchQuery(
    $q: SearchQueryInput!
    $page: Int
    $pageSize: Int
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
  ) {
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
      studies {
        ...StudyItemFragment
      }
    }
  }

  fragment StudyItemFragment on ElasticStudy {
    averageRating
    completionDate
    nctId
    overallStatus
    startDate
    briefTitle
    reviewsCount
    interventions
    facilityStates
    interventionsMeshTerms
    studyFirstSubmittedDate
    resultsFirstSubmittedDate
    dispositionFirstSubmittedDate
    lastUpdateSubmittedDate
    studyFirstSubmittedQcDate
    studyFirstPostedDate
    studyFirstPostedDateType
    resultsFirstSubmittedQcDate
    resultsFirstPostedDate
    resultsFirstPostedDateType
    dispositionFirstSubmittedQcDate
    dispositionFirstPostedDate
    dispositionFirstPostedDateType
    lastUpdateSubmittedQcDate
    lastUpdatePostedDate
    lastUpdatePostedDateType
    studyType
    acronym
    baselinePopulation
    officialTitle
    lastKnownStatus
    phase
    enrollment
    enrollmentType
    source
    numberOfArms
    numberOfGroups
    whyStopped
    hasExpandedAccess
    expandedAccessTypeTreatment
    isFdaRegulatedDrug
    isFdaRegulatedDevice
    ipdTimeFrame
    ipdAccessCriteria
    ipdUrl
    planToShareIpd
    planToShareIpdDescription
  }
`;
const QUERY_NO_RESULTS = gql`
  query SearchPageSearchQueryNoResults(
    $q: SearchQueryInput!
    $page: Int
    $pageSize: Int
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
  ) {
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
    }
  }
`;


const COLUMNS = studyFields;
const COLUMN_NAMES = fromPairs(
  // @ts-ignore
  COLUMNS.map(field => [field, field.split('_').map(capitalize).join(' ')])
) as Record<string, string>;

const changePage = (pageNumber: number) => (params: SearchParams) => ({
  ...params,
  page: Math.min(pageNumber, Math.ceil(MAX_WINDOW_SIZE / params.pageSize) - 1),
});
const changePageSize = (pageSize: number) => (params: SearchParams) => ({
  ...params,
  pageSize,
  page: 0,
});

const QueryComponent = (
  props: QueryComponentOptions<
    SearchPageSearchQuery,
    SearchPageSearchQueryVariables
  >
) => Query(props);
const SearchWrapper = styled.div`
  .rt-tr {
    cursor: default;
  }
  #search-sidebar {
    padding-right: 0;
  }
  height: 100%;
`;


interface SearchView2Props {
  onBulkUpdate: (hash: string, siteViewUrl: string) => void;
  onUpdateParams: (updater: (params: SearchParams) => SearchParams) => void;
  onRowClick: (nctId: string, hash: string, siteViewUrl: string) => void;
  searchHash: string;
  searchParams: SearchParams;
  presentSiteView: PresentSiteFragment_siteView;
  theme: any;
}


const MemoizedSearchView = React.memo(function SearchView2(props: SearchView2Props) {

  const changeSorted = (sorts: [SortInput], params: any) => {
    const idSortedLens = lensProp('id');
    const snakeSorts = map(over(idSortedLens, snakeCase), sorts);
    const afterParams = { ...params, sorts: snakeSorts, page: 0 }
    return afterParams;
  };
  const queryString = useUrlParams();
  const params = props.searchParams;
  const renderViewDropdown = () => {
    const { presentSiteView } = props;
    const buttonsArray = presentSiteView.search.results.buttons.items.filter(
      button => button.target.length > 0 && button.icon.length > 0
    );
    if (presentSiteView && buttonsArray.length > 0) {
      return (
        <div style={{ marginLeft: 'auto' }}>
          <ButtonGroup>
            {buttonsArray.map((button, index) => (
              <a
                href={`/search?hash=${props.searchHash}&sv=${button.target}&pv=${queryString.pv}`}
                key={button.target + index}>
                <ThemedButton>
                  {renderViewButton(button.icon)}
                </ThemedButton>
              </a>
            ))}
          </ButtonGroup>
        </div>
      );
    }
    return null;
  };

  const renderViewButton = (icon: string) => {
    switch (icon) {
      case 'card':
        return <CardIcon />;
      case 'table':
        return <TableIcon />;
      case 'search':
        return <FontAwesome name="search" />;
      case 'list':
        return <FontAwesome name="th-list" style={{ fontSize: '1.8rem' }} />;
      case 'small masonry':
        return <FontAwesome name="th" style={{ fontSize: '1.8rem' }} />;
      case 'large masonry':
        return <FontAwesome name="th-large" style={{ fontSize: '1.8rem' }} />;
      case 'object':
        return (
          <FontAwesome name="object-group" style={{ fontSize: '1.8rem' }} />
        );
      case 'newspaper':
        return (
          <FontAwesome name="newspaper-o " style={{ fontSize: '1.8rem' }} />
        );
      default:
        return null;
    }
  };
  const renderHelper = (
    data,
    loading,
    template,
    onPress,
    resultsType,
  ) => {
    switch (resultsType) {
      case 'masonry':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>

            <MasonryCards
              data={data}
              loading={loading}
              template={template}
            // height={height}
            // width={width}
            />

          </div>
        );
      case 'list':
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>
            <AutoSizer>
              {({ height, width }) => (
                <ListCards
                  data={data}
                  loading={loading}
                  template={template}
                  height={height}
                  width={width}
                />
              )}
            </AutoSizer>
          </div>
        );
      case 'table':
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-emd',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>
            <AutoSizer>
              {({ width }) => (
                <TableRV
                  data={data}
                  loading={loading}
                  template={template}
                  width={width}
                  columnFields={props.presentSiteView.search.fields}
                  onRowClick={props.onRowClick}
                />
              )}
            </AutoSizer>
          </div>
        );
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p>  Looks like you have an outdated view style configured.
            Please contact your site administrator.
            </p>
            <p>
              Defaulting to Card View:
             </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              }}>
              {renderViewDropdown()}
              {renderFilterDropDown()}
            </div>
            {/* <AutoSizer>
            {({ height, width }) => ( */}
            <MasonryCards
              data={data}
              loading={loading}
              template={template}
            // height={height}
            // width={width}
            />
            {/* )}
          </AutoSizer> */}
          </div>
        );
    }
  };
  const renderSearch = ({
    data,
    loading,
    error,
  }: {
    data: SearchPageSearchQuery | undefined;
    loading: boolean;
    error: any;
  }) => {
    const { presentSiteView } = props;
    console.log('FROM SEARCH PAGE QUERY', data)
    const showResults = presentSiteView.search.config.fields.showResults;
    let searchData = data?.search?.studies || [];
    const resultsType = presentSiteView.search.results.type;
    if (error) {
      return <div>{error.message}</div>;
    }
    if (!data) {
      console.log('NO DATA FOOL')
      return <BeatLoader />
    }
    return showResults ? (
      renderHelper(
        searchData,
        loading,
        presentSiteView.search.template,
        cardPressed,
        resultsType,
      )
    ) : (
        <div style={{ marginLeft: 'auto', display: 'flex', height: '100%' }}>
          {renderViewDropdown()}
        </div>
      );
  };
  const cardPressed = card => {
    props.onRowClick(
      card.nctId,
      props.searchHash,
      props.presentSiteView.url || 'default'
    );
  };


  const sortHelper = (sorts) => {
    const newParams = () => changeSorted(sorts, params)
    console.log("NOP", newParams())
    props.onUpdateParams(newParams());
  };
  const reverseSort = () => {
    let desc = params.sorts[0].desc;
    let newSort: [SortInput] = [
      { id: params.sorts[0].id, desc: !desc },
    ];
    const newParams = () => changeSorted(newSort, params)
    console.log("Reverse", newParams())
    props.onUpdateParams(newParams());
  };
  const renderSortIcons = () => {
    let isDesc = params.sorts[0].desc;
    return (
      <div
        onClick={() => reverseSort()}
        style={{ display: 'flex', cursor: 'pointer' }}>
        {isDesc ? (
          <FontAwesome
            name={'sort-amount-desc'}
            style={{ color: props.theme.button, fontSize: '26px' }}
          />
        ) : (
            <FontAwesome
              name={'sort-amount-asc'}
              style={{ color: props.theme.button, fontSize: '26px' }}
            />
          )}
      </div>
    );
  };
  const renderFilterDropDown = () => {
    const sortField = () => {
      if (params.sorts.length > 0) {
        return aggToField(
          params.sorts[0].id,
          params.sorts[0].id
        );
      }
      return ' ';
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto' }}>
        <div style={{ display: 'flex' }}>
          <DropdownButton
            bsStyle="default"
            title={`Sort by: ${sortField()}`}
            key="default"
            id="dropdown-basic-default"
            style={{
              width: '200px',
              background: props.theme.button,
            }}>
            {props.presentSiteView.search.sortables.map((field, index) => {
              let sorts = [{ id: field, desc: false }];
              return (
                <MenuItem
                  key={field + index}
                  name={field}
                  onClick={() => sortHelper(sorts)}>
                  {aggToField(field, field)}
                </MenuItem>
              );
            })}
          </DropdownButton>
          {sortField() !== ' ' ? renderSortIcons() : null}
        </div>
      </div>
    );
  };

  const { presentSiteView } = props;
  console.log("MemoizedView Params", params)
  const result = useQuery(presentSiteView.search.config.fields.showResults ? QUERY : QUERY_NO_RESULTS, {
    variables: params,
  }
  )
  const { data, loading, error } = result;

  return (
    <SearchWrapper>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of SearchPage" />
      </Helmet>
      {/* <Col md={12}> */}
      <div style={{ height: '100%' }}>
        <ThemedSearchContainer>
          {renderSearch({ data, loading, error })}
        </ThemedSearchContainer>
      </div>
      {/* </Col> */}
    </SearchWrapper>
  );
})

export default withTheme(MemoizedSearchView);
