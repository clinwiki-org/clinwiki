import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {RootState} from 'reducers';
import {signUp} from 'services/user/actions';
//import {signUp} from '../../../../api/src/users/user.api';
import { Col } from 'react-bootstrap';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import { ThemedButton } from './StyledButton';
import { Link } from 'react-router-dom';
import StyledError from './StyledError';
import { omit } from 'ramda';
import StyledWrapper from './StyledWrapper';
import { GoogleLogin } from 'react-google-login';
import { ThemedLinkContainer } from '../../components/StyledComponents';

const SignUpPage = (props) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [passwordConfirmation,setPasswordConfirmation] = useState('');
  const [oAuthToken,setOAuthToken] = useState('');
  const [error,setError] = useState('');
  const dispatch = useDispatch();
  const signUpErrors = useSelector( (state:RootState) => state.user.signUpErrors);

  const handleSignUp = () => {
      console.log(oAuthToken);
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
            <div style={{ marginTop: 20}}>
                {signUpErrors.map( error => <StyledError key={error}>{error}</StyledError>)}
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
