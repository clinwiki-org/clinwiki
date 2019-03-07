import * as React from 'react';
import { SearchParams, AggKind } from './shared';
import ReactTable from 'react-table';
import ReactStars from 'react-stars';
import SearchFieldName from 'components/SearchFieldName';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { SortInput, AggFilterInput } from 'types/globalTypes';
import {
  map, pipe, path, pathOr, groupBy, prop, head, propOr, lensPath, over,
  reject, propEq, findIndex, view, remove, isEmpty,
} from 'ramda';
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

const QUERY = gql`
  query SearchPageSearchQuery(
    $q: String,
    $page:Int,
    $pageSize:Int,
    $sorts:[SortInput!],
    $aggFilters:[AggFilterInput!],
    $crowdAggFilters:[AggFilterInput!]
  ) {
    crowdAggs: aggBuckets(
      params: {
        q: $q,
        page: $page,
        pageSize: $pageSize,
        sorts: $sorts,
        aggFilters:$aggFilters,
        agg: "front_matter_keys"}) {
      aggs {
          buckets {
              key
              docCount
          }
      }
    }
    search (
      params:
        { q: $q,
          page: $page,
          pageSize: $pageSize,
          sorts: $sorts,
          aggFilters:$aggFilters,
          crowdAggFilters:$crowdAggFilters }) {
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
  }
`;

const COLUMNS = ['nctId', 'averageRating', 'briefTitle',
  'overallStatus', 'startDate', 'completionDate'];
const COLUMN_NAMES = {
  nctId: 'nct_id',
  briefTitle: 'title',
  averageRating: 'overall rating',
  overallStatus: 'status',
  completionDate: 'completed',
  startDate: 'started',
};

const changePage =
  (pageNumber: number) => (params: SearchParams) => ({ ...params, page: pageNumber });
const changePageSize =
  (pageSize: number) => (params: SearchParams) => ({ ...params, pageSize, page: 0 });
const changeSorted =
  (sorts: [SortInput]) => (params: SearchParams) => ({ ...params, sorts });
const changeFilter =
  (add: boolean) => (aggName:string, key:string, isCrowd?:boolean) => (params: SearchParams) => {
    const propName = isCrowd ? 'crowdAggFilters' : 'aggFilters';
    const lens = lensPath([propName]);
    return over(
      lens,
      (aggs: AggFilterInput[]) => {
        const index = findIndex(propEq('field', aggName), aggs);
        if ((index === -1) && add) {
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
      params,
    );
  };
const addFilter = changeFilter(true);
const removeFilter = changeFilter(false);
const addSearchTerm =
  (term: string) => (params: SearchParams) => ({ ...params, q: term });
const removeSearchTerm =
  (term: string) => (params: SearchParams) => ({ ...params, q: '*' });

class QueryComponent extends Query<SearchPageSearchQuery, SearchPageSearchQueryVariables> {}

const SearchWrapper = styled.div`
  .rt-tr {
    cursor: pointer;
  }
  #search-sidebar{
    padding-right: 0;
  }
  #search-main {
    padding-left: 0;
    padding-top: 6px;
  }
`;

interface SearchViewProps {
  params: SearchParams;
  onUpdateParams: (updater: (params: SearchParams) => SearchParams) => void;
  onRowClick: (nctId: string) => void;
  onOpenAgg: (name: string, kind: AggKind) => void;
  openedAgg: { name: string, kind: AggKind } | null;
}

class SearchView extends React.PureComponent<SearchViewProps> {
  isStarColumn = (name: string): boolean => {
    return name === 'averageRating';
  }

  rowProps = (_, rowInfo) => {
    return {
      onClick: (_, handleOriginal) => {
        this.props.onRowClick(rowInfo.row.nctId);
        return handleOriginal();
      },
    };
  }

  renderColumn = (name: string) => {
    return {
      Header: <SearchFieldName field={COLUMN_NAMES[name]} />,
      accessor: name,
      style: {
        overflowWrap: 'break-word',
        overflow: 'visible',
        whiteSpace: 'normal',
        textAlign: this.isStarColumn(name) ? 'center' : null,
      },
      Cell: !this.isStarColumn(name) ? null : row => (
        <ReactStars
          count={5}
          edit={false}
          value={Number(row.value)}
        />
      ),
    };
  }

  transformFilters = (filters: AggFilterInput[]): { [key: string]: Set<string> } => {
    return pipe(
      groupBy(prop('field')),
      map(head),
      map(propOr([], 'values')),
      map(arr => new Set(arr)),
    )(filters) as { [key: string]: Set<string> };
  }

  transformAggs = (
    aggs: SearchPageSearchQuery_search_aggs[],
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    return pipe(
      groupBy(prop('name')),
      map(head),
      map(prop('buckets')),
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
  }

  transformCrowdAggs = (
    aggs: SearchPageSearchQuery_crowdAggs_aggs[],
  ): { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] } => {
    // @ts-ignore
    return pipe(
      head,
      prop('buckets'),
      groupBy(prop('key')),
    )(aggs) as { [key: string]: SearchPageSearchQuery_search_aggs_buckets[] };
  }

  renderSearch = (
    { data, loading, error }:
    { data: SearchPageSearchQuery | undefined,
      loading: boolean,
      error: any,
    },
  ) => {
    const { page, pageSize, sorts } = this.props.params;

    if (loading) {
      return (
        <ReactTable
          className="-striped -highlight"
          columns={map(this.renderColumn, COLUMNS)}
          manual
          loading={true}
          defaultSortDesc
        />
      );
    }
    if (error) {
      return <div>{error.message}</div>;
    }
    if (!data) {
      return null;
    }
    const totalRecords = pathOr(0, ['search', 'recordsTotal'], data) as number;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return (
      <ReactTable
        className="-striped -highlight"
        columns={map(this.renderColumn, COLUMNS)}
        manual
        page={page}
        pageSize={pageSize}
        sorted={sorts}
        onPageChange={pipe(changePage, this.props.onUpdateParams)}
        onPageSizeChange={pipe(changePageSize, this.props.onUpdateParams)}
        onSortedChange={pipe(changeSorted, this.props.onUpdateParams)}
        data={path(['search', 'studies'], data)}
        pages={totalPages}
        loading={loading}
        defaultPageSize={pageSize}
        getTdProps={this.rowProps}
        defaultSortDesc
      />
    );

  }

  renderAggs = (
    { data, loading, error }:
    { data: SearchPageSearchQuery | undefined,
      loading: boolean,
      error: any,
    },
  ) => {
    if (!data) return null;
    if (!data.search) return null;
    const opened = this.props.openedAgg && this.props.openedAgg.name;
    const openedKind = this.props.openedAgg && this.props.openedAgg.kind;
    return (
      <Aggs
        aggs={this.transformAggs(data.search.aggs || [])}
        crowdAggs={this.transformCrowdAggs(data.crowdAggs.aggs || [])}
        filters={this.transformFilters(this.props.params.aggFilters)}
        crowdFilters={this.transformFilters(this.props.params.crowdAggFilters)}
        addFilter={pipe(addFilter, this.props.onUpdateParams)}
        removeFilter={pipe(removeFilter, this.props.onUpdateParams)}
        // @ts-ignore
        searchParams={this.props.params}
        opened={opened}
        openedKind={openedKind}
        onOpen={this.props.onOpenAgg}
      />
    );
  }

  renderCrumbs = (
    { data, loading, error }:
    { data: SearchPageSearchQuery | undefined,
      loading: boolean,
      error: any,
    },
  ) => {
    let pagesTotal = 0;
    if (data && data.search && data.search.recordsTotal && this.props.params.pageSize) {
      pagesTotal = Math.ceil(data.search.recordsTotal / this.props.params.pageSize);
    }

    const q = this.props.params.q === '*' ? [] : [this.props.params.q];

    return (
      <CrumbsBar
        // @ts-ignore
        searchParams={{ ... this.props.params, q }}
        removeFilter={pipe(removeFilter, this.props.onUpdateParams)}
        addSearchTerm={pipe(addSearchTerm, this.props.onUpdateParams)}
        removeSearchTerm={pipe(removeSearchTerm, this.props.onUpdateParams)}
        page={this.props.params.page + 1}
        pagesTotal={pagesTotal}
        pageSize={this.props.params.pageSize}
        update={{
          page: pipe(changePage, this.props.onUpdateParams),
        }}
      />
    );
  }

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
            return (
              <Row>
                <Col md={2} id="search-sidebar">
                  {
                    this.renderAggs({ data, loading, error })
                  }
                </Col>
                <Col md={10} id="search-main">
                  <Grid>
                    <Row>
                      <Col md={12}>
                        {this.renderCrumbs({ data, loading, error })}
                        {this.renderSearch({ data, loading, error })}
                      </Col>
                    </Row>
                  </Grid>
                </Col>
              </Row>
            );
          }}
        </QueryComponent>
      </SearchWrapper>
    );
  }
}

export default SearchView;
