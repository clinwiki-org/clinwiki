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
import * as _ from 'lodash';
import { AggItem, AggFilterMap, AggCallback, SearchParams } from './Types'

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
  aggs: AggItem[],
  crowdAggs: AggItem[],
  searchParams: SearchParams,
  aggFilters: AggFilterMap,
  crowdAggFilters: AggFilterMap,
  addFilter: AggCallback,
  removeFilter: AggCallback,
}
interface GridProps {
  columns: any
  rows: any
  page: number
  pageSize: number
  recordsTotal?: number
  update?: { page, pageSize, sort }
}
interface SearchViewProps {
  loading: boolean,
  history?: any,
  aggProps? : AggProps
  gridProps : GridProps
}

export class SearchView extends React.PureComponent<SearchViewProps> {
  constructor(props) {
    super(props)
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
          textAlign: null
        },
        Cell: null
      };
      if (col.match('rating')) {
        spec.Cell = (row) => (
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
      onClick: (e, handleOriginal) => {
        this.props.history.push(`/study/${rowInfo.row.nct_id}`);
        return handleOriginal();
      },
    };
  }

  render_aggs({aggs,crowdAggs,aggFilters,crowdAggFilters,addFilter,removeFilter,searchParams}) {
    // fold the raw aggs (from grahql) into a map
    const reducer = (acc,agg) => {
        acc[agg.name] = agg.buckets
        return acc
    }
    const faggs = aggs.reduce(reducer, {});
    const fcrowdAggs = crowdAggs.reduce((acc,agg) => {
        acc[agg.key] = []
        return acc
    }, {});;

    return <Aggs
            aggs={faggs}
            crowdAggs={fcrowdAggs}
            filters={aggFilters}
            crowdFilters={crowdAggFilters}
            addFilter={addFilter}
            removeFilter={removeFilter}
            searchParams={searchParams}
            />
  }

  render_table(loading, props : GridProps) {
    if(loading) {
      return <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(props.columns)}
            manual
            loading={true}
            defaultSorted={this.getDefaultSorted(props.columns)}
            defaultSortDesc
          />
    }
    const columns = props.columns
    const totalPages = Math.ceil(props.recordsTotal / props.pageSize);

    return <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(columns)}
            manual
            page={props.page}
            pageSize={props.pageSize}
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
            defaultSorted={this.getDefaultSorted(columns)}
            defaultSortDesc
          />
  }

  render() {
    return <SearchWrapper>
    <Helmet>
      <title>Search</title>
      <meta name="description" content="Description of SearchPage" />
    </Helmet>
      <Row>
        <Col md={2} id="search-sidebar">
          { this.props.loading ? <LoadingPane /> : this.render_aggs(this.props.aggProps) }
        </Col>
        <Col md={10} id="search-main">
          <Grid>
            <Row>
              <Col md={12}>
                { this.render_table(this.props.loading, this.props.gridProps) }
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
    </SearchWrapper>
  }
}

export default SearchView;
