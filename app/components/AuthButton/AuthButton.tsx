import * as React from 'react';
import styled from 'styled-components';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { History } from 'history';
import { logout } from 'utils/auth';
import { Link } from 'react-router-dom';

interface AuthButtonProps {
  user: {
    email: string;
  } | null;
  history: History;
}

const ButtonWrapper = styled.div`
  margin-top: 7px;
`;

const StyledLink = styled(Link)`
  color: white !important;
  text-decoration: none !important;
`;

class AuthButton extends React.PureComponent<AuthButtonProps> {
  handleSitesClick = () => {
    this.props.history.push('/sites');
  };

  handleProfileClick = () => {
    this.props.history.push('/profile');
  };

  handleSignOutClick = () => {
    logout(this.props.history);
  };

  render() {
    if (!this.props.user) {
      return (
        <ButtonWrapper className="pull-right">
          <Button className="pull-right" style={{ marginRight: 10 }}>
            <StyledLink to="/sign_in">Sign in</StyledLink>
          </Button>
        </ButtonWrapper>
      );
    }
    return (
      <ButtonWrapper className="pull-right">
        <DropdownButton
          title={(this.props.user && this.props.user.email) || ''}
          id="loggedIn"
        >
          <MenuItem onClick={this.handleSitesClick}>Sites</MenuItem>
          <MenuItem onClick={this.handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={this.handleSignOutClick}>Log Out</MenuItem>
        </DropdownButton>
      </ButtonWrapper>
    );
  }
}

export default AuthButton;
