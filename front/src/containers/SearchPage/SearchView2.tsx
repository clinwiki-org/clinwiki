import * as React from 'react';
import { SearchParams, AggKind } from './shared';
import ReactTable from 'react-table';
import ReactStars from 'react-stars';
import {ThemedButton, ThemedSearchContainer} from 'components/StyledComponents';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';
import { PulseLoader } from 'react-spinners';
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
import { gql } from 'apollo-boost';
import {
  SearchPageSearchQuery,
  SearchPageSearchQueryVariables,
  SearchPageSearchQuery_search_studies,
} from 'types/SearchPageSearchQuery';
import { Query, QueryComponentOptions } from 'react-apollo';
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
const changeSorted = (sorts: [SortInput]) => (params: SearchParams) => {
  const idSortedLens = lensProp('id');
  const snakeSorts = map(over(idSortedLens, snakeCase), sorts);
  return { ...params, sorts: snakeSorts, page: 0 };
};

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
  params: SearchParams;
  onBulkUpdate: (hash: string, siteViewUrl: string) => void;
  onUpdateParams: (updater: (params: SearchParams) => SearchParams) => void;
  onRowClick: (nctId: string, hash: string, siteViewUrl: string) => void;
  searchHash: string;
  searchParams: any;
  presentSiteView: PresentSiteFragment_siteView;
  getTotalResults: Function;
  theme: any;
}

interface SearchView2State {
  totalResults: any;
  prevResults: any | null;
}

class SearchView2 extends React.Component<SearchView2Props, SearchView2State> {

  constructor(props) {
    super(props);

    this.state = {
      totalResults: 0,
      prevResults: null,
    };
  }

  renderViewDropdown = () => {
    const { presentSiteView } = this.props;
    const buttonsArray = presentSiteView.search.results.buttons.items.filter(
      button => button.target.length > 0 && button.icon.length > 0
    );
    const queryString = useUrlParams();
    return (
      <PresentSiteProvider>
        {presentSiteView => {
          if (presentSiteView && buttonsArray.length > 0) {
            return (
              <div style={{ marginLeft: 'auto' }}>
                <ButtonGroup>
                  {buttonsArray.map((button, index) => (
                    <a
                      href={`/search?hash=${this.props.searchHash}&sv=${button.target}&pv=${queryString.pv}`}
                      key={button.target + index}>
                      <ThemedButton>
                        {this.renderViewButton(button.icon)}
                      </ThemedButton>
                    </a>
                  ))}
                </ButtonGroup>
              </div>
            );
          }
          return null;
        }}
      </PresentSiteProvider>
    );
  };
  renderViewButton = (icon: string) => {
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
  renderHelper = (
    data,
    loading,
    template,
    onPress,
    resultsType,
    recordsTotal
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
              {this.renderViewDropdown()}
              {this.renderFilterDropDown()}
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
              {this.renderViewDropdown()}
              {this.renderFilterDropDown()}
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
              {this.renderViewDropdown()}
              {this.renderFilterDropDown()}
            </div>
            <AutoSizer>
              {({ width }) => (
                <TableRV
                  data={data}
                  loading={loading}
                  template={template}
                  width={width}
                  columnFields={this.props.presentSiteView.search.fields}
                  onRowClick={this.props.onRowClick}
                />
              )}
            </AutoSizer>
          </div>
        );
      default:
        return(
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
            {this.renderViewDropdown()}
            {this.renderFilterDropDown()}
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
  renderSearch = ({
    data,
    loading,
    error,
  }: {
    data: SearchPageSearchQuery | undefined;
    loading: boolean;
    error: any;
  }) => {
    const { presentSiteView } = this.props;

    const showResults = presentSiteView.search.config.fields.showResults;
    let searchData = data?.search?.studies || [];
    const resultsType = presentSiteView.search.results.type;
    let recordsTotal = data?.search?.recordsTotal;
    if (error) {
      return <div>{error.message}</div>;
    }
    if (!data) {
      return null;
    }
    const totalRecords = pathOr(0, ['search', 'recordsTotal'], data) as number;

    if (this.state.prevResults !== this.state.totalResults) {
      this.setState(
        prev => {
          return {
            totalResults: totalRecords,
            prevResults: prev.totalResults,
          };
        },
        () => {
          this.props.getTotalResults(this.state.totalResults);
        }
      );
    }

    return showResults ? (
      this.renderHelper(
        searchData,
        loading,
        presentSiteView.search.template,
        this.cardPressed,
        resultsType,
        recordsTotal
      )
    ) : (
      <div style={{ marginLeft: 'auto', display: 'flex', height: '100%' }}>
        {this.renderViewDropdown()}
      </div>
    );
  };
  cardPressed = card => {
    this.props.onRowClick(
      card.nctId,
      this.props.searchHash,
      this.props.presentSiteView.url || 'default'
    );
  };


  sortHelper = (sorts, params) => {
    this.props.onUpdateParams(changeSorted(sorts));
  };
  reverseSort = () => {
    let desc = this.props.params.sorts[0].desc;
    let newSort: [SortInput] = [
      { id: this.props.params.sorts[0].id, desc: !desc },
    ];
    this.props.onUpdateParams(changeSorted(newSort));
  };
  sortDesc = () => {
    if (this.props.params.sorts.length > 0) {
      return this.props.params.sorts[0].desc;
    }
    return ' ';
  };
  renderSortIcons = () => {
    let isDesc = this.props.params.sorts[0].desc;
    return (
      <div
        onClick={() => this.reverseSort()}
        style={{ display: 'flex', cursor: 'pointer' }}>
        {isDesc ? (
          <FontAwesome
            name={'sort-amount-desc'}
            style={{ color: this.props.theme.button, fontSize: '26px' }}
          />
        ) : (
          <FontAwesome
            name={'sort-amount-asc'}
            style={{ color: this.props.theme.button, fontSize: '26px' }}
          />
        )}
      </div>
    );
  };
  renderFilterDropDown = () => {
    const sortField = () => {
      if (this.props.params.sorts.length > 0) {
        return aggToField(
          this.props.params.sorts[0].id,
          this.props.params.sorts[0].id
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
              background: this.props.theme.button,
            }}>
            {this.props.presentSiteView.search.sortables.map((field, index) => {
              let sorts = [{ id: field, desc: false }];
              let params = this.props.params;
              return (
                <MenuItem
                  key={field + index}
                  name={field}
                  onClick={() => this.sortHelper(sorts, params)}>
                  {aggToField(field, field)}
                </MenuItem>
              );
            })}
          </DropdownButton>
          {sortField() !== ' ' ? this.renderSortIcons() : null}
        </div>
      </div>
    );
  };

  render() {
    const { presentSiteView }= this.props
    return (
      <SearchWrapper>
        <Helmet>
          <title>Search</title>
          <meta name="description" content="Description of SearchPage" />
        </Helmet>
        {/* <Col md={12}> */}
        <div style={{height: '100%'}}>
          <QueryComponent
            query={presentSiteView.search.config.fields.showResults ? QUERY : QUERY_NO_RESULTS}
            variables={this.props.params}
            >
            {({ data, loading, error }) => {
              return (
                <ThemedSearchContainer>
                  {this.renderSearch({ data, loading, error })}
                </ThemedSearchContainer>
              );
            }}
          </QueryComponent>
          </div>
        {/* </Col> */}
      </SearchWrapper>
    );
  }
}

export default withTheme(SearchView2);
