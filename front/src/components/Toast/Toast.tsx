import * as React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { Alert, Button } from 'react-bootstrap';

interface ToastProps {
  message: string;
  buttons: any;
}

class Toast extends React.PureComponent<ToastProps> {
  static fragment = gql`
    fragment ToastFragment on Site {
      id
      name
      subdomain
    }
  `;

  render() {
    const { message, buttons } = this.props;
    return (
      <Alert>
        <Container>
          <Text>{message}</Text>
          {buttons.map(({ label, onClick }) => (
            <Button onClick={onClick}>{label}</Button>
          ))}
        </Container>
      </Alert>
    );
  }
}

const Text = styled.p``;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;
export default Toast;
