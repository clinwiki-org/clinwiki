import * as React from 'react';
import { Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import { SearchPageSearchQuery_search_studies } from 'types/SearchPageSearchQuery';
import { MailMergeView } from 'components/MailMerge';
import { List } from 'react-virtualized';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';
import {ThemedSearchCard} from 'components/StyledComponents';
import {
  AutoSizer,
} from 'react-virtualized';

interface MasonryCardsProps {
  data: SearchPageSearchQuery_search_studies[];
  loading: boolean;
  template: string;
  // height: number;
  // width: number;
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
    if (this.state.loading !== this.props.loading) {
      this.setState({ loading: this.props.loading });
    }
  }

  cardStyle: React.CSSProperties = {
    borderWidth: 2,
    // borderColor: this.props.theme.button,
    // borderStyle: 'solid',
    // borderRadius: '4px',
    background: '#ffffff',
    height: '100%',
  };
  someStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
  };

  cardRenderer = (
  //   {
  //   key, // Unique key within array of rows
  //   index, // Index of row within collection
  //   isScrolling, // The List is currently being scrolled
  //   isVisible, // This row is visible within the List (eg it is not an overscanned row)
  //   style, // Style object to be applied to row (to position it)
  // }
  cardData, index
  
  ) => {
    const listItems = this.props.data;
    const newStyle = {
      // width: "350px",
      // minHeight: "350px",
      // margin: "15px",
      // boxShadow: '0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)',
      // borderRadius: '4px',
      // background: '#ffffff',
    }

    return (

        <ThemedSearchCard
          key={index}
        >
          <MailMergeView
            style={this.cardStyle}
            template={this.props.template}
            context={listItems[index]}
          />
        </ThemedSearchCard>
    );
  };

  render() {
    if (this.props.data) {
      const cards =  this.props.data.map((cardData, index) => this.cardRenderer(cardData, index))
    
      const listItems = this.props.data;
      let rowHeight = listItems.length < 3 ? 400 : 150;
      // let height = rowHeight * listItems.length;
      return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
         {cards}
        </div>
        );
    }
  }
}

export default withTheme(MasonryCards);
