import * as React from 'react';
import styled from 'styled-components';
import { Mutation, MutationFn } from 'react-apollo';
import { gql } from 'apollo-boost';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import { UpdatePasswordMutation, UpdatePasswordMutationVariables } from 'types/UpdatePasswordMutation';
import ThemedButton from '../../components/StyledComponents';
import { Link } from 'react-router-dom';
import { History } from 'history';
import StyledError from './StyledError';
import StyledWrapper from './StyledWrapper';
import { setLocalJwt } from 'utils/localStorage';
import { omit } from 'ramda';

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      jwt
      errors
    }
  }
`;

interface PasswordResetProps {
  history: History;
}

interface PasswordResetState {
  form: {
    // email: string;
    password: string;
    passwordConfirmation: string
  };
  resetPasswordToken: string;

  errors: string[];
}


class UpdatePasswordMutationComponent extends Mutation<
UpdatePasswordMutation, UpdatePasswordMutationVariables
> {}
type UpdatePasswordMutationFn = MutationFn<UpdatePasswordMutation, UpdatePasswordMutationVariables>;

class PasswordReset extends React.Component<
  PasswordResetProps,
  PasswordResetState
> {
  state: PasswordResetState = {
    form: {
      password: '',
      passwordConfirmation: '',
    },
    resetPasswordToken: '',
    errors: [],
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };

  getResetToken = () => {
    let token = new URLSearchParams(this.props.history.location.search).getAll(
      'reset_password_token'
    );
    console.log(token.toString());
    this.setState({
      //@ts-ignore
      resetPasswordToken: token.toString()
    })
   
    return token.toString();
  } 

  componentDidMount(){
    this.getResetToken();
  }

  // handleSignUp = (signUp: SignUpMutationFn) => () => {
  //   if (this.state.form.password === this.state.form.passwordConfirmation) {


  handleResetSubmit = (updatePassword: UpdatePasswordMutationFn) => {
    const { password, passwordConfirmation } = this.state.form;
    
    if (password !== passwordConfirmation) {
      console.log(password, passwordConfirmation);
      alert('passwords do not match');
    }
    if (passwordConfirmation.length < 8) {
      console.log(passwordConfirmation);
      alert('password needs to be 8 characters');
    } else {

      const resetPasswordToken = this.state.resetPasswordToken
      const input = {
        resetPasswordToken, 
        password: this.state.form.password,
        passwordConfirmation: this.state.form.passwordConfirmation
      }
    
      updatePassword({ variables: { input } });
      // this.props.history.push('/sign_in');
    }
  };

  render() {
    return (
      <StyledWrapper>
        <StyledContainer>
          {/* <StyledFormControl
            name="email"
            type="email"
            placeholder="Email"
            value={this.state.form.email}
            onChange={this.handleInputChange}
          /> */}
          <StyledFormControl
            name="password"
            type="password"
            placeholder="New Password"
            value={this.state.form.password}
            onChange={this.handleInputChange}
          />
          <StyledFormControl
            name="passwordConfirmation"
            type="password"
            placeholder="Confirm New Password"
            value={this.state.form.passwordConfirmation}
            onChange={this.handleInputChange}
          />
            <UpdatePasswordMutationComponent
              mutation={UPDATE_PASSWORD_MUTATION}
              // onCompleted={this.handleUpdatePasswordCompleted}
              // update={(cache, { data }) => {
              //   const user = data && data.updatePassword && data.updatePassword.user;
              //   if (user) {
              //     cache.writeQuery({
              //       query: CurrentUser.query,
              //       data: {
              //         me: user,
              //       },
              //     });
              //     return;
              //   }
              // }}
              >
              {updatePassword => (
          <ThemedButton onClick={() => this.handleResetSubmit(updatePassword)}>Submit</ThemedButton>
          )}
          </UpdatePasswordMutationComponent>
        </StyledContainer>
      </StyledWrapper>
    );
  }
}

export default PasswordReset;
