import * as React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  min-width: 300px;
  background-color: #55B88D;
  min-height: 50px;
  position: relative;
  bottom: 85px;
  right: 20px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
`;

const TitleText = styled.h1`
  color: white;
  font-size: 14px;
`;

const SubTitle = styled.p`
  color: white;
  font-size: 14px;
`;

const Pointer = styled.div`
  width: 0; 
  height: 0; 
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #55B88D;
  position: relative;
  bottom: 85px;
  right: -5px;
`;


class FacilityInfoCard extends React.PureComponent<any> {



  render() {
    return(
      <div>
        <CardContainer style={this.props.hover ? {visibility: "visible"} : {visibility: "hidden"}}>
          <TitleText>{this.props.name}</TitleText>
          <SubTitle>{this.props.address}</SubTitle>
        </CardContainer>
        <Pointer style={this.props.hover ? {visibility: "visible"} : {visibility: "hidden"}}/>
      </div>
    )
  }

}


export default FacilityInfoCard;