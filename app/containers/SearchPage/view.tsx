import * as React from 'react';
import LoadingPane from 'components/LoadingPane';
import { Helmet } from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import ReactTable from 'react-table';
import ReactStars from 'react-stars';
import styled from 'styled-components';
import 'react-table/react-table.css';
import SearchFieldName from 'components/SearchFieldName';
import Aggs from './components/Aggs';
import CrumbsBar from './components/CrumbsBar';
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
  opened: string;
  openedKind: AggKind;
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

  getColumns(cols) {
    return cols.map((col) => {
      const spec = {
        Header: <SearchFieldName field={col} />,
        accessor: col,
        style: {
          overflowWrap: 'break-word',
          overflow: 'visible',
          whiteSpace: 'normal',
          textAlign: null,
        },
        Cell: null,
      };
      if (col.match('rating')) {
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
    if (_.includes(columns, 'average_rating')) {
      return [{ id: 'average_rating', desc: true }];
    }
    return [];
  }

  tdProps = (_, rowInfo) => {
    return {
      onClick: (_, handleOriginal) => {
        this.props.history.push(`/study/${rowInfo.row.nct_id}`);
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
    // fold the raw aggs (from grahql) into a map
    const reducer = (acc, agg) => {
      acc[agg.name] = agg.buckets;
      return acc;
    };
    const faggs = aggs ? aggs.reduce(reducer, {}) : null;
    const fcrowdAggs = crowdAggs ? crowdAggs.reduce(
      (acc, agg) => {
        acc[agg.key] = [];
        return acc;
      },
      {},
    ) : null;

    return <Aggs
            aggs={faggs}
            crowdAggs={fcrowdAggs}
            filters={aggFilters}
            crowdFilters={crowdAggFilters}
            addFilter={addFilter}
            removeFilter={removeFilter}
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
    const totalPages = Math.ceil(props.recordsTotal / props.pageSize);
    let sorts = props.sorts;
    if (!sorts || sorts.length === 0) sorts = this.getDefaultSorted(columns);

    return <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(columns)}
            manual
            page={props.page}
            pageSize={props.pageSize}
            sorted={props.sorts}
            // state.sorted= [0: {id: "average rating", desc: true} ]
            // onFetchData={props.handleGridUpdate}
            onPageChange={props.update.page}
            onPageSizeChange={props.update.pageSize}
            onSortedChange={props.update.sort}
            data={props.rows}
            pages={totalPages}
            loading={loading}
            defaultPageSize={props.pageSize}
            getTdProps={this.tdProps}
            defaultSortDesc
          />;
  }

  render() {
    const pagesTotal = Math.ceil(this.props.gridProps.recordsTotal / this.props.gridProps.pageSize);
    return <SearchWrapper>
    <Helmet>
      <title>Search</title>
      <meta name="description" content="Description of SearchPage" />
    </Helmet>
      <Row>
        <Col md={2} id="search-sidebar">
          { this.render_aggs(this.props.aggProps || {}) }
        </Col>
        <Col md={10} id="search-main">
          <Grid>
            <Row>
              <Col md={12}>
                { this.props.loading ? null :
                  <CrumbsBar
                    {...this.props.aggProps}
                    removeFilter={this.handleCrumbsRemoveFilter}
                    addSearchTerm={this.props.addSearchTerm}
                    removeSearchTerm={this.props.removeSearchTerm}
                    page={this.props.gridProps.page + 1}
                    pagesTotal={pagesTotal}
                    pageSize={this.props.gridProps.pageSize}
                    update={{ page: this.props.gridProps.update.page }}
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
