import * as React from 'react';
import styled from 'styled-components';
import { Mutation, MutationFn } from 'react-apollo';
import { gql } from 'apollo-boost';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import ThemedButton from '../../components/StyledComponents';
import { Link } from 'react-router-dom';
import { History } from 'history';
import StyledError from './StyledError';
import StyledWrapper from './StyledWrapper';

interface PasswordResetProps {
  history: History;
}

interface PasswordResetState {
  form: {
    // email: string;
    password: string;
    confirmPassword: string;
  };

  errors: string[];
}

class PasswordReset extends React.Component<
  PasswordResetProps,
  PasswordResetState
> {
  state: PasswordResetState = {
    form: {
      // email: '',
      password: '',
      confirmPassword: '',
    },
    errors: [],
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };

  handleResetSubmit = () => {
    const { password, confirmPassword } = this.state.form;
    if (password !== confirmPassword) {
      console.log(password, confirmPassword);
      alert('passwords do not match');
    }
    if (confirmPassword.length < 8) {
      console.log(confirmPassword);
      alert('password needs to be 8 characters');
    } else {
      this.setState({
        form: {
          // email: '',
          password: '',
          confirmPassword: '',
        },
      });
      this.props.history.push('/sign_in');
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
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={this.state.form.confirmPassword}
            onChange={this.handleInputChange}
          />
          <ThemedButton onClick={this.handleResetSubmit}>Submit</ThemedButton>
        </StyledContainer>
      </StyledWrapper>
    );
  }
}

export default PasswordReset;
