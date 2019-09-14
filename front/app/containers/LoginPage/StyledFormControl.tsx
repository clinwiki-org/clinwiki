import styled from 'styled-components';
import { FormControl } from 'react-bootstrap';

export default styled(FormControl)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 15px 0 15px 0;
  height: 40px;
  box-shadow: none !important;
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    opacity: 1;
  }
`;
