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

const MainContainer = styled.div`
  .Table {
    width: 100%;
    margin-top: 15px;
  }
  .headerRow,
  .evenRow,
  .oddRow {
    border-bottom: 1px solid #e0e0e0;
  }
  .oddRow {
    background-color: #fafafa;
  }
  .headerColumn {
    text-transform: none;
  }
  .exampleColumn {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .checkboxLabel {
    margin-left: 0.5rem;
  }
  .checkboxLabel:first-of-type {
    margin-left: 0;
  }

  .noRows {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    color: #bdbdbd;
  }
`;
interface TableRVProps {
  data: SearchPageSearchQuery_search_studies[];
  onPress: Function;
  loading: boolean;
  template: string;
  width: number;
  // columns:any;
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

  //  rowRenderer=({
  //   key, // Unique key within array of rows
  //   index, // Index of row within collection
  //   isScrolling, // The List is currently being scrolled
  //   isVisible, // This row is visible within the List (eg it is not an overscanned row)
  //   style, // Style object to be applied to row (to position it)
  // })=> {
  //        const listItems = this.props.data

  //   return (
  //       <div key={key} style={style} onClick={()=>this.props.onPress(listItems[index])}>
  //         <MailMergeView
  //           style={this.cardStyle}
  //           template={this.props.template}
  //           context={listItems[index]}
  //           />
  //       </div>

  //     );
  // }

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
      console.log('WIDTH', width);

      return (
        <Table
          width={width}
          height={height}
          headerHeight={20}
          rowHeight={40}
          rowCount={listItems.length}
          rowClassName={this._rowClassName}
          rowGetter={({ index }) => listItems[index]}
          sortDirection={SortDirection.ASC}
          sortBy={'nctId'}>
          <Column label="NCTID" dataKey="nctId" width={width * 0.15} />
          <Column
            label="Brief Title:"
            dataKey="briefTitle"
            width={width * 0.35}
          />

          <Column
            label="Overall Status:"
            dataKey="overallStatus"
            width={width * 0.25}
          />
          <Column
            label="Completion Date:"
            dataKey="completionDate"
            width={width * 0.25}
          />
        </Table>
      );
    }
  }
}

export default TableRV;
