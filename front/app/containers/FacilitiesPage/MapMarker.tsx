import * as React from "react";
import styled from "styled-components";
import FacilityInfoCard from "./FacilityInfoCard";

const K_CIRCLE_SIZE = 30;
const K_STICK_SIZE = 10;
const K_STICK_WIDTH = 3;

const MarkerContainer = styled.div`
  position: absolute;
  width: ${K_CIRCLE_SIZE}px;
  height: calc(${K_CIRCLE_SIZE}px + ${K_STICK_SIZE}px);
  left: calc((${K_CIRCLE_SIZE}px / 2) * -1);
  top: calc((${K_CIRCLE_SIZE}px + ${K_STICK_SIZE}px) * -1);
`;

const MarkerCircle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${K_CIRCLE_SIZE}px;
  height: ${K_CIRCLE_SIZE}px;
  border: 3px solid #324870;
  border-radius: ${K_CIRCLE_SIZE}px;
  background-color: white;
  text-align: center;
  color: #55b88d;
  font-size: 21px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
`;

const WarningCircle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${K_CIRCLE_SIZE}px;
  height: ${K_CIRCLE_SIZE}px;
  border: 3px solid #ff6d36;
  border-radius: ${K_CIRCLE_SIZE}px;
  background-color: white;
  text-align: center;
  color: #ffae42;
  font-size: 21px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
`;

const HoverCircle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${K_CIRCLE_SIZE}px;
  height: ${K_CIRCLE_SIZE}px;
  border: 3px solid #55b88d;
  border-radius: ${K_CIRCLE_SIZE}px;
  background-color: white;
  text-align: center;
  color: #324870;
  font-size: 21px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
`;

const WarningHoverCircle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${K_CIRCLE_SIZE}px;
  height: ${K_CIRCLE_SIZE}px;
  border: 3px solid #ffae42;
  border-radius: ${K_CIRCLE_SIZE}px;
  background-color: white;
  text-align: center;
  color: #ff6d36;
  font-size: 21px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
`;

const MarkerStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #324870;
`;

const HoverStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #55b88d;
`;

const WarningStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #ff6d36;
`;

const WarningHoverStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #ffae42;
`;

class MapMarker extends React.PureComponent<any> {
  state = {
    clicked: false
  };

  markerClicked = () => {
    this.setState({
      clicked: !this.state.clicked
    });
  };

  render() {
    if (this.props.geoStatus === "good") {
      return (
        <MarkerContainer onClick={() => this.markerClicked()}>
          {this.props.$hover || this.state.clicked ? (
            <div>
              <HoverCircle onClick={this.props.onClick}>
                {this.props.text}
              </HoverCircle>
              <HoverStick />
            </div>
          ) : (
            <div>
              <MarkerCircle onClick={this.props.onClick}>
                {this.props.text}
              </MarkerCircle>
              <MarkerStick />
            </div>
          )}
          {this.state.clicked ? (
            <FacilityInfoCard
              hover={true}
              address={this.props.address}
              name={this.props.name}
              contacts={this.props.contacts}
              clicked={this.state.clicked}
            />
          ) : (
            <FacilityInfoCard
              hover={this.props.$hover}
              address={this.props.address}
              name={this.props.name}
              contacts={this.props.contacts}
              clicked={this.state.clicked}
            />
          )}
        </MarkerContainer>
      );
    }
    if (this.props.geoStatus === "zip") {
      return (
        <MarkerContainer onClick={() => this.markerClicked()}>
          {this.props.$hover || this.state.clicked ? (
            <div>
              <WarningHoverCircle onClick={this.props.onClick}>
                {this.props.text}
              </WarningHoverCircle>
              <WarningHoverStick />
            </div>
          ) : (
            <div>
              <WarningCircle onClick={this.props.onClick}>
                {this.props.text}
              </WarningCircle>
              <WarningStick />
            </div>
          )}
          {this.state.clicked ? (
            <FacilityInfoCard
              hover={true}
              address={this.props.address}
              name={this.props.name}
              contacts={this.props.contacts}
              clicked={this.state.clicked}
            />
          ) : (
            <FacilityInfoCard
              hover={this.props.$hover}
              address={this.props.address}
              name={this.props.name}
              contacts={this.props.contacts}
              clicked={this.state.clicked}
            />
          )}
        </MarkerContainer>
      );
    }
  }
}

export default MapMarker;
