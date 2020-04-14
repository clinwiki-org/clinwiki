import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { Mutation, MutationFn } from 'react-apollo';
import { gql } from 'apollo-boost';
import { SignInMutation, SignInMutationVariables } from 'types/SignInMutation';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import StyledButton from './StyledButton';
import { Link } from 'react-router-dom';
import { History, Location } from 'history';
import { setLocalJwt } from 'utils/localStorage';
import CurrentUser from 'containers/CurrentUser';
import StyledError from './StyledError';
import { omit } from 'ramda';
import StyledWrapper from './StyledWrapper';
import { GoogleLogin } from 'react-google-login';

interface SignInPageProps {
  history: History;
  location: Location;
}
interface SignInPageState {
  form: {
    email: string;
    password?: string;
    oAuthToken?: string;
  };
  errors: string[];
}

const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      jwt
      user {
        ...UserFragment
      }
    }
  }
  ${CurrentUser.fragment}
`;

class SignInMutationComponent extends Mutation<
  SignInMutation,
  SignInMutationVariables
> {}
type SignInMutationFn = MutationFn<SignInMutation, SignInMutationVariables>;

const LinkContainer = styled.div`
  position: absolute;
  bottom: 30px;
  a {
    color: white;
    margin-right: 15px;
  }
`;

class SignInPage extends React.Component<SignInPageProps, SignInPageState> {
  state: SignInPageState = {
    form: {
      email: '',
      password: '',
      //@ts-ignore
      oAuthToken: '',
    },
    errors: [],
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };

  handleSignIn = (signIn: SignInMutationFn) => () => {
    const input = omit(['oAuthToken'], this.state.form);
    //@ts-ignore
    signIn({ variables: { input: this.state.form } });
  };

  handleSignInCompleted = (data: SignInMutation) => {
    const jwt = data && data.signIn && data.signIn.jwt;
    if (!jwt) return;

    setLocalJwt(jwt);
    this.props.history.goBack();
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

  responseGoogle = (response, signIn) => {
    // const form= {
    //   email: response.profileObj.email
    // }
    this.setState(
      {
        form: {
          ...this.state.form,
          email: response.profileObj.email,
          //@ts-ignore
          oAuthToken: response.tokenObj.id_token,
        },
      },
      () => {
        const input = this.state.form;
        signIn({ variables: { input: this.state.form } });
      }
    );
  };

  render() {
    return (
      <StyledWrapper>
        <Col md={12}>
          <StyledContainer>
            <SignInMutationComponent
              mutation={SIGN_IN_MUTATION}
              onCompleted={this.handleSignInCompleted}
              update={(cache, { data }) => {
                const user = data && data.signIn && data.signIn.user;
                if (user) {
                  cache.writeQuery({
                    query: CurrentUser.query,
                    data: {
                      me: user,
                    },
                  });
                  return;
                }
                this.setState({ errors: ['Invalid email or password'] });
              }}>
              {signIn => (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    this.handleSignIn(signIn);
                  }}>
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

                  <div>
                    <StyledButton
                      type="submit"
                      onClick={this.handleSignIn(signIn)}>
                      Sign In
                    </StyledButton>
                    <div style={{ display: 'block', marginTop: 10 }}>
                      <GoogleLogin
                        clientId="933663888104-i89sklp2rsnb5g69r7jvvoetrlq52jnj.apps.googleusercontent.com"
                        buttonText="Sign in With Google"
                        //@ts-ignore
                        onSuccess={response =>
                          this.responseGoogle(response, signIn)
                        }
                        //@ts-ignore
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </div>
                  </div>
                  {this.renderErrors()}
                  <LinkContainer>
                    <Link to="/sign_up">Sign up</Link>
                    <Link to="/reset_password">Reset password</Link>
                  </LinkContainer>
                </form>
              )}
            </SignInMutationComponent>
          </StyledContainer>
        </Col>
      </StyledWrapper>
    );
  }
}

export default SignInPage;
