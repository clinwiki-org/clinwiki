import styled from 'styled-components';
import withTheme from '../../containers/ThemeProvider';

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

const PresearchCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme.buttonSecondary};

  margin: 10px;
  flex: 1;
  // height: 310px;
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
