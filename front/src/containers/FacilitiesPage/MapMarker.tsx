import * as React from 'react';
import styled from 'styled-components';
import FacilityInfoCard from './FacilityInfoCard';
import { FacilitiesPageQuery_study_facilities_contacts } from 'types/FacilitiesPageQuery';
import withTheme from 'containers/ThemeProvider';

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

const Circle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${K_CIRCLE_SIZE}px;
  height: ${K_CIRCLE_SIZE}px;
  border-radius: ${K_CIRCLE_SIZE}px;
  background-color: white;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  padding: 2.5px 0 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
`;

const MarkerCircle = styled(Circle)`
  border: 3px solid ${props => props.theme.mapSection.markerBorderColor};
  color: ${props => props.theme.mapSection.markerFontColor};
`;

const ThemedMarkerCircle = withTheme(MarkerCircle);

const WarningCircle = styled(Circle)`
  border: 3px solid #ffcc00;
  color: #f6a202;
`;

const HoverCircle = styled(MarkerCircle)`
  border: 3px solid ${props => props.theme.mapSection.markerFontColor};
  color: ${props => props.theme.mapSection.markerBorderColor};
`;

const ThemedHoverCircle = withTheme(HoverCircle);

const WarningHoverCircle = styled(MarkerCircle)`
  border: 3px solid #f6a202;
  color: #ffcc00;
`;

const MarkerStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: ${props => props.theme.mapSection.markerBorderColor};
`;

const ThemedMarkerStick = withTheme(MarkerStick);

const HoverStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: ${props => props.theme.mapSection.markerFontColor};
`;

const ThemedHoverStick = withTheme(HoverStick);

const WarningStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #ffcc00;
`;

const WarningHoverStick = styled.div`
  position: absolute;
  left: calc(${K_CIRCLE_SIZE}px / 2 - ${K_STICK_WIDTH}px / 2);
  top: ${K_CIRCLE_SIZE}px;
  width: ${K_STICK_WIDTH}px;
  height: ${K_STICK_SIZE}px;
  background-color: #f6a202;
`;

interface Props {
  onClick: () => void;
  clicked: boolean;
  lat?: number | null;
  lng?: number | null;
  geoStatus?: string;
  contacts: FacilitiesPageQuery_study_facilities_contacts[];
  text: number;
  name: string | null;
  address: string;
  $hover?: boolean;
}

class MapMarker extends React.PureComponent<Props> {
  state = {
    clicked: false,
  };

  markerClicked = () => {
    this.setState({
      clicked: !this.state.clicked,
    });
  };

  render() {
    if (this.props.geoStatus === 'good') {
      return (
        <MarkerContainer onClick={this.markerClicked}>
          {this.props.$hover || this.state.clicked ? (
            <>
              <ThemedHoverCircle onClick={this.props.onClick}>
                {this.props.text}
              </ThemedHoverCircle>
              <ThemedHoverStick />
            </>
          ) : (
            <>
              <ThemedMarkerCircle onClick={this.props.onClick}>
                {this.props.text}
              </ThemedMarkerCircle>
              <ThemedMarkerStick />
            </>
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
    if (this.props.geoStatus === 'zip') {
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
