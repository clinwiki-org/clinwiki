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
import _ from 'lodash';

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

interface ISearchViewProps {
  loading: boolean,
  columns: any,
  rows?: any,
  gridProps?: any,
  handleGridUpdate: any,
  aggs?: any,
  crowdAggs?: any,
  searchParams?: any,
  aggFilters?: any,
  crowdAggFilters?: any,
  addFilter?: any,
  removeFilter?: any,
  history?: any,
}

export class SearchView extends React.PureComponent<ISearchViewProps> {
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

  render_table({loading, columns, rows, gridProps, handleGridUpdate}) {
    if(loading) {
      return <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(columns)}
            manual
            loading={true}
            defaultSorted={this.getDefaultSorted(columns)}
            defaultSortDesc
          />
    }
    const pageSize = gridProps.pageSize
    const totalPages = Math.ceil(gridProps.recordsTotal / pageSize);

    return <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(columns)}
            manual
            // state.sorted= [0: {id: "average rating", desc: true} ]
            // state.page = page we're on?
            // state.pageSize = 'page size dropdown' (25)
            onFetchData={handleGridUpdate}
            data={rows}
            pages={totalPages}
            loading={loading}
            defaultPageSize={pageSize}
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
          { this.props.loading ? <LoadingPane /> : this.render_aggs(this.props) }
        </Col>
        <Col md={10} id="search-main">
          <Grid>
            <Row>
              <Col md={12}>
                { this.render_table(this.props) }
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
    </SearchWrapper>
  }
}

export default SearchView;
