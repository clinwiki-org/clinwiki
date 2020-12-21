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
  height: 38px;
  &:hover {
    transform: scale(1.05);
    transition-duration: 0.1s;
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
  // border-radius: 4px;
  // box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  // border-width: 1px;
  // border-style: solid;
  // border-color: ${props => props.theme.buttonSecondary};
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: ${props => props.theme.presearch.presearchCardMargin};
  margin-right: ${props => props.theme.presearch.presearchCardMargin};
  flex: 1;
  min-width: 320px;
  max-width: 320px;
  background: white;
  // min-height: 320px;
  .select-box--sublabel{
    padding-left: 5px;
    // background: ${props => props.theme.primaryColor};
    color: ${props => props.theme.presearch.presearchLabelTextColor};

  }
`;

export const ThemedPresearchCard = withTheme(PresearchCard);

const PresearchHeader = styled.div`
  background-color: ${props => props.theme.presearch.presearchLabelColor};
  // border-top-left-radius: 4px;
  // border-top-right-radius: 4px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 1px solid;
  border-left: 1px solid;
  border-bottom: 1px solid;
  border-color: ${props => props.theme.presearch.presearchBorderColor};
  padding: 1em;
`;

export const ThemedPresearchHeader = withTheme(PresearchHeader);

export const PresearchTitle = styled.div`
  color: ${props => props.theme.presearchLabelTextColor}; 
  font-size: 14px;
  font-weight: 700;
  margin-left: 5px;
  text-transform: uppercase;
  letter-spacing: .1em;
`;

const SearchCard = styled.div`
width: 350px;
min-height: 350px;
margin: 15px;
box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
border-radius: 4px;
background: #ffffff;
padding: 5px;
 a {
  ${props => props.theme.button};
 }

 .mail-merge {
   position: relative;
 }


`;

export const ThemedSearchCard = withTheme(SearchCard)

const SearchContainer = styled.div`
  border: solid white 1px;
  background-color: #f2f2f2;
  color: black;
  margin-bottom: 1em;
  margin-left: 45px;
  margin-right: 45px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;

  .rich-text {
    background-color: #f2f2f2;
  }
  .container {
    border: 0px;
    width: 100% !important;
    margin-top: 5px;
    color: #394149;
  }

  #brieftitle {
    font-size: 1.3em;
  }

  .bottom-right-icon {
    position: absolute;
    bottom: 4px;
    right: 4px;
    height: 30px;
    width: 30px;
    transition: .5s;
    opacity: 1;
    img {
      height: 100%;
      width: auto;
    }
   }

   .cw-icon-link:hover {
    opacity: .8;
  }
  .crumbs-bar {
    background: ${props => props.theme.crumbsBar.containerBackground};
    color: ${props => props.theme.crumbsBar.containerFont};

    i {
      font-style: normal;
      margin-right: 3px;
      text-transform: capitalize;
    }

    span.label.label-default {
      padding: 7px !important;
      border-radius: 4px !important;
      display: flex;
      flex-wrap: wrap;
    }

    input.form-control {
      border: 0px;
      box-shadow: none;
      margin-right: 10px;
      margin-left: 10px;
    }

    span.label {
      background: #55b88d;
      padding: 5px;
      font-size: 12px;
      border-radius: 4px;
      margin-right: 5px;
      text-transform: capitalize;

      span.fa-remove {
        color: #fff !important;
        opacity: 0.5;
        margin-left: 5px !important;
      }

      span.fa-remove:hover {
        opacity: 1;
      }

      b {
        padding: 5px 1px 5px 1px;
      }

      b:last-of-type {
        padding-right: 0px;
      }
    }
  }
  .right-align {
    text-align: right;
  }

  div.row > div {
    padding-left: 0px;
  }

  .searchInput {
    padding-bottom: 10px;
  }

  // RESULTS ADDITIONS
  .ReactVirtualized__Grid__innerScrollContainer {
    display: flex;
    flex-wrap: wrap;
  }

  .Table {
    width: 100%;
    margin-top: 15px;
  }

  .headerRow {
    background-color: ${props => props.theme.button};
    border-bottom: 1px solid #e0e0e0;
    pading: 58px;
    color: white;
    padding: 25px;
    font-weight: 400;
    display: flex;
  }

  .evenRow,
  .oddRow {
    border-bottom: 1px solid #e0e0e0;
    display: flex;
  }

  .oddRow {
    background-color: #fafafa;
  }

  .headerColumn {
    text-transform: none;
  }

  .collapse-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .collapser {
    cursor: pointer;
  }

  .collapse-title {
    font-weight: 700;
  }
`;

export const ThemedSearchContainer = withTheme(SearchContainer);

export const TextFieldToggle = styled.div`
  color: white;
  font-size: 28px;
  font-weight: 400;
  margin-right: 5px;
`;

export const PresearchFilter = styled.div`
  margin-left: 5px;
  //presearch-style fix
  // max-height: 30px;
`;

export const PresearchContainer = styled.div`
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: flex-start;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    max-height: 1500px;
  }
  span {
    display: contents;
  }
  .horizontal-pre {
    display: flex;
    flex-wrap: wrap;
  }

  .vertical-pre {
    display: flex;
    flex-direction: column;
  }

  .horizontal-pre-button {
    margin-top: 10px;
    width: 200px;
  }
`;

export const PresearchContent = styled.div`
  padding-left: 5px;
  padding-right: 5px;
  // border-bottom-left-radius: 12px;
  // border-bottom-right-radius: 12px;
  background-color: white;
  max-height: 260px;
  margin-bottom: 7px;
  overflow-Y: scroll;
  display: flex;
  flex-direction: column;
`;

export const PresearchPanel = styled.div`
  overflow-x: auto;
  margin-left: 5px;
  // margin-top: 30px;
  position: relative;
    .dropDownFacet{
      position: relative;
    }
`;


export default ThemedButton;


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

`;export const StyledProfileLogValue = styled.div`
  font-size: 1em;
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
const FacetAgg = styled.div`
  min-height: 50px;
  border-bottom: 1px solid #3d3d3d;
  width: 100%;
  margin: 0;
  position: relative;
  color: ${props => props.theme.aggSideBar.sideBarFont};
 
`
export const ThemedFacetAgg= withTheme(FacetAgg)
const FacetTitle = styled.div`
  font-size: 16px;
  color: ${props => props.theme.aggSideBar.sideBarFont};
  padding: 0px 10px;
  
`;
export const ThemedFacetTitle = withTheme(FacetTitle)
const FacetHeader = styled.div`

  color: ${props => props.theme.aggSideBar.sideBarFont};
  padding: 0px 10px;
  display: inline-block;
  height: 100%;
  width: 100%;
  padding: 4px 12px;
  vertical-align: middle;
  font-size: 16px;
  margin-top:10px;


  .select-box--arrow{
    width: 30px;
    height: 30px;
    margin: 0;
    padding: 15px 3px;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

export const ThemedFacetHeader = withTheme(FacetHeader);