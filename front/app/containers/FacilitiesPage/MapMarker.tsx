import * as React from 'react';
import styled from 'styled-components';
import FacilityInfoCard from  './FacilityInfoCard';

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
  color: #55B88D;
  font-size: 21px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px white
`;

const HoverCircle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${K_CIRCLE_SIZE}px;
  height: ${K_CIRCLE_SIZE}px;
  border: 3px solid #55B88D;
  border-radius: ${K_CIRCLE_SIZE}px;
  background-color: white;
  text-align: center;
  color: #324870;
  font-size: 21px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px white
`;

const HoverStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #55B88D
`;


const MarkerStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #324870
`;

// interface MapMarkerProps  {
//   // $hover: boolean,
//   text: string,
//   lat: number,
//   lng: number,
// };

// interface MapMarkerState {

// };


class MapMarker extends React.PureComponent<any> {

  render() {
    return (
      <MarkerContainer>
        {this.props.$hover ? 
          <div> 
            <HoverCircle>
              {this.props.text}
            </HoverCircle>
            <HoverStick />
          </div>
          : 
          <div>
            <MarkerCircle>
              {this.props.text}
            </MarkerCircle>
            <MarkerStick />
          </div>
        } 
        <FacilityInfoCard 
          hover={this.props.$hover}
          address={this.props.address}
          name={this.props.name}
        />
      </MarkerContainer>
    )
  }
}

export default MapMarker;
