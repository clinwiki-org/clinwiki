import * as React from 'react';
import { SearchParams, AggKind, SearchQuery } from './shared';
import ReactTable from 'react-table';
import ReactStars from 'react-stars';
import SearchFieldName from 'components/SearchFieldName';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { SortInput, AggFilterInput, SearchQueryInput } from 'types/globalTypes';
import {
  map,
  pipe,
  path,
  pathOr,
  groupBy,
  prop,
  head,
  propOr,
  lensPath,
  over,
  reject,
  propEq,
  findIndex,
  view,
  remove,
  isEmpty,
  lensProp,
  filter,
  equals,
  fromPairs,
} from 'ramda';
import { camelCase, snakeCase, capitalize } from 'utils/helpers';
import { gql } from 'apollo-boost';
import {
  SearchPageSearchQuery,
  SearchPageSearchQueryVariables,
  SearchPageSearchQuery_search_aggs,
  SearchPageSearchQuery_search_aggs_buckets,
  SearchPageSearchQuery_crowdAggs_aggs,
} from 'types/SearchPageSearchQuery';
import { Query } from 'react-apollo';
import 'react-table/react-table.css';
import Aggs from './components/Aggs';
import CrumbsBar from './components/CrumbsBar';
import SiteProvider from 'containers/SiteProvider';
import {studyFields, starColor, MAX_WINDOW_SIZE} from 'utils/constants';
import { StudyPageQuery, StudyPageQueryVariables } from 'types/StudyPageQuery';
import { stringify } from 'querystring';

const QUERY = gql`
  query SearchPageSearchQuery(
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
        buckets {
          key
          docCount
        }
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
        buckets {
          key
          docCount
        }
      }
      studies {
        ...StudyItemFragment
      }
    }
  }

  fragment StudyItemFragment on Study {
    averageRating
    completionDate
    nctId
    overallStatus
    startDate
    briefTitle
    reviewsCount
    nlmDownloadDateDescription
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
    startMonthYear
    startDateType
    verificationMonthYear
    verificationDate
    completionMonthYear
    completionDateType
    primaryCompletionMonthYear
    primaryCompletionDateType
    primaryCompletionDate
    targetDuration
    studyType
    acronym
    baselinePopulation
    officialTitle
    lastKnownStatus
    phase
    enrollment
    enrollmentType
    source
    limitationsAndCaveats
    numberOfArms
    numberOfGroups
    whyStopped
    hasExpandedAccess
    expandedAccessTypeIndividual
    expandedAccessTypeIntermediate
    expandedAccessTypeTreatment
    hasDmc
    isFdaRegulatedDrug
    isFdaRegulatedDevice
    isUnapprovedDevice
    isPpsd
    isUsExport
    biospecRetention
    biospecDescription
    ipdTimeFrame
    ipdAccessCriteria
    ipdUrl
    planToShareIpd
    planToShareIpdDescription
  }
`;

const COLUMNS = studyFields;
const COLUMN_NAMES = fromPairs(
  // @ts-ignore
  COLUMNS.map(field => [
    field,
    field
      .split('_')
      .map(capitalize)
      .join(' '),
  ]),
);

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
  return { ...params, sorts: snakeSorts };
};
const changeFilter = (add: boolean) => (
  aggName: string,
  key: string,
  isCrowd?: boolean,
) => (params: SearchParams) => {
  const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
  const lens = lensPath([propName]);
  return over(
    lens,
    (aggs: AggFilterInput[]) => {
      const index = findIndex(propEq('field', aggName), aggs);
      if (index === -1 && add) {
        return [...aggs, { field: aggName, values: [key] }];
      }
      const aggLens = lensPath([index, 'values']);
      const updater = (values: string[]) =>
        add ? [...values, key] : reject(x => x === key, values);
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
    },
  );
};
const addFilter = changeFilter(true);
const removeFilter = changeFilter(false);
const addSearchTerm = (term: string) => (params: SearchParams) => {
  // have to check for empty string because if you press return two times it ends up putting it in the terms
  if (!term.replace(/\s/g, '').length) {
    return params;
  }
  // recycled code for removing repeated terms. might be a better way but I'm not sure.
  const children = reject(
    propEq('key', term),
    params.q.children || [],
  );
  return {
    ...params,
    q: { ...params.q, children: [...(children || []), { key: term }] },
    page: 0,
  };
};
const removeSearchTerm = (term: string) => (params: SearchParams) => {
  const children = reject(
    propEq('key', term),
    params.q.children || [],
  ) as SearchQuery[];
  return {
    ...params,
    q: { ...params.q, children },
    page: 0,
  };
};

class QueryComponent extends Query<
  SearchPageSearchQuery,
  SearchPageSearchQueryVariables
> {}

const SearchWrapper = styled.div`
  .rt-tr {
    cursor: pointer;
  }
  #search-sidebar {
    padding-right: 0;
  }
`;

interface SearchViewProps {
  params: SearchParams;
  onUpdateParams: (updater: (params: SearchParams) => SearchParams) => void;
  onAggsUpdate: (
    aggs: { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] },
    crowdAggs: { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] },
  ) => void;
  onRowClick: (nctId: string) => void;
  onResetFilters: () => void;
  onOpenAgg: (name: string, kind: AggKind) => void;
  openedAgg: { name: string; kind: AggKind } | null;
}

class SearchView extends React.PureComponent<SearchViewProps> {
  isStarColumn = (name: string): boolean => {
    return name === 'average_rating';
  };

  // this is for the column widths. currently, some tags are making it way too wide
  isStatusColumn = (name: string): boolean => {
    return name === 'overall_status';
  };

  rowProps = (_, rowInfo) => {
    return {
      onClick: (_, handleOriginal) => {
        this.props.onRowClick(rowInfo.row.nctId);
        return handleOriginal();
      },
    };
  };

  renderColumn = (name: string, data) => {
    // INPUT: col name
    // OUTPUT render a react-table column with given header, accessor, style,
    // and value determined by studyfragment of that column.
    // also renders stars
    const camelCaseName = camelCase(name);
    const lowerCaseSpacing = 8;
    const upperCaseSpacing = 10;
    const maxWidth = 400;
    const totalPadding = 17;
    const getColumnWidth = () => {
      if (data.length < 1) {
        return calcWidth(headerName.split('')) + totalPadding;
      }
      let max = headerName;
      for (let i = 0; i < data.length; i += 1) {
        const elem = data[i][camelCaseName];
        if (data[i] !== undefined && elem !== null) {
          const str = elem.toString();
          if (str.length > max.length) {
            max = str;
          }
        }
      }
      const maxArray = max.split('');
      let maxSize = Math.max(calcWidth(maxArray), calcWidth(headerName.split('')) + totalPadding);
      return Math.min(maxWidth, maxSize);
    };

    const calcWidth = array => {
      return array.reduce(((acc, letter) =>
                        letter === letter.toUpperCase() && letter !== ' ' ?
                          acc + upperCaseSpacing : acc + lowerCaseSpacing),
                          0);
    };

    const headerName = COLUMN_NAMES[name];
    return {
      Header: <SearchFieldName field={headerName} />,
      accessor: camelCaseName,
      style: {
        overflowWrap: 'break-word',
        overflow: 'hidden',
        whiteSpace: 'normal',
        textAlign: this.isStarColumn(name) ? 'center' : null,
      },
      Cell: !this.isStarColumn(name)
        ? null
        // the stars and the number of reviews. css in global-styles.ts makes it so they're on one line
        : props => (<div><div id="divsononeline"><ReactStars
          count={5}
          color2={starColor}
          edit={false}
          value={Number(props.original.averageRating)}/></div>
          <div id="divsononeline">
            &nbsp;({props.original.reviewsCount})</div>
          </div>),
       width: getColumnWidth(),

    };
  };

  transformAggs = (
    aggs: SearchPageSearchQuery_search_aggs[],
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    return pipe(
      groupBy(prop('name')),
      map(head),
      map(prop('buckets')),
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
  };

  transformCrowdAggs = (
    aggs: SearchPageSearchQuery_crowdAggs_aggs[],
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    // @ts-ignore
    return pipe(
      head,
      prop('buckets'),
      groupBy(prop('key')),
      map(() => []),
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
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
    const { page, pageSize, sorts } = this.props.params;

    if (loading) {
      return (
        <SiteProvider>
          {site => {
            const columns = map(x => this.renderColumn(x, ''), site.siteView.search.fields);
            const totalWidth = columns.reduce(((acc, col) => acc + col.width), 0);
            const leftover = tableWidth - totalWidth;
            const additionalWidth = leftover / columns.length;
            columns.map(x => x.width += additionalWidth, columns);
            return (
              <ReactTable
                className="-striped -highlight"
                columns={columns}
                manual
                loading={true}
                defaultSortDesc
              />
            );
          }}
        </SiteProvider>
      );
    }
    if (error) {
      return <div>{error.message}</div>;
    }
    if (!data) {
      return null;
    }
    const totalRecords = pathOr(0, ['search', 'recordsTotal'], data) as number;
    const totalPages = Math.min(Math.ceil(totalRecords / this.props.params.pageSize),
                                Math.ceil(MAX_WINDOW_SIZE / this.props.params.pageSize));
    const idSortedLens = lensProp('id');
    const camelizedSorts = map(over(idSortedLens, camelCase), sorts);
    const searchData = path(['search', 'studies'], data);
    const tableWidth = 1175;

    return (
      <SiteProvider>
        {site => {
         const columns = map(x => this.renderColumn(x, searchData), site.siteView.search.fields);
         const totalWidth = columns.reduce(((acc, col)=> acc+col.width), 0);
         const leftover = tableWidth-totalWidth;
         const additionalWidth=leftover/columns.length;
         columns.map(x=>x.width+= additionalWidth, columns);

         return (
           <ReactTable
             className="-striped -highlight"
             columns={columns}
             manual
             minRows={searchData![0] !== undefined ? 1 : 3}
             page={page}
             pageSize={pageSize}
             defaultSorted={camelizedSorts}
             onPageChange={pipe(
               changePage,
               this.props.onUpdateParams,)}
             onPageSizeChange={pipe(
               changePageSize,
               this.props.onUpdateParams,)}
             onSortedChange = {pipe(
               changeSorted,
               this.props.onUpdateParams,)}
             data={searchData}
             pages={totalPages}
             loading={loading}
             defaultPageSize={pageSize}
             getTdProps={this.rowProps}
             defaultSortDesc
             noDataText={'No studies found'}
           />
           );
        }}
      </SiteProvider>
       );
  };


  renderCrumbs = ({
    data,
    loading,
    error,
  }: {
    data: SearchPageSearchQuery | undefined;
    loading: boolean;
    error: any;
  }) => {
    let pagesTotal = 1;
    let recordsTotal = 0;
    if (
      data &&
      data.search &&
      data.search.recordsTotal &&
      this.props.params.pageSize
    ) {
      recordsTotal = data.search.recordsTotal;
      pagesTotal = Math.min(Math.ceil(data.search.recordsTotal / this.props.params.pageSize),
                            Math.ceil(MAX_WINDOW_SIZE / this.props.params.pageSize));
    }

    const q =
      this.props.params.q.key === '*'
        ? []
        : (this.props.params.q.children || []).map(prop('key'));

    return (
      <CrumbsBar
        // @ts-ignore
        searchParams={{ ...this.props.params, q }}
        removeFilter={pipe(
          removeFilter,
          this.props.onUpdateParams,
        )}
        addSearchTerm={pipe(
          addSearchTerm,
          this.props.onUpdateParams,
        )}
        removeSearchTerm={pipe(
          removeSearchTerm,
          this.props.onUpdateParams,
        )}
        page={Math.min(this.props.params.page, pagesTotal)}
        recordsTotal={recordsTotal}
        pagesTotal={pagesTotal}
        pageSize={this.props.params.pageSize}
        update={{
          page: pipe(
            changePage,
            this.props.onUpdateParams,
          ),
        }}
        onReset={this.props.onResetFilters}
        loading={loading}
      />
    );
  };

  render() {
    const { page, pageSize, sorts } = this.props.params;
    return (
      <SearchWrapper>
        <Helmet>
          <title>Search</title>
          <meta name="description" content="Description of SearchPage" />
        </Helmet>
        <QueryComponent query={QUERY} variables={this.props.params}>
          {({ data, loading, error }) => {
            if (data && data.search) {
              this.props.onAggsUpdate(
                this.transformAggs(data.search.aggs || []),
                this.transformCrowdAggs(data.crowdAggs.aggs || []),
              );
            }
            return (
              <Grid>
                <Row>
                  <Col md={12}>
                    {this.renderCrumbs({ data, loading, error })}
                    {this.renderSearch({ data, loading, error })}
                  </Col>
                </Row>
              </Grid>
            );
          }}
        </QueryComponent>
      </SearchWrapper>
    );
  }
}

export default SearchView;