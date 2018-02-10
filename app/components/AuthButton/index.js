/**
*
* AuthButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import styled from 'styled-components';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

const ButtonWrapper = styled.div`
  margin-top: 7px;
`;

const AuthButton = (props) => {
  if (!props.user.loggedIn) {
    return (
      <ButtonWrapper className="pull-right">
        <Button className="pull-right" href="/login-signup">Login | Signup</Button>
      </ButtonWrapper>
    );
  }
  return (
    <ButtonWrapper className="pull-right">
      <DropdownButton title={(props.user && props.user.email) || ''} id="loggedIn">
        <MenuItem onClick={() => props.history.push('/profile')}>Profile</MenuItem>
        <MenuItem onClick={() => props.history.push('/logout')}>Log Out</MenuItem>
      </DropdownButton>
    </ButtonWrapper>
  );
};

AuthButton.propTypes = {
  user: PropTypes.object,
  history: ReactRouterPropTypes.history,
};

export default AuthButton;
