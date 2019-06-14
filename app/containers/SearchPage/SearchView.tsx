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
} from 'ramda';
import { camelCase, snakeCase } from 'utils/helpers';
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

import { StudyPageQuery, StudyPageQueryVariables } from 'types/StudyPageQuery';

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
  }
`;

const COLUMNS = [
  'nctId',
  'averageRating',
  'briefTitle',
  'overallStatus',
  'startDate',
  'completionDate',
];
const COLUMN_NAMES = {
  nctId: 'nct_id',
  briefTitle: 'title',
  averageRating: 'overall rating',
  overallStatus: 'status',
  completionDate: 'completed',
  startDate: 'started',
};

const changePage = (pageNumber: number) => (params: SearchParams) => ({
  ...params,
  page: pageNumber,
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
    params,
  );
};
const addFilter = changeFilter(true);
const removeFilter = changeFilter(false);
const addSearchTerm = (term: string) => (params: SearchParams) => ({
  ...params,
  q: { ...params.q, children: [...(params.q.children || []), { key: term }] },
});
const removeSearchTerm = (term: string) => (params: SearchParams) => {
  const children = reject(
    propEq('key', term),
    params.q.children || [],
  ) as SearchQuery[];
  return { ...params, q: { ...params.q, children } };
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
  onRowClick: (nctId: string, index: number) => void;
  onResetFilters: () => void;
  onOpenAgg: (name: string, kind: AggKind) => void;
  openedAgg: { name: string; kind: AggKind } | null;
}

class SearchView extends React.PureComponent<SearchViewProps> {
  isStarColumn = (name: string): boolean => {
    return name === 'averageRating';
  };

  rowProps = (_, rowInfo) => {
    return {
      onClick: (_, handleOriginal) => {
        this.props.onRowClick(rowInfo.row.nctId,
                              (rowInfo.index + 1) + (this.props.params.page) * (this.props.params.pageSize));
        return handleOriginal();
      },
    };
  };

  renderColumn = (name: string) => {
    // INPUT: col name
    // OUTPUT render a react-table column with given header, accessor, style,
    // and value determined by studyfragment of that column.
    // also renders stars
    return {
      Header: <SearchFieldName field={COLUMN_NAMES[name]} />,
      accessor: name,
      Style: {
        overflow: 'visible',
        whiteSpace: 'normal',
        textAlign: this.isStarColumn(name) ? 'center' : null,
      },
      Cell: !this.isStarColumn(name)
        ? null
        // the stars and the number of reviews. css in global-styles.ts makes it so they're on one line
        // maybe not the base place for that. may be better to move it to this file
        : props => (<div><div id="divsononeline"><ReactStars
          count={5}
          color2={'#7ed964'}
          edit={false}
          value={Number(props.original.averageRating)}/></div>
          <div id="divsononeline">
            &nbsp;({props.original.reviewsCount})</div>
          </div>),
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
    const idSortedLens = lensProp('id');
    const camelizedSorts = map(over(idSortedLens, camelCase), sorts);
    return (
      <ReactTable
        className="-striped -highlight"
        columns={map(this.renderColumn, COLUMNS)}
        manual
        page={page}
        pageSize={pageSize}
        minRows={1} // this is so it truncates the results when there are less than pageSize results on the page
        defaultSorted={camelizedSorts}
        onPageChange={pipe(
          changePage,
          this.props.onUpdateParams,
        )}
        onPageSizeChange={pipe(
          changePageSize,
          this.props.onUpdateParams,
        )}
        onSortedChange={pipe(
          changeSorted,
          this.props.onUpdateParams,
        )}
        data={path(['search', 'studies'], data)}
        pages={totalPages}
        loading={loading}
        defaultPageSize={pageSize}
        getTdProps={this.rowProps}
        defaultSortDesc
      />
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
    let pagesTotal = 0;
    let recordsTotal = 0;
    if (
      data &&
      data.search &&
      data.search.recordsTotal &&
      this.props.params.pageSize
    ) {
      pagesTotal = Math.ceil(
        data.search.recordsTotal / this.props.params.pageSize,
      );
      recordsTotal = data.search.recordsTotal;
      localStorage.setItem('recordsTotal', JSON.stringify(recordsTotal));
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
        page={this.props.params.page}
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
