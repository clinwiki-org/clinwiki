import * as React from 'react';
import LoadingPane from 'components/LoadingPane';
import { Helmet } from 'react-helmet';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import ReactTable from 'react-table';
import ReactStars from 'react-stars';
import styled from 'styled-components';
import 'react-table/react-table.css';
import SearchFieldName from 'components/SearchFieldName';
import Aggs from './components/Aggs';
import CrumbsBar from './components/CrumbsBar';
import SaveFeed from './components/SaveFeed';
import { pathOr, path } from 'ramda';
import * as _ from 'lodash';
import { AggItem, AggFilterMap, AggCallback, SearchParams, SortItem, AggKind } from './Types';

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

interface AggProps {
  aggs: AggItem[];
  crowdAggs: AggItem[];
  searchParams: SearchParams;
  aggFilters: AggFilterMap;
  crowdAggFilters: AggFilterMap;
  addFilter: AggCallback;
  removeFilter: AggCallback;
}
interface GridProps {
  columns: string[];
  rows: any;
  page: number;
  pageSize: number;
  recordsTotal?: number;
  sorts : SortItem[];
  update?: { page: (p: number) => void, pageSize, sort };
}
interface SearchViewProps {
  loading: boolean;
  history?: any;
  aggProps? : AggProps;
  gridProps : GridProps;
  addSearchTerm? : (term:string) => void;
  removeSearchTerm? : (term:string) => void;
}

interface SearchViewState {
  opened: string | null;
  openedKind: AggKind | null;
}

export class SearchView extends React.Component<SearchViewProps, SearchViewState> {
  state = { opened: null, openedKind: null };

  handleOpen = (agg: string, aggKind: AggKind) => {
    const opened = (agg === this.state.opened) && (aggKind === this.state.openedKind) ?
      null :
      agg;
    const openedKind = opened ? aggKind : null;
    this.setState({ opened, openedKind });
  }

  handleCrumbsRemoveFilter = (aggName:string, key:string, isCrowd?:boolean) => {
    this.setState({ opened: null, openedKind: null });
    this.props.aggProps && this.props.aggProps.removeFilter(aggName, key, isCrowd);
  }

  constructor(props) {
    super(props);
  }

  columnName = (name: string): string => {
    const mapping = {
      nctId: 'nct_id',
      briefTitle: 'title',
      averageRating: 'overall rating',
      overallStatus: 'status',
      completionDate: 'completed',
      startDate: 'started',
    };
    return mapping[name];
  }

  getColumns(cols) {
    return cols.map((col) => {
      const spec = {
        Header: <SearchFieldName field={this.columnName(col)} />,
        accessor: col,
        style: {
          overflowWrap: 'break-word',
          overflow: 'visible',
          whiteSpace: 'normal',
          textAlign: null as (null | string),
        },
        Cell: null as any,
      };
      if (col.match('averageRating')) {
        spec.Cell = row => (
          <ReactStars
            count={5}
            edit={false}
            value={Number(row.value)}
          />);
        spec.style.textAlign = 'center';
      }
      return spec;
    });
  }

  getDefaultSorted(columns) {
    if (_.includes(columns, 'averageRating')) {
      return [{ id: 'averageRating', desc: true }];
    }
    return [];
  }

  tdProps = (_, rowInfo) => {
    return {
      onClick: (_, handleOriginal) => {
        this.props.history.push(`/search/study/${rowInfo.row.nctId}`);
        return handleOriginal();
      },
    };
  }

  render_aggs({
    aggs = null,
    crowdAggs = null,
    aggFilters = null,
    crowdAggFilters = null,
    addFilter = null,
    removeFilter = null,
    searchParams = null,
  }) {
    if (!searchParams) return null;
    // fold the raw aggs (from grahql) into a map
    const reducer = (acc, agg) => {
      acc[agg.name] = agg.buckets;
      return acc;
    };
    // @ts-ignore
    const faggs = aggs && aggs.reduce(reducer, {});
    // @ts-ignore
    const fcrowdAggs = crowdAggs && crowdAggs.reduce(
      (acc, agg) => {
        acc[agg.key] = [];
        return acc;
      },
      {},
    );

    return <Aggs
            aggs={faggs || {}}
            crowdAggs={fcrowdAggs || {}}
            filters={aggFilters || {}}
            crowdFilters={crowdAggFilters || {}}
            addFilter={addFilter}
            removeFilter={removeFilter}
            // @ts-ignore
            searchParams={searchParams}
            opened={this.state.opened}
            openedKind={this.state.openedKind}
            onOpen={this.handleOpen}
            />;
  }

  render_table(loading, props : GridProps) {
    if (loading) {
      return (
        <ReactTable
          className="-striped -highlight"
          columns={this.getColumns(props.columns)}
          manual
          loading={true}
          defaultSortDesc
        />
      );
    }
    const columns = props.columns;
    const totalPages = Math.ceil((props.recordsTotal || 0) / props.pageSize);
    let sorts = props.sorts;
    if (!sorts || sorts.length === 0) sorts = this.getDefaultSorted(columns);

    const onPageChange = path(['update', 'page'], props);
    const onPageSizeChange = path(['update', 'pageSize'], props);
    const onSortedChange = path(['update', 'sort'], props);
    return <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(columns)}
            manual
            page={props.page}
            pageSize={props.pageSize}
            sorted={props.sorts}
            // state.sorted= [0: {id: "average rating", desc: true} ]
            // onFetchData={props.handleGridUpdate}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onSortedChange={onSortedChange}
            data={props.rows}
            pages={totalPages}
            loading={loading}
            defaultPageSize={props.pageSize}
            getTdProps={this.tdProps}
            defaultSortDesc
          />;
  }

  render() {
    let pagesTotal = 0;
    if (this.props.gridProps.recordsTotal && this.props.gridProps.pageSize) {
      pagesTotal = Math.ceil(this.props.gridProps.recordsTotal / this.props.gridProps.pageSize);
    }
    return <SearchWrapper>
    <Helmet>
      <title>Search</title>
      <meta name="description" content="Description of SearchPage" />
    </Helmet>
      <Row>
        <Col md={2} id="search-sidebar">
          {
            // @ts-ignore
            this.render_aggs(this.props.aggProps || {})
          }
          <SaveFeed
            searchParams={pathOr({}, ['aggProps', 'searchParams'], this.props) as SearchParams}
            history={this.props.history}
          />
        </Col>
        <Col md={10} id="search-main">
          <Grid>
            <Row>
              <Col md={12}>
                { this.props.loading ? null :
                  // @ts-ignore
                  <CrumbsBar
                    {...this.props.aggProps}
                    removeFilter={this.handleCrumbsRemoveFilter}
                    addSearchTerm={this.props.addSearchTerm || (() => {})}
                    removeSearchTerm={this.props.removeSearchTerm || (() => {})}
                    page={this.props.gridProps.page + 1}
                    pagesTotal={pagesTotal}
                    pageSize={this.props.gridProps.pageSize}
                    update={{
                      page: pathOr(() => {}, ['gridProps', 'update', 'page'], this.props) as any,
                    }}
                    /> }
                { this.render_table(this.props.loading, this.props.gridProps) }
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
    </SearchWrapper>;
  }
}

export default SearchView;
