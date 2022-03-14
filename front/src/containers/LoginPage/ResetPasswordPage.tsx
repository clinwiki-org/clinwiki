import React, { useState } from 'react';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import ThemedButton from '../../components/StyledComponents';
import { Link } from 'react-router-dom';
import { History } from 'history';
import StyledWrapper from './StyledWrapper';
import {resetPassword} from 'services/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import useUrlParams from 'utils/UrlParamsProvider';
import { RootState } from 'reducers';

interface ResetPasswordPageProps {
  history: History;
  resetPassword: any;
}

const LinkContainer = styled.div`
  position: absolute;
  bottom: 30px;
  a {
    color: white;
    margin-right: 15px;
  }
`;
export default function ResetPasswordPage (props: ResetPasswordPageProps)

 {
   const [email, setEmail] = useState('');
   const dispatch = useDispatch();
   const userMessage = useSelector((state: RootState) => state.user.message);


const   handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value)
  };

  const handleResetPassword = ()  => {
    dispatch(resetPassword(email));

  };

  const renderMessage = () => {
    if (!userMessage) return
    return (
      <div style={{ marginTop: 20 }}>
        {userMessage}
      </div>
    );
  };

    return (
      <StyledWrapper>
        <Col md={12}>
          <StyledContainer>
            <StyledFormControl
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleInputChange}
            />
                <ThemedButton onClick={()=>handleResetPassword()}>
                  Send Instructions
                </ThemedButton>
                {renderMessage()}
            <LinkContainer>
              <Link to="/sign_in">Sign in</Link>
              <Link to="/sign_up">Sign up</Link>
            </LinkContainer>
          </StyledContainer>
        </Col>
      </StyledWrapper>
    );
  }