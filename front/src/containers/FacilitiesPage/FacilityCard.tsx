import * as React from 'react';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';
import { truncateString } from './FacilityUtils';
import withTheme from 'containers/ThemeProvider';

const FacilityCardWrapper = styled.div`
  background-color: white;
  margin-bottom: 15px;
  padding: 10px;
  box-shadow: 6px 7px 5px -1px rgba(0, 0, 0, 0.36);
`;

const FacilityHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FacilityNumber = styled.div`
  position: relative;
  width: 28px;
  height: 22px;
  border-radius: 22px;
  border: 3px solid ${props => props.theme.mapSection.markerBorderColor};
  background-color: white;
  text-align: center;
  color: ${props => props.theme.mapSection.markerFontColor};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
  align-self: flex-end;
  margin: 0;
  padding-bottom: 22px;
`;

const ThemedFacilityNumber = withTheme(FacilityNumber);

const WarningNumber = styled.div`
  position: relative;
  width: 28px;
  height: 22px;
  border-radius: 22px;
  border: 3px solid ${props => props.theme.mapSection.warningBorderColor};
  background-color: white;
  text-align: center;
  color: ${props => props.theme.mapSection.warningFontColor};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
  align-self: flex-end;
  margin: 0;
  padding-bottom: 22px;
`;

const ThemedWarningNumber = withTheme(WarningNumber);

const ErrorNumber = styled.div`
  position: relative;
  width: 28px;
  height: 22px;
  border-radius: 22px;
  border: 3px solid ${props => props.theme.mapSection.errorBorderColor};
  background-color: white;
  text-align: center;
  color: ${props => props.theme.mapSection.errorFontColor};
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 0 0 1px white;
  align-self: flex-end;
  margin: 0;
  padding-bottom: 22px;
  cursor: pointer;
`;

const ThemedErrorNumber = withTheme(ErrorNumber);

const WarningHover = styled.div`
  width: 200px;
  height: 30px;
  background-color: #ffcc00;
  color: white;
  font-size: 14px;
  position: absolute;
  top: 30px;
  right: -5px;
  padding-top: 5px;
  visibility: hidden;
  border-radius: 1px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.36);
`;

const ThemedWarningHover = withTheme(WarningHover);

const ErrorHover = styled.div`
  width: 200px;
  height: 30px;
  background-color: red;
  color: white;
  font-size: 14px;
  position: absolute;
  top: 30px;
  right: -5px;
  padding-top: 5px;
  visibility: hidden;
  border-radius: 1px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.36);
`;

const ThemedErrorHover = withTheme(ErrorHover);

const FacilityTitle = styled.h2`
  width: 92%;
  font-weight: 600;
  color: ${props => props.theme.mapSection.markerFontColor};
  font-size: 20px;
  margin: 0;
`;

const ThemedFacilityTitle = withTheme(FacilityTitle);

const FacilityBody = styled.div`
  padding-top: 4px;
  width: 100%;
`;

const FacilitySubHead = styled.div`
  font-weight: 600;
  color: ${props => props.theme.mapSection.markerBorderColor};
  font-size: 16px;
  margin-right: 7px;
`;

const ThemedFacilitySubHead = withTheme(FacilitySubHead);

const Row = styled.div`
  flex-direction: row;
  display: flex;
`;

const ContactHead = styled.div`
  font-weight: 600;
  color: ${props => props.theme.mapSection.markerFontColor};
  font-size: 16px;
  text-decoration: underline;
`;

const ThemedContactHead = withTheme(ContactHead);

const FacilityWarning = styled.div`
  font-weight: 400;
  color: ${props => props.theme.mapSection.facilityWarningColor};
  font-size: 14px;
  margin-top: 2px;
  margin-right: 3px;
`;

const ThemedFacilityWarning = withTheme(FacilityWarning);

const FacilityError = styled.div`
  font-weight: 400;
  color: ${props => props.theme.mapSection.facilityWarningColor};
  font-size: 14px;
  margin-top: 2px;
`;

const ThemedFacilityError = withTheme(FacilityError);

const FacilitySubText = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 400;
  margin-top: 2px;
`;

const FacilityFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 18px;
  color: #c0c3c5;
  padding-top: 5px;
`;

const WarningPointer = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid
    ${props => props.theme.mapSection.facilityWarningColor};
  position: relative;
  bottom: -3px;
  right: -1px;
  visibility: hidden;
`;

const ThemedWarningPointer = withTheme(WarningPointer);

const ErrorPointer = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid
    ${props => props.theme.mapSection.facilityErrorPointer};
  position: relative;
  bottom: -3px;
  right: -1px;
  visibility: hidden;
`;

const ThemedErrorPointer = withTheme(ErrorPointer);

class FacilityCard extends React.PureComponent<any> {
  state = {
    facilityExpanded: false,
    warningHover: false,
    errorHover: false,
  };

  toggleExpand = () => {
    this.setState({
      facilityExpanded: !this.state.facilityExpanded,
    });
  };

  toggleWarning = bool => {
    this.setState({
      warningHover: bool,
    });
  };

  toggleError = bool => {
    this.setState({
      errorHover: bool,
    });
  };

  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  renderContactList = contacts => {
    return (
      <div>
        <ThemedFacilitySubHead>Contact Info:</ThemedFacilitySubHead>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '20px',
          }}>
          {contacts.map((item, index) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ThemedContactHead>
                {this.capitalize(item.contact_type)}
              </ThemedContactHead>
              <div style={{ marginLeft: '20px' }}>
                <Row>
                  <ThemedFacilitySubHead>Phone:</ThemedFacilitySubHead>
                  <FacilitySubText>{item.phone}</FacilitySubText>
                </Row>
                <Row>
                  <ThemedFacilitySubHead>Email:</ThemedFacilitySubHead>
                  <FacilitySubText>{item.email}</FacilitySubText>
                </Row>
                <Row>
                  <ThemedFacilitySubHead>Name:</ThemedFacilitySubHead>
                  <FacilitySubText>{item.name}</FacilitySubText>
                </Row>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderContacts = contacts => {
    if (contacts.length > 0) {
      return this.renderContactList(contacts);
    } else
      return (
        <Row>
          <ThemedFacilitySubHead>Contact Info:</ThemedFacilitySubHead>
          <FacilitySubText>No Contact Info Available</FacilitySubText>
        </Row>
      );
  };

  renderNumber = (geoStatus, index, latitude, longitude, numberClick) => {
    if (geoStatus === 'good') {
      return (
        <ThemedFacilityNumber
          onClick={() => numberClick(latitude, longitude, geoStatus)}>
          {index}
        </ThemedFacilityNumber>
      );
    }
    if (geoStatus === 'zip') {
      return (
        <ThemedWarningNumber
          onClick={() => numberClick(latitude, longitude, geoStatus)}
          onMouseEnter={() => this.toggleWarning(true)}
          onMouseOut={() => this.toggleWarning(false)}>
          <ThemedWarningHover
            style={
              this.state.warningHover
                ? { visibility: 'visible' }
                : { visibility: 'hidden' }
            }>
            Partial Address Mapped
          </ThemedWarningHover>
          {index}
          <ThemedWarningPointer
            style={
              this.state.warningHover
                ? { visibility: 'visible' }
                : { visibility: 'hidden' }
            }
          />
        </ThemedWarningNumber>
      );
    }
    if (geoStatus === 'bad') {
      return (
        <ThemedErrorNumber
          onMouseEnter={() => this.toggleError(true)}
          onMouseOut={() => this.toggleError(false)}>
          <ThemedErrorHover
            style={
              this.state.errorHover
                ? { visibility: 'visible' }
                : { visibility: 'hidden' }
            }>
            No Address Mapped
          </ThemedErrorHover>
          !
          <ThemedErrorPointer
            style={
              this.state.errorHover
                ? { visibility: 'visible' }
                : { visibility: 'hidden' }
            }
          />
        </ThemedErrorNumber>
      );
    }
  };

  renderLocation = (geoStatus, location) => {
    if (geoStatus === 'bad') {
      return (
        <Row>
          <ThemedFacilitySubHead>Location:</ThemedFacilitySubHead>
          <ThemedFacilityError>{location}</ThemedFacilityError>
        </Row>
      );
    }
    if (geoStatus === 'zip') {
      return (
        <Row>
          <ThemedFacilitySubHead>Location:</ThemedFacilitySubHead>
          <ThemedFacilityWarning>{location}</ThemedFacilityWarning>
        </Row>
      );
    }
    if (geoStatus === 'good') {
      return (
        <Row>
          <ThemedFacilitySubHead>Location</ThemedFacilitySubHead>
          <FacilitySubText>{location}</FacilitySubText>
        </Row>
      );
    }
  };

  render() {
    const { facilityExpanded } = this.state;
    const {
      title,
      index,
      status,
      location,
      contacts,
      numberClick,
      latitude,
      longitude,
      geoStatus,
      name,
    } = this.props;
    let newTitle;
    if (name) {
      newTitle = facilityExpanded ? name : truncateString(name, 33, true);
    } else newTitle = title;

    return (
      <FacilityCardWrapper key={title}>
        <FacilityHeader>
          <ThemedFacilityTitle>{newTitle || ''}</ThemedFacilityTitle>
          <div style={{ width: '8%' }}>
            {this.renderNumber(
              geoStatus,
              index,
              latitude,
              longitude,
              numberClick
            )}
          </div>
        </FacilityHeader>
        <FacilityBody>
          <Row>
            <ThemedFacilitySubHead>Status:</ThemedFacilitySubHead>
            <FacilitySubText>{status}</FacilitySubText>
          </Row>
          {this.renderLocation(geoStatus, location)}
          {facilityExpanded ? this.renderContacts(contacts) : null}
        </FacilityBody>
        <FacilityFooter>
          {
            <FontAwesome
              name={facilityExpanded ? 'chevron-up' : 'chevron-down'}
              onClick={this.toggleExpand}
            />
          }
        </FacilityFooter>
      </FacilityCardWrapper>
    );
  }
}

export default FacilityCard;
