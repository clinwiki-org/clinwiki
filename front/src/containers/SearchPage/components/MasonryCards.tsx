// import * as React from 'react';
import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import { SearchPageSearchQuery_search_studies } from 'types/SearchPageSearchQuery';
import { MailMergeView } from 'components/MailMerge';
import { SiteFragment_siteView } from 'types/SiteFragment';
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from 'react-virtualized';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

interface MasonryCardsProps {
  data: SearchPageSearchQuery_search_studies[];
  loading: boolean;
  template: string;
  defaultHeight: number;
  defaultWidth: number;
  containerWidth: number;
  theme: Theme;
  cellPositioner: Function;
  cache: object;
  // columns:any;
}

interface MasonryCardsState {
  loading: boolean;
}

class MasonryCards extends React.Component<
  MasonryCardsProps,
  MasonryCardsState
> {
  constructor(props: MasonryCardsProps) {
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
    borderColor: this.props.theme.button,
    borderStyle: 'solid',
    borderRadius: '5px',
    background: '#ffffff',
    cursor: 'pointer',
    height: '100%',
  };

  cache = new CellMeasurerCache({
    defaultHeight: this.props.defaultHeight,
    defaultWidth: this.props.defaultWidth,
    fixedWidth: true,
    fixedHeight: true,
  });

  cellRenderer = ({
    index, // Index of item within the collection
    isScrolling, // The Grid is currently being scrolled
    key, // Unique key within array of cells
    parent, // Reference to the parent Grid (instance)
    style, // Style object to be applied to cell (to position it);
    // This must be passed through to the rendered cell element.
  }) => {
    const listItems = this.props.data;

    return (
      <CellMeasurer cache={this.cache} index={index} key={key} parent={parent}>
        <div style={style} >
          <MailMergeView
            style={this.cardStyle}
            template={this.props.template}
            context={listItems[index]}
          />
        </div>
      </CellMeasurer>
    );
  };
  onRenderHelper = e => {
    console.log('E', e);
    if (e.stopIndex % 24 == 0) {
    }
  };
  render() {
    console.log(this.props.cache);
    console.log(this.cache);
    if (this.props.data) {
      const listItems = this.props.data;
      let width = window.innerWidth * 0.95;

      return (
        <Masonry
          cellCount={listItems.length}
          cellMeasurerCache={this.props.cache}
          cellPositioner={this.props.cellPositioner}
          cellRenderer={this.cellRenderer}
          height={800}
          width={this.props.containerWidth}
          onCellsRendered={e => this.onRenderHelper(e)}
          onScroll={e => console.log(e)}
        />
      );
    }
  }
}

export default withTheme(MasonryCards);
