import * as React from 'react';
import styled from 'styled-components';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { History } from 'history';
import { logout } from 'utils/auth';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

interface AuthButtonProps {
  user: {
    email: string;
    roles: string[];
  } | null;
  history: History;
  theme: Theme;
}

const ButtonWrapper = styled.div`
  margin-top: 7px;
  background: ${props => props.theme.authButton.button} !important;
  color: ${props => props.theme.authButton.buttonFont};
  border-radius: 4px;
  &:hover {
    background: ${props => props.theme.authButton.buttonHover};
    border-color: ${props => props.theme.authButton.buttonBorderHover};
    text-decoration: none;
  }
`;

const SignInWrapper = styled.a`
  background: ${props => props.theme.authButton.button};
  color: ${props => props.theme.authButton.buttonFont};
  border: 0px;
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  border-radius: 4px;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background: ${props => props.theme.authButton.buttonHover};
    border-color: ${props => props.theme.authButton.buttonBorderHover};
    text-decoration: none;
  }
`;

const ThemedButtonWrapper = withTheme(ButtonWrapper);
const ThemedSignInWrapper = withTheme(SignInWrapper);

class AuthButton extends React.PureComponent<AuthButtonProps> {
  handleSitesClick = () => {
    this.props.history.push('/sites');
  };

  handleProfileClick = () => {
    this.props.history.push('/profile');
  };

  handleWorkflowsClick = () => {
    this.props.history.push('/workflows');
  };

  handleSignInClick = () => {
    this.props.history.push('/sign_in');
  };

  handleSignOutClick = () => {
    logout(this.props.history);
  };

  render() {
    if (!this.props.user) {
      return (
        <li>
          <p className="navbar-btn">
            <ThemedSignInWrapper href="/sign_in">Sign in</ThemedSignInWrapper>
          </p>
        </li>
      );
    }
    const t = this.props.theme;
    return (
      <ThemedButtonWrapper className="pull-right">
        <DropdownButton
          style={{
            background: this.props.theme.authButton.button,
            color: this.props.theme.authButton.buttonFont,
            borderRadius: '4px',
          }}
          title={(this.props.user && this.props.user.email) || ''}
          id="loggedIn">
          <MenuItem onClick={this.handleSitesClick}>Sites</MenuItem>
          {this.props.user && this.props.user.roles.includes('admin') && (
            <MenuItem onClick={this.handleWorkflowsClick}>Workflows</MenuItem>
          )}
          <MenuItem onClick={this.handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={this.handleSignOutClick}>Log Out</MenuItem>
        </DropdownButton>
      </ThemedButtonWrapper>
    );
  }
}

export default withTheme(AuthButton);
