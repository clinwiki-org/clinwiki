import styled from 'styled-components';
// import { Button } from 'react-bootstrap';
import withTheme from './../ThemeProvider';

const StyledButton = styled.div`
  padding: 10px 15px;
  background: ${props => props.theme.button};
  color: ${props=> props.theme.authButton.buttonFont};
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.5s;
  &:hover {
    background: ${props => props.theme.buttonSecondary} !important;
  }
`;

export const ThemedButton = withTheme(StyledButton);

export default StyledButton;
