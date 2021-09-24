import * as React from 'react';
import { Col, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { defaultTo } from 'ramda';
import ThemedButton from 'components/StyledComponents';

const FooterCol = styled(Col)`
  text-align: center;
`;

interface LoginModalProps {
  title?: string;
  body?: string;
  show: boolean;
  cancel: any;
}

class LoginModal extends React.PureComponent<LoginModalProps> {
  render() {
    const { title, body, cancel, show } = this.props;
    return (
      <Modal show={show} style={{ minHeight: '250px', zIndex:10000 }}>
        <Modal.Dialog style={{ minHeight: '250px' }}>
          <Modal.Header>
            <Modal.Title style={{ textAlign: 'center' }}>
              {defaultTo('Please Sign In')(title)}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ textAlign: 'center' }}>
            {defaultTo('You must be logged in to use this feature.')(body)}
          </Modal.Body>

          <Modal.Footer>
            <FooterCol xs={4}>
              <Link to="/sign_in">Sign In</Link>
            </FooterCol>
            <FooterCol xs={4}>
              <Link to="/sign_up">Sign Up</Link>
            </FooterCol>
            <FooterCol xs={4}>
              <ThemedButton onClick={cancel}>Close</ThemedButton>
            </FooterCol>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );
  }
}

export default LoginModal;
