import * as React from 'react';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import ThemedButton from '../../components/StyledComponents';
import { Link } from 'react-router-dom';
import { History } from 'history';
import StyledError from './StyledError';
import StyledWrapper from './StyledWrapper';
import {resetPassword} from 'services/user/actions';
import { connect } from 'react-redux';
// import RESET_PASSWORD_QUERY from 'queries/CrumbsSearchPageAggBucketsQuery'

interface ResetPasswordPageProps {
  history: History;
  resetPassword: any;
}
interface ResetPasswordPageState {
  form: {
    email: string;
  };
  errors: string[];
}



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

  handleResetPassword = () => () => {

    this.props.resetPassword({ variables: { input: this.state.form } })

      // this.setState({
      //   errors: ['Password reset instructions have been sent to your email.'],
      // })

      // this.setState({
      //   errors: ['Instructions have been sent to your email'],
      // });

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
            {/* <ResetPasswordMutationComponent
              mutation={RESET_PASSWORD_MUTATION}
              update={(cache, { data }) => {
                if (data && data.resetPassword && data.resetPassword.success) {
                  this.setState({
                    errors: ['Instructions have been sent to your email'],
                  });
                }
              }}>
              {resetPassword => ( */}
                <ThemedButton onClick={this.handleResetPassword()}>
                  Send Instructions
                </ThemedButton>
              {/* )} */}
            {/* </ResetPasswordMutationComponent> */}
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

const mapDispatchToProps = (dispatch) => ({
  // upsertLabelMutation: (variables?) => dispatch(upsertLabelMutation(variables.nctId, variables.key, variables.value)),
  resetPassword: (variables) => dispatch(resetPassword(variables))
})



export default connect(null, mapDispatchToProps)(ResetPasswordPage);
