import * as React from "react";
import { starColor } from "utils/constants";
import { PulseLoader } from "react-spinners";
import ReactStars from "react-stars";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const CardWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 425px;
  height: 170px;
  margin: 10px;
  padding: 10px;
  box-shadow: 6px 7px 5px -1px rgba(0, 0, 0, 0.36);
  cursor: pointer;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  height: 25%;
  margin-bottom: 5px;
`;

const CardBodyRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 65px;
`;

const CardBodyCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardSubHeader = styled.div`
  font-weight: 600;
  color: #324870;
  font-size: 16px;
  margin-right: 7px;
`;

const CardContent = styled.div`
  opacity: 0.85;
`;

const CardTitle = styled.div`
  font-weight: 600;
  color: #55b88d;
  font-size: 20px;
  width: 75%;
`;

const CardRating = styled.div`
  width: 25%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

interface CardsProps {
  data: any;
  onPress: Function;
  loading: boolean;
}

interface CardsState {
  loading: boolean;
}

class NewCards extends React.Component<CardsProps, CardsState> {
  constructor(props: CardsProps) {
    super(props);
    this.state = { loading: this.props.loading };
  }

  componentDidUpdate() {
    if (this.state.loading !== this.props.loading) {
      this.setState({ loading: this.props.loading });
    }
  }

  clicked = (d: any) => {
    this.props.onPress(d);
  };
  // Number(data.averageRating)
  renderCards = (data: any) => {
    const cards = data.map((data, i) => {
      return (
        <CardWrapper onClick={() => this.clicked(data)}>
          <CardHeader>
            <CardTitle>{data.nctId}</CardTitle>
            <CardRating>
              <ReactStars count={5} color2={starColor} edit={false} value={3} />
              <CardContent>{`(${data.reviewsCount})`}</CardContent>
            </CardRating>
          </CardHeader>
          <CardBodyRow>
            <CardBodyCol>
              <CardSubHeader>Brief Title</CardSubHeader>
              <CardContent>{data.briefTitle}</CardContent>
            </CardBodyCol>
          </CardBodyRow>
          <CardBodyRow>
            <CardBodyCol style={{ width: "50%" }}>
              <CardSubHeader>Overall Status</CardSubHeader>
              <CardContent>{data.overallStatus}</CardContent>
            </CardBodyCol>
            <CardBodyCol style={{ width: "25%" }}>
              <CardSubHeader>Started</CardSubHeader>
              <CardContent>
                {data.startDate ? data.startDate : "N/A"}
              </CardContent>
            </CardBodyCol>
            <CardBodyCol style={{ width: "25%" }}>
              <CardSubHeader>Completed</CardSubHeader>
              <CardContent>
                {data.completionDate ? data.completionDate : "N/A"}
              </CardContent>
            </CardBodyCol>
          </CardBodyRow>
        </CardWrapper>
      );
    });
    return cards;
  };

  render() {
    return (
      <MainContainer>
        {this.renderCards(this.props.data)}
        <PulseLoader size={15} color={"#aed7ca"} loading={this.state.loading} />
      </MainContainer>
    );
  }
}

export default NewCards;
