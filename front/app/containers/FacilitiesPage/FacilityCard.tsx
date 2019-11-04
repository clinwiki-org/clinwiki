import * as React from 'react';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';

const FacilityCardWrapper = styled.div`
  background-color: white;
  margin-bottom: 15px;
  padding: 10px;
  box-shadow: 6px 7px 5px -1px rgba(0,0,0,0.36);
`;

const FacilityHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FacilityNumber = styled.div`
  width: 28px;
  height: 22px;
  border: 3px solid #324870;
  border-radius: 22px;
  background-color: white;
  text-align: center;
  color: #55B88D;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 0 1px white;
  align-self: flex-end;
  margin: 0;
  padding-bottom: 22px;
`;

const FacilityTitle = styled.h2`
  width: 92%;
  font-weight: 600;
  color: #55B88D;
  font-size: 20px;
  margin: 0;
`;

const FacilityBody = styled.div`
  padding-top: 4px;
  width: 100%;
`;

const FacilitySubHead = styled.div`
  font-weight: 600;
  color: #324870;
  font-size: 16px;
  margin-right: 7px;
`;

const Row = styled.div`
  flex-direction: row; 
  display: flex; 
  align-items: center;
`;

const ContactHead = styled.div`
  font-weight: 600;
  color: #324870;
  font-size: 16px;
  text-decoration: underline;
`;

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

class FacilityCard extends React.PureComponent<any> {

  state = {
    facilityExpanded: false,
  }

  toggleExpand = () => {
    this.setState({
      facilityExpanded: !this.state.facilityExpanded,
    })
  }

  truncateString = (str, n, useWordBoundary) => {
    if(str.length <= n){
      return str;
    }
    let shortStr = str.substr(0, n);
    return (useWordBoundary
      ?  shortStr.substr(0, shortStr.lastIndexOf(' '))
      : shortStr) + '...';
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  renderContactList = (contacts) => {
    return(
      <div>
        <FacilitySubHead>Contact Info:</FacilitySubHead>
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px'}}>
          {contacts.map((item, index) => (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <ContactHead>{this.capitalize(item.contactType)}</ContactHead>
                <div style={{marginLeft: '20px'}}>
                  <Row>
                    <FacilitySubHead>Phone:</FacilitySubHead>
                    <FacilitySubText>{item.phone}</FacilitySubText>
                  </Row>
                  <Row>
                    <FacilitySubHead>Email:</FacilitySubHead>
                    <FacilitySubText>{item.email}</FacilitySubText>
                  </Row>
                  <Row>
                    <FacilitySubHead>Name:</FacilitySubHead>
                    <FacilitySubText>{item.name}</FacilitySubText>
                  </Row>
                </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderContacts = (contacts) => {
    if(contacts.length > 0) {
      return this.renderContactList(contacts);
    } else return (
      <Row>
        <FacilitySubHead>Contact Info:</FacilitySubHead>
        <FacilitySubText>No Contact Info Available</FacilitySubText>
      </Row>
    )
  }


  render() {
    const { facilityExpanded } = this.state;
    const { title, index, status, location, contacts } = this.props;
    const newTitle = facilityExpanded
      ? title
      : this.truncateString(title, 33, true);

    return (
      <FacilityCardWrapper key={title}>
        <FacilityHeader>
          <FacilityTitle>{newTitle || ''}</FacilityTitle>
          <div style={{ width: '8%' }}>
            <FacilityNumber>{index}</FacilityNumber>
          </div>
        </FacilityHeader>
        <FacilityBody>
          <Row>
            <FacilitySubHead>Status:</FacilitySubHead>
            <FacilitySubText>{status}</FacilitySubText>
          </Row>
          <Row>
            <FacilitySubHead>Location:</FacilitySubHead>
            <FacilitySubText>{location}</FacilitySubText>
          </Row>
          {facilityExpanded
            ? this.renderContacts(contacts)
            : null
          }
        </FacilityBody>
        <FacilityFooter>
          {<FontAwesome name={facilityExpanded ? 'chevron-up' : 'chevron-down'} onClick={this.toggleExpand} />}
        </FacilityFooter>
      </FacilityCardWrapper>
    )
  }
}

export default FacilityCard;