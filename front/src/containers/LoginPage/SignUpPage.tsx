import React,{useState} from 'react';
import {useDispatch} from 'react-redux';
import {signUp} from 'services/user/actions';
import { Col } from 'react-bootstrap';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { gql, MutationFunction }  from '@apollo/client';
import { SignUpMutation, SignUpMutationVariables } from 'types/SignUpMutation';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import { ThemedButton } from './StyledButton';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { setLocalJwt } from 'utils/localStorage';
import CurrentUser from 'containers/CurrentUser';
import StyledError from './StyledError';
import { omit } from 'ramda';
import StyledWrapper from './StyledWrapper';
import { GoogleLogin } from 'react-google-login';
import { ThemedLinkContainer } from '../../components/StyledComponents';

/*
interface SignUpPageProps {
  history: History;
}
interface SignUpPageState {
  form: {
    email: string;
    password?: string;
    passwordConfirmation?: string;
    oAuthToken?: string;
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

const SignUpMutationComponent = (
  props: MutationComponentOptions<SignUpMutation, SignUpMutationVariables>
) => Mutation(props);
type SignUpMutationFn = MutationFunction<
  SignUpMutation,
  SignUpMutationVariables
>;

class SignUpPageOld extends React.Component<SignUpPageProps, SignUpPageState> {
  state: SignUpPageState = {
    form: {
      email: '',
      password: '',
      passwordConfirmation: '',
      oAuthToken: '',
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
      const input = omit(
        ['passwordConfirmation', 'oAuthToken'],
        this.state.form
      );
      signUp({ variables: { input } });
    }else{
      this.setState({ errors: ["Password confirmation doesn't match"] });
    }
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

  responseGoogle = (response, signUp?) => {
    // const form= {
    //   email: response.profileObj.email
    // }
    this.setState(
      {
        form: {
          ...this.state.form,
          email: response.profileObj.email,
          oAuthToken: response.tokenObj.id_token,
        },
      },
      () => {
        const input = omit(['passwordConfirmation'], this.state.form);
        signUp({ variables: { input } });
      }
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
                <div>
                  <ThemedButton onClick={this.handleSignUp(signUp)}>
                    Sign Up
                  </ThemedButton>
                  <div style={{ display: 'block', marginTop: 10 }}>
                    <GoogleLogin
                      clientId="933663888104-i89sklp2rsnb5g69r7jvvoetrlq52jnj.apps.googleusercontent.com"
                      buttonText="Sign Up With Google?"
                      onSuccess={response =>
                        this.responseGoogle(response, signUp)
                      }
                      onFailure={this.responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                  </div>
                </div>
              )}
            </SignUpMutationComponent>

            {this.renderErrors()}
            <ThemedLinkContainer>
              <Link to="/sign_in">Sign In</Link>
              <Link to="/reset_password">Reset password</Link>
            </ThemedLinkContainer>
          </StyledContainer>
        </Col>
      </StyledWrapper>
    );
  }
}
*/

const SignUpPage = (props) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [passwordConfirmation,setPasswordConfirmation] = useState('');
  const [oAuthToken,setOAuthToken] = useState('');
  const [error,setError] = useState('');
  const dispatch = useDispatch();

  const handleSignUp = () => {
    if (password === passwordConfirmation) {
      dispatch(signUp(email,password,oAuthToken));
    }
    else {
      setError("Password confirmation doesn't match");
    }
  };

  const responseGoogle = (response) => {
    setEmail(response.profileObj.email);
    setOAuthToken(response.tokenObj.id_token);
    dispatch(signUp(email,password,oAuthToken));
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
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <StyledFormControl
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <StyledFormControl
          name="passwordConfirmation"
          type="password"
          placeholder="Password confirmation"
          value={passwordConfirmation}
          onChange={(ev) => setPasswordConfirmation(ev.target.value)}
        />

            <div>
              <ThemedButton onClick={handleSignUp}>
                Sign Up
              </ThemedButton>
              <div style={{ display: 'block', marginTop: 10 }}>
                <GoogleLogin
                  clientId="933663888104-i89sklp2rsnb5g69r7jvvoetrlq52jnj.apps.googleusercontent.com"
                  buttonText="Sign Up With Google?"
                  onSuccess={response =>
                    responseGoogle(response)
                  }
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
              </div>
            </div>

        <ThemedLinkContainer>
          <Link to="/sign_in">Sign In</Link>
          <Link to="/reset_password">Reset password</Link>
        </ThemedLinkContainer>
      </StyledContainer>
    </Col>
  </StyledWrapper>    
  );
}

export default SignUpPage;
