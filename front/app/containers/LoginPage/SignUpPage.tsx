import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { Mutation, MutationFn } from 'react-apollo';
import { gql } from 'apollo-boost';
import { SignUpMutation, SignUpMutationVariables } from 'types/SignUpMutation';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import StyledButton from './StyledButton';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { setLocalJwt } from 'utils/localStorage';
import CurrentUser from 'containers/CurrentUser';
import StyledError from './StyledError';
import { omit } from 'ramda';
import StyledWrapper from './StyledWrapper';

interface SignUpPageProps {
  history: History;
}
interface SignUpPageState {
  form: {
    email: string;
    password: string;
    passwordConfirmation: string;
  };
  errors: string[];
}

const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      jwt
      errors
      user {
        ...UserFragment
      }
    }
  }

  ${CurrentUser.fragment}
`;

class SignUpMutationComponent extends Mutation<
  SignUpMutation,
  SignUpMutationVariables
> {}
type SignUpMutationFn = MutationFn<SignUpMutation, SignUpMutationVariables>;

const LinkContainer = styled.div`
  position: absolute;
  bottom: 30px;
  a {
    color: white;
    margin-right: 15px;
  }
`;

class SignUpPage extends React.Component<SignUpPageProps, SignUpPageState> {
  state: SignUpPageState = {
    form: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    errors: [],
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };

  handleSignUp = (signUp: SignUpMutationFn) => () => {
    if (this.state.form.password === this.state.form.passwordConfirmation) {
      const input = omit(['passwordConfirmation'], this.state.form);
      signUp({ variables: { input } });
    }
    this.setState({ errors: ["Password confirmation doesn't match"] });
  };

  handleSignUpCompleted = (data: SignUpMutation) => {
    const jwt = data && data.signUp && data.signUp.jwt;
    if (!jwt) return;

    setLocalJwt(jwt);
    this.props.history.push('/');
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
            <StyledFormControl
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.form.password}
              onChange={this.handleInputChange}
            />
            <StyledFormControl
              name="passwordConfirmation"
              type="password"
              placeholder="Password confirmation"
              value={this.state.form.passwordConfirmation}
              onChange={this.handleInputChange}
            />

            <SignUpMutationComponent
              mutation={SIGN_UP_MUTATION}
              onCompleted={this.handleSignUpCompleted}
              update={(cache, { data }) => {
                const user = data && data.signUp && data.signUp.user;
                if (user) {
                  cache.writeQuery({
                    query: CurrentUser.query,
                    data: {
                      me: user,
                    },
                  });
                  return;
                }

                this.setState({
                  errors: (data && data.signUp && data.signUp.errors) || [],
                });
              }}>
              {signUp => (
                <StyledButton onClick={this.handleSignUp(signUp)}>
                  Sign Up
                </StyledButton>
              )}
            </SignUpMutationComponent>
            {this.renderErrors()}
            <LinkContainer>
              <Link to="/sign_in">Sign In</Link>
              <Link to="/reset_password">Reset password</Link>
            </LinkContainer>
          </StyledContainer>
        </Col>
      </StyledWrapper>
    );
  }
}

export default SignUpPage;
