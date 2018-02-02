/**
*
* AuthButton
*
*/

import React from 'react';
import styled from 'styled-components';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

const ButtonWrapper = styled.div`
  margin-top: 7px;
`;

const AuthButton = (props) => {
  if (!props.user.loggedIn) {
    return (
      <ButtonWrapper className="pull-right">
        <Button className="pull-right" href="/login-signup" style={{ marginRight: '10px' }}>Login | Signup</Button>
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper className="pull-right">
      <DropdownButton title={(props.user && props.user.email) || ''} id="loggedIn">
        <MenuItem onClick={() => props.router.push('/profile')}>Profile</MenuItem>
        <MenuItem onClick={() => props.router.push('/logout')}>Log Out</MenuItem>
      </DropdownButton>
    </ButtonWrapper>
  );
};

AuthButton.propTypes = {
  user: React.PropTypes.object,
  router: React.PropTypes.object,
};

export default AuthButton;
