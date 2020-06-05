import * as React from 'react';
import {
  Mutation,
  MutationFunction,
  MutationComponentOptions,
} from 'react-apollo';
import { gql } from 'apollo-boost';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import {
  UpdatePasswordMutation,
  UpdatePasswordMutationVariables,
} from 'types/UpdatePasswordMutation';
import ThemedButton from '../../components/StyledComponents';
import { History } from 'history';
import StyledWrapper from './StyledWrapper';
import { setLocalJwt } from 'utils/localStorage';
import StyledError from './StyledError';
import CurrentUser from 'containers/CurrentUser';

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      jwt
      errors
      user {
        ...UserFragment
      }
    }
  }
  ${CurrentUser.fragment}
`;

interface UpdatePasswordProps {
  history: History;
}

interface UpdatePasswordState {
  form: {
    // email: string;
    password: string;
    passwordConfirmation: string;
  };
  resetPasswordToken: string;

  errors: string[];
}

const UpdatePasswordMutationComponent = (
  props: MutationComponentOptions<
    UpdatePasswordMutation,
    UpdatePasswordMutationVariables
  >
) => Mutation(props);

type UpdatePasswordMutationFn = MutationFunction<
  UpdatePasswordMutation,
  UpdatePasswordMutationVariables
>;

class UpdatePassword extends React.Component<
  UpdatePasswordProps,
  UpdatePasswordState
> {
  state: UpdatePasswordState = {
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
    this.setState({
      resetPasswordToken: token.toString(),
    });

    return token.toString();
  };

  componentDidMount() {
    this.getResetToken();
  }

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
      const resetPasswordToken = this.state.resetPasswordToken;
      const input = {
        resetPasswordToken,
        password: this.state.form.password,
        passwordConfirmation: this.state.form.passwordConfirmation,
      };

      updatePassword({ variables: { input } });
      // this.props.history.push('/sign_in');
    }
  };

  handleUpdatePasswordCompleted = (data: UpdatePasswordMutation) => {
    const jwt = data && data.updatePassword && data.updatePassword.jwt;
    if (!jwt) {
      const errors = JSON.parse(data.updatePassword!.errors);
      this.setState({ errors });
      return;
    }

    setLocalJwt(jwt);
    this.props.history.push('/search');
  };

  render() {
    return (
      <StyledWrapper>
        <StyledContainer>
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
            onCompleted={this.handleUpdatePasswordCompleted}
            update={(cache, { data }) => {
              const user =
                data && data.updatePassword && data.updatePassword.user;
              if (user) {
                cache.writeQuery({
                  query: CurrentUser.query,
                  data: {
                    me: user,
                  },
                });
                return;
              }
              this.setState({ errors: ['Invalid new password'] });
            }}>
            {updatePassword => (
              <ThemedButton
                onClick={() => this.handleResetSubmit(updatePassword)}>
                Submit
              </ThemedButton>
            )}
          </UpdatePasswordMutationComponent>
          {this.state.errors.map(error => (
            <StyledError>{error}</StyledError>
          ))}
        </StyledContainer>
      </StyledWrapper>
    );
  }
}

export default UpdatePassword;
