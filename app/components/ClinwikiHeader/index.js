/**
*
* ClinwikiHeader
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import messages from './messages';

class ClinwikiHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Row>
        <Col md={12}>
          <h1><FormattedMessage {...messages.header} /></h1>
        </Col>
      </Row>
    );
  }
}

ClinwikiHeader.propTypes = {

};

export default ClinwikiHeader;
