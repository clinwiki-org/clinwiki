import * as React from 'react';
import { Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import { SearchPageSearchQuery_search_studies } from 'types/SearchPageSearchQuery';
import { MailMergeView } from 'components/MailMerge';
import { SiteFragment_siteView } from 'types/SiteFragment';
import { Column, Table, SortDirection, AutoSizer } from 'react-virtualized';
import _ from 'lodash';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import { camelCase, sentanceCase } from 'utils/helpers';

interface TableRVProps {
  data: SearchPageSearchQuery_search_studies[];
  loading: boolean;
  template: string;
  width: number;
  columnFields: string[];
}

interface TableRVState {
  loading: boolean;
}

class TableRV extends React.Component<TableRVProps, TableRVState> {
  constructor(props: TableRVProps) {
    super(props);
    this.state = { loading: this.props.loading };
  }

  componentDidUpdate() {
    if (this.state.loading !== this.props.loading) {
      this.setState({ loading: this.props.loading });
    }
  }

  cardStyle: React.CSSProperties = {
    borderWidth: 2,
    borderColor: 'rgb(85, 184, 141)',
    borderStyle: 'solid',
    borderRadius: '5px',
    background: '#ffffff',
    cursor: 'pointer',
    height: '100%',
  };


  _rowClassName({ index }) {
    if (index < 0) {
      return 'headerRow';
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow';
    }
  }

  render() {
    if (this.props.data) {
      const listItems = this.props.data;
      let rowHeight = 250;
      let width = this.props.width;
      let height = 500;

      return (
        <Table
          width={width}
          height={height}
          headerHeight={20}
          rowHeight={40}
          rowCount={listItems.length}
          rowClassName={this._rowClassName}
          rowGetter={({ index }) => listItems[index]}
        // sortDirection={SortDirection.ASC}
        // sortBy={'nctId'}
        >
          {this.props.columnFields.map((field) => {
        //need to find a way to make column width more dynamic
            return (
              <Column label={sentanceCase(field)} dataKey={camelCase(field)} width={width / this.props.columnFields.length} />
            )
          })}
        </Table>
      );
    }
  }
}

export default TableRV;
