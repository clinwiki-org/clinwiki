import * as React from 'react';
import styled from 'styled-components';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { History } from 'history';
import { logout } from 'utils/auth';
import { Link } from 'react-router-dom';

interface AuthButtonProps {
  user: {
    email: string;
    roles: string[];
  } | null;
  history: History;
}

const ButtonWrapper = styled.div`
  margin-top: 7px;
`;

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
            <Link to="/sign_in" className="btn btn-default">
              Sign in
            </Link>
          </p>
        </li>
      );
    }
    return (
      <ButtonWrapper className="pull-right">
        <DropdownButton
          title={(this.props.user && this.props.user.email) || ''}
          id="loggedIn">
          <MenuItem onClick={this.handleSitesClick}>Sites</MenuItem>
          {this.props.user && this.props.user.roles.includes('admin') && (
            <MenuItem onClick={this.handleWorkflowsClick}>Workflows</MenuItem>
          )}
          <MenuItem onClick={this.handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={this.handleSignOutClick}>Log Out</MenuItem>
        </DropdownButton>
      </ButtonWrapper>
    );
  }
}

export default AuthButton;
