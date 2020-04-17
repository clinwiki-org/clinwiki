import * as React from 'react';
import styled from 'styled-components';
import withTheme from 'containers/ThemeProvider';

const CardContainer = styled.div`
  min-width: 250px;
  background-color: ${props => props.theme.mapSection.facilityCardColor};
  min-height: 75px;
  position: relative;
  bottom: 85px;
  right: 20px;
  padding: 10px;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: text;
`;

const ThemedCardContainer = withTheme(CardContainer);

const TitleText = styled.h1`
  color: white;
  font-size: 14px;
  margin: 0;
`;

const SubTitle = styled.p`
  color: white;
  font-size: 14px;
  margin: 0;
`;

const Pointer = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid ${props => props.theme.mapSection.facilityCardColor};
  position: relative;
  bottom: 85px;
  right: -5px;
`;

const ThemedPointer = withTheme(Pointer);

const ContactInfo = styled.p`
  color: white;
  font-size: 14px;
  margin: 0;
`;

class FacilityInfoCard extends React.PureComponent<any> {
  truncateString = (str, n, useWordBoundary) => {
    if (str.length <= n) {
      return str;
    }
    let shortStr = str.substr(0, n);
    return (
      (useWordBoundary
        ? shortStr.substr(0, shortStr.lastIndexOf(' '))
        : shortStr) + '...'
    );
  };

  render() {
    const { name, address, hover } = this.props;
    return (
      <div>
        <ThemedCardContainer
          style={hover ? { visibility: 'visible' } : { visibility: 'hidden' }}>
          <TitleText>{this.truncateString(name, 60, true)}</TitleText>
          <SubTitle>{address}</SubTitle>
        </ThemedCardContainer>
        <ThemedPointer
          style={hover ? { visibility: 'visible' } : { visibility: 'hidden' }}
        />
      </div>
    );
  }
}

export default FacilityInfoCard;
