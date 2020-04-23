import styled from 'styled-components';
import withTheme from '../../containers/ThemeProvider';

const StyledButton = styled.div`
  padding: 10px 15px;
  background: ${props => props.theme.button};
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
  color: #fff;
  &:hover {
    background: ${props => props.theme.buttonSecondary};
  }
`;

export const ThemedButton = withTheme(StyledButton);

const LinkContainer = 
styled.div`
 position: absolute;
 bottom: 30px;
 a {
   color: ${props => props.theme.authPage.signInLinks};
   margin-right: 15px;
 } 
 a:hover {
   color: ${props => props.theme.authPage.signInLinksHover}
 }
 `
;

export const ThemedLinkContainer = withTheme(LinkContainer);

export default ThemedButton;
