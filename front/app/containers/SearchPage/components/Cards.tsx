import * as React from 'react';
import { Col } from 'react-bootstrap';
import ReactStars from 'react-stars';
import { starColor } from 'utils/constants';
import moment from 'moment';
import { PulseLoader } from 'react-spinners';

interface CardsProps {
  data: any;
  onPress: Function;
  loading: boolean;
}

interface CardsState {
  loading: boolean;
}

class Cards extends React.Component<CardsProps, CardsState> {

  constructor (props:CardsProps) {
    super(props);
    this.state = { loading: this.props.loading };
  }

  componentDidUpdate() {
    if (this.state.loading !== this.props.loading) {
      this.setState({ loading: this.props.loading });
    }
  }

  cardStyle = {
    borderWidth: 2,
    borderColor: 'rgb(85, 184, 141)',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    background: 'linear-gradient(0deg, #ffffff 87%, rgba(85, 184, 141, 0.4) 13%)',
    cursor: 'pointer',
  };

  clicked = (d: any) => {
    this.props.onPress(d);
  }

  render() {

    const listItems = this.props.data.map(d => {
      return (
        <Col
            key={d.nctId}
            lg={3} md={4} sm={6} xs={12}
            style={{ padding: '10px' }}
            onClick={() => this.clicked(d)} >
          <div style={this.cardStyle} >
            <div style={{ width: '100%' }}>
              <h3 style={{ marginTop: '10px' }}>{d.nctId}</h3>
            </div>
            <div style={{ width: '100%' }}>
              <label>Average Rating:</label>
            </div>
            <div style={{ width: '100%', paddingBottom: '10px' }}>
              <ReactStars
                count={5}
                color2={starColor}
                edit={false}
                value={d.averageRating}/>
            </div>
            <div style={{ width: '100%' }}>
                <label>Brief Title: </label>
            </div>
            <div style={{ width: '100%', height: '150px' }}>
              {d.briefTitle}
            </div>
            <div style={{ width: '100%', height: '46px' }}>
                <label>Overall Status: </label> {d.overallStatus}
            </div>
            <div style={{ width: '100%' }}>
                <label>Start Date: </label> { d.startDate ? moment(d.startDate).format('MM/DD/YYYY') : '' }
            </div>
            <div style={{ width: '100%' }}>
                <label>Start Date: </label> {
                  d.completionDate ? moment(d.completionDate).format('MM/DD/YYYY') : ''
                }
            </div>
          </div>
        </Col>
      );
    });

    return (
      <div>
        {listItems}
        <PulseLoader
          size={15}
          color={'#aed7ca'}
          loading={this.state.loading} />
      </div>
    );

  }

}

export default Cards;
