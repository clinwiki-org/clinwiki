import React,{useState} from 'react';
import {useDispatch} from 'react-redux';
import {updatePassword} from 'services/user/actions';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { gql, MutationFunction }  from '@apollo/client';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import ThemedButton from '../../components/StyledComponents';
import StyledWrapper from './StyledWrapper';
import StyledError from './StyledError';

const UpdatePassword = (props) => {
  const dispatch = useDispatch();
  const [password,setPassword] = useState('');
  const [passwordConfirmation,setPasswordConfirmation] = useState('');
  const [error,setError] = useState('');

  const  handleResetSubmit = () => {

    if (password !== passwordConfirmation) {
      alert('passwords do not match');
    }
    if (passwordConfirmation.length < 8) {
      alert('password needs to be 8 characters');
    } 
    else {
      let token = new URLSearchParams(props.history.location.search).getAll(
        'reset_password_token'
      );
      const resetPasswordToken = token.toString();
      dispatch(updatePassword( resetPasswordToken, password, passwordConfirmation))
    }
  };


  return (
    <StyledWrapper>
    <StyledContainer>
      <StyledFormControl
        name="password"
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <StyledFormControl
        name="passwordConfirmation"
        type="password"
        placeholder="Confirm New Password"
        value={passwordConfirmation}
        onChange={(ev) => setPasswordConfirmation(ev.target.value)}
      />
      <ThemedButton
        onClick={handleResetSubmit}>
        Submit
      </ThemedButton>
    </StyledContainer>
  </StyledWrapper>
  );
}

export default UpdatePassword;
