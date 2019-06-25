import * as React from 'react';
import styled from 'styled-components';
import Heading from 'components/Heading';
import { Row, Col } from 'react-bootstrap';

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 95vh;
  padding-top: 20px;
  padding-bottom: 20px;
`;

class AboutPage extends React.PureComponent<{}, {}> {
  render() {
    return (<MainContainer>
        <Heading> </Heading>
        <div className="container">
          <p>
            ClinWiki allows the crowd to contribute their collective knowledge to improve clinical trial information
            for everyone.</p>
          <p>
            Contributors include patients, family members, doctors, scientists or anyone with insights to share.</p>
          <p>
            We work with patient groups to curate the trials of interest to their disease.
            Anyone can contribute from patients, caregivers, friends to advisory board mem bers.
            Partner, Contribute, Code, Document, Donate. </p>
          <p>
            ClinWiki is a 501(c)(3) focused on making clinical trials more transparent and approachable,
            driving participation and ultimately improved trials and faster progress against serious dis eases.</p>
          <p>
            Special thanks to our supporters,
            <a href="https://www.cancercommons.org" target="_blank"> Cancer Commons</a> and
            <a href="http://www.orangecountync.gov/departments/outside_agency_non-profit_funding/funding_process.php"
            target="_blank"> Orange County</a>
          </p>
          <p>Contact: clinwiki at clinwiki.org</p>
        </div>
     </MainContainer>);
  }
}

export default AboutPage;
