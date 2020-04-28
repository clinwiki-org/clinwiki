import styled from 'styled-components';
import withTheme from '../../containers/ThemeProvider';
import { Col, FormControl } from 'react-bootstrap';

// keep this as a button!
const StyledButton = styled.button`
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

const LinkContainer = styled.div`
  position: absolute;
  bottom: 30px;
  a {
    color: ${props => props.theme.authPage.signInLinks};
    margin-right: 15px;
  }
  a:hover {
    color: ${props => props.theme.authPage.signInLinksHover};
  }
`;

export const ThemedLinkContainer = withTheme(LinkContainer);

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
  flex: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }

  .rt-th {
    text-transform: capitalize;
    padding: 15px !important;
    background: ${props =>
      props.theme.searchResults.resultsHeaderBackground} !important;
    color: #fff;
  }

  .ReactTable .-pagination .-btn {
    background: ${props =>
      props.theme.searchResults.resultsPaginationButtons} !important;
  }

  div.rt-tbody div.rt-tr:hover {
    background: ${props =>
      props.theme.searchResults.resultsRowHighlight} !important;
    color: #fff !important;
  }

  .rt-table {
  }
  span, h2{
    padding-left: 15px;
  }
`;


export const ThemedMainContainer = withTheme(MainContainer);




export default ThemedButton;

export const SearchContainer = styled.div`
  border: solid white 1px;
  background-color: #f2f2f2;
  color: black;
  margin-bottom: 1em;
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export const  StyledProfileLabel = styled.div`
font-size:1em;
font-weight:400;
color: rgba(0,0,0,0.6);
padding-left: 1.2em;
`;
export const StyledProfileValue = styled.div`
font-size:1.25em;
border-bottom: solid white;
margin: 0 1em 1em 1em;
`

export const StyledProfileForm = styled(FormControl)`
background: rgba(255,255,255,0.2);
    font-family: 'Lato','Helvetica Neue',Helvetica,Arial,sans-serif;
    font-size: 1.25em;
    border: none;
    padding:0;
    margin: 0 1em 1em 1em;
    border-bottom: solid white;
    width: auto;
    box-shadow: none !important;
    color: black;
&::placeholder {
  color: rgba(0, 0, 0, 0.5);
  opacity: 1;
}
`;
