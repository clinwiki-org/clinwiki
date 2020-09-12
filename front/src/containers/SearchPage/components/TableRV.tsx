import * as React from 'react';
import { SearchPageSearchQuery_search_studies } from 'types/SearchPageSearchQuery';
import { Column, Table, WindowScroller } from 'react-virtualized';
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
      let width = this.props.width;

      return (
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <Table
          autoHeight
          width={width}
          height={height}
          headerHeight={20}
          rowHeight={40}
          rowCount={listItems.length}
          rowClassName={this._rowClassName}
          rowGetter={({ index }) => listItems[index]}
          isScrolling={isScrolling}
          onScroll={onChildScroll}
          scrollTop={scrollTop}
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
    )}
    </WindowScroller>
      );
    }
  }
}

export default TableRV;
