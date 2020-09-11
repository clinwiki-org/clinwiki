import * as React from 'react';
import { Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import { SearchPageSearchQuery_search_studies } from 'types/SearchPageSearchQuery';
import { MailMergeView } from 'components/MailMerge';
import { SiteFragment_siteView } from 'types/SiteFragment';
import { InfiniteLoader, List, WindowScroller } from 'react-virtualized';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

interface ListCardsProps {
  data: SearchPageSearchQuery_search_studies[];
  loading: boolean;
  template: string;
  // height: number;
  width: number;
  theme: Theme;
  // columns:any;
  handleLoadMore: any;
}

interface ListCardsState {
  loading: boolean;
}

class ListCards extends React.Component<ListCardsProps, ListCardsState> {
  constructor(props: ListCardsProps) {
    super(props);
    this.state = { loading: this.props.loading };
  }

  componentDidUpdate() {
    console.log(this.props.theme);
    if (this.state.loading !== this.props.loading) {
      this.setState({ loading: this.props.loading });
    }
  }

  cardStyle: React.CSSProperties = {
    borderWidth: 2,
    borderColor: this.props.theme.button,
    borderStyle: 'solid',
    borderRadius: '5px',
    background: '#ffffff',
    height: '100%',
  };
  isRowLoaded = ({ index }) => {
    const listItems = this.props.data;
    //  const listItems = [];

    console.log(index, !!listItems[index])
    return !!listItems[index];
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log("Load more rows now", startIndex, stopIndex)
    if (stopIndex >= this.props.data.length) {
      console.log("Fetch NOW")
      return (
        this.props.handleLoadMore()
      )
    }

  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const listItems = this.props.data;

    return (
      <div
        key={key}
        style={style}
      >
        <MailMergeView
          style={this.cardStyle}
          template={this.props.template}
          context={listItems[index]}
        />
      </div>
    );
  };

  render() {
    if (this.props.data) {
      const listItems = this.props.data;
      let rowHeight = 150;
      const totalHeight = rowHeight * listItems.length;
      return (

        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={15050}
        >
          {({ onRowsRendered, registerChild }) => (

            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <List
                  height={height * 0.8}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={150}
                  rowHeight={rowHeight}
                  rowRenderer={this.rowRenderer}
                  width={this.props.width}
                // onScroll={onChildScroll}
                // isScrolling={isScrolling}
                // scrollTop={scrollTop}

                />
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      );
    }
  }
}

export default withTheme(ListCards);
