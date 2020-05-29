import * as React from 'react';
import styled from 'styled-components';
import { FacilitiesPageQuery_study_facilities_contacts } from 'types/FacilitiesPageQuery';
import { truncateString } from './FacilityUtils';
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

interface Props {
  hover?: boolean;
  name: string | null;
  address: string;
  contacts: FacilitiesPageQuery_study_facilities_contacts[];
  clicked: boolean;
}

class FacilityInfoCard extends React.PureComponent<Props> {
  render() {
    const { name, address, hover } = this.props;
    return (
      <div>
        <ThemedCardContainer
          style={hover ? { visibility: 'visible' } : { visibility: 'hidden' }}>
          <TitleText>{truncateString(name, 60, true)}</TitleText>
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
