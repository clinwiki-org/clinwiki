import * as React from 'react';
import { Col } from 'react-bootstrap';
import { PulseLoader } from 'react-spinners';
import { SearchPageSearchQuery_search_studies } from 'types/SearchPageSearchQuery';
import { MailMergeView } from 'components/MailMerge';
import { SiteFragment_siteView } from 'types/SiteFragment';

interface CardsProps {
  data: SearchPageSearchQuery_search_studies[];
  onPress: Function;
  loading: boolean;
  columns: any;
  template : string
}

interface CardsState {
  loading: boolean;
}

class Cards extends React.Component<CardsProps, CardsState> {
  constructor(props: CardsProps) {
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

  clicked = (d: any) => {
    this.props.onPress(d);
  };

  render() {
    const listItems = this.props.data.map(d => {
      return (
        <Col
          key={d.nctId}
          lg={3}
          md={4}
          sm={6}
          xs={12}
          style={{ padding: '10px', height: '500px' }}
          onClick={() => this.clicked(d)}>
          <MailMergeView
            style={this.cardStyle}
            template={this.props.template}
            context={d}
          />
        </Col>
      );
    });

    return (
      <div>
        <div style={{ width: '100%' }}>{listItems}</div>
        <PulseLoader size={15} color={'#aed7ca'} loading={this.state.loading} />
      </div>
    );
  }
}

export default Cards;
