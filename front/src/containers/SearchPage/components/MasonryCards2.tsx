import * as React from 'react';
import { Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import { SearchPageSearchQuery_search_studies } from  '../../../services/search/model/SearchPageSearchQuery';
import { MailMergeView } from 'components/MailMerge';
import { List, Grid } from 'react-virtualized';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

interface MasonryCards2Props {
  data: SearchPageSearchQuery_search_studies[];
  loading: boolean;
  template: string;
  // height: number;
  // width: number;
  theme: Theme;
  // columns:any;
}

interface MasonryCards2State {
  loading: boolean;
}

class MasonryCards2 extends React.Component<MasonryCards2Props, MasonryCards2State> {
  constructor(props: MasonryCards2Props) {
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
    height: '100%',
  };
  someStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
  };

  rowRenderer = (
  //   {
  //   // key, // Unique key within array of rows
  //   index,
  //   card, // Index of row within collection
  //   isScrolling, // The List is currently being scrolled
  //   isVisible, // This row is visible within the List (eg it is not an overscanned row)
  //   style, // Style object to be applied to row (to position it)
  // }
  card, index
  
  ) => {
    const listItems = this.props.data;
    const newStyle = {
      width: "350px",
      height: "350px",
      margin: "15px",
    }



    return (

        <div
          key={index}
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
      let rowHeight = listItems.length < 3 ? 400 : 150;
      let height = rowHeight * listItems.length;
      return (
        this.props.data.map((card, index) => {
          this.rowRenderer(card, index)
        })
        // <List
        //   className={"faux-masonry"}
        //   width={1050}
        //   height={height}
        //   rowCount={listItems.length}
        //   rowHeight={rowHeight}
        //   rowRenderer={this.rowRenderer}
        // />

      );
    }
  }
}

export default withTheme(MasonryCards2);
