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
  &:disabled {
    background: ${props => props.theme.buttonDisabled};
  }
`;

export const ThemedButton = withTheme(StyledButton);

const AutosuggestButton = styled.div`
  background: ${props => props.theme.button};
  padding: 5px 7px;
  display: inline-block;
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

export const ThemedAutosuggestButton = withTheme(AutosuggestButton);

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
  overflow:scroll;
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

  h2 {
    padding-left: 15px;
  }
`;

export const ThemedMainContainer = withTheme(MainContainer);

const PresearchCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme.buttonSecondary};
  margin: 10px;
  flex: 1;
  min-width: 320px;
  max-width: 320px;
  background: white;
`;

export const ThemedPresearchCard = withTheme(PresearchCard);

const PresearchHeader = styled.div`
  background-color: ${props => props.theme.presearch.presearchHeaders};
  padding: 5px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ThemedPresearchHeader = withTheme(PresearchHeader);

export const PresearchTitle = styled.div`
  color: white;
  font-size: 25px;
  font-weight: 400;
  margin-left: 5px;
`;

export const TextFieldToggle = styled.div`
  color: white;
  font-size: 28px;
  font-weight: 400;
  margin-right: 5px;
`;

export const PresearchFilter = styled.div`
  margin-left: 5px;
  max-height: 30px;
`;

export const PresearchPanel = styled.div`
  overflow-x: auto;
  max-height: 200px;
  min-height: 200px;
  margin-left: 5px;
  margin-top: 30px;
`;

export const PresearchContent = styled.div`
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  background-color: white;
  max-height: 260px;
  margin-bottom: 7px;
`;

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

export const StyledProfileLabel = styled.div`
  font-size: 1em;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  padding-left: 1.2em;
`;
export const StyledProfileScoreLabel = styled.div`
  font-size: 1em;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
`;
export const StyledProfileValue = styled.div`
  font-size: 1.25em;
  border-bottom: solid white;
  margin: 0 1em 1em 1em;
`;
export const StyledProfileRanking = styled.div`
  display: flex;
`;
export const StyledProfileScoreValue = styled.div`
  font-size: 1.25em;
`;
export const StyledLabelValuePair = styled.div`
  margin: auto;
  width: 25%;
  text-align: center;
  cursor: pointer;
`;
export const ScoreBoard = styled.div`
  display: flex;
  padding: 1em 0 1em 0;
  margin: 0 1.2em;
  :nth-child(1) {
    border-bottom: solid white;
  }
`;
export const StyledProfileForm = styled(FormControl)`
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 1.25em;
  border: none;
  padding: 10px;
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
export const StyledInterventionHeading = styled.div`
  margin: 1em;
  border-bottom: solid white;
`;
