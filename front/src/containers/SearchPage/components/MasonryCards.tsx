import * as React from 'react';
import { Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import { SearchPageSearchQuery_search_studies } from 'types/SearchPageSearchQuery';
import { MailMergeView } from 'components/MailMerge';
import { SiteFragment_siteView } from 'types/SiteFragment';
import { List } from 'react-virtualized';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

interface MasonryCardsProps {
  data: SearchPageSearchQuery_search_studies[];
  loading: boolean;
  template: string;
  height: number;
  width: number;
  theme: Theme;
  // columns:any;
}

interface MasonryCardsState {
  loading: boolean;
}

class MasonryCards extends React.Component<MasonryCardsProps, MasonryCardsState> {
  constructor(props: MasonryCardsProps) {
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
    cursor: 'pointer',
    height: '100%',
  };
  someStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
  };

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const listItems = this.props.data;
    const newStyle = {
      width: "30%",
      height: "350px",
      margin: "15px",
    }


    return (

        <div
          key={key}
          style={newStyle}
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
      let height = rowHeight * listItems.length;
      return (

        <List
          className={"faux-masonry"}
          width={this.props.width}
          height={height}
          rowCount={listItems.length}
          rowHeight={rowHeight}
          rowRenderer={this.rowRenderer}
        />

      );
    }
  }
}

export default withTheme(MasonryCards);
