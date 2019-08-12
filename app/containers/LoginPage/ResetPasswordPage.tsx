import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { Mutation, MutationFn } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from 'types/ResetPasswordMutation';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import StyledButton from './StyledButton';
import { Link } from 'react-router-dom';
import { History } from 'history';
import StyledError from './StyledError';
import StyledWrapper from './StyledWrapper';

interface ResetPasswordPageProps {
  history: History;
}
interface ResetPasswordPageState {
  form: {
    email: string;
  };
  errors: string[];
}

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
    }
  }
`;

class ResetPasswordMutationComponent extends Mutation<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
> {}
type ResetPasswordMutationFn = MutationFn<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>;

const LinkContainer = styled.div`
  position: absolute;
  bottom: 30px;
  a {
    color: white;
    margin-right: 15px;
  }
`;

class ResetPasswordPage extends React.Component<
  ResetPasswordPageProps,
  ResetPasswordPageState
> {
  state: ResetPasswordPageState = {
    form: {
      email: '',
    },
    errors: [],
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };

  handleResetPassword = (resetPassword: ResetPasswordMutationFn) => () => {
    resetPassword({ variables: { input: this.state.form } }).then(() =>
      this.setState({
        errors: ['Password reset instructions have been sent to your email.'],
      }),
    );
  };

  renderErrors = () => {
    return (
      <div style={{ marginTop: 20 }}>
        {this.state.errors.map(error => (
          <StyledError key={error}>{error}</StyledError>
        ))}
      </div>
    );
  };

  render() {
    return (
      <StyledWrapper>
        <Col md={12}>
          <StyledContainer>
            <StyledFormControl
              name="email"
              type="email"
              placeholder="Email"
              value={this.state.form.email}
              onChange={this.handleInputChange}
            />
            <ResetPasswordMutationComponent
              mutation={RESET_PASSWORD_MUTATION}
              update={(cache, { data }) => {
                if (data && data.resetPassword && data.resetPassword.success) {
                  this.setState({
                    errors: ['Instructions have been sent to your email'],
                  });
                }
              }}
            >
              {resetPassword => (
                <StyledButton onClick={this.handleResetPassword(resetPassword)}>
                  Send Instructions
                </StyledButton>
              )}
            </ResetPasswordMutationComponent>
            {this.renderErrors()}
            <LinkContainer>
              <Link to="/sign_in">Sign in</Link>
              <Link to="/sign_up">Sign up</Link>
            </LinkContainer>
          </StyledContainer>
        </Col>
      </StyledWrapper>
    );
  }
}

export default ResetPasswordPage;
