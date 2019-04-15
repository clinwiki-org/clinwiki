import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { Mutation, MutationFn } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from 'types/EditProfileMutation';
import StyledFormControl from './StyledFormControl';
import StyledContainer from './StyledContainer';
import StyledButton from './StyledButton';
import { Link } from 'react-router-dom';
import { History } from 'history';
import StyledError from './StyledError';
import CurrentUser from 'containers/CurrentUser';
import { UserFragment } from 'types/UserFragment';
import { equals, pick } from 'ramda';

interface EditProfilePageProps {
  user: UserFragment | null;
  history: History;
}
interface EditProfilePageState {
  form: {
    firstName: string | null;
    lastName: string | null;
    defaultQueryString: string | null;
  };
  prevUser: UserFragment | null;
  errors: string[];
}

const EDIT_PROFILE_MUTATION = gql`
  mutation EditProfileMutation($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      errors
      user {
        ...UserFragment
      }
    }
  }

  ${CurrentUser.fragment}
`;

class EditProfileMutationComponent extends Mutation<
  EditProfileMutation,
  EditProfileMutationVariables
> {}
type EditProfileMutationFn = MutationFn<
  EditProfileMutation,
  EditProfileMutationVariables
>;

class EditProfilePage extends React.Component<
  EditProfilePageProps,
  EditProfilePageState
> {
  state: EditProfilePageState = {
    form: {
      firstName: null,
      lastName: null,
      defaultQueryString: null,
    },
    prevUser: null,
    errors: [],
  };

  static getDerivedStateFromProps = (
    props: EditProfilePageProps,
    state: EditProfilePageState,
  ): EditProfilePageState | null => {
    if (!equals(state.prevUser, props.user) && props.user != null) {
      return {
        ...state,
        form: {
          ...state.form,
          ...pick(['firstName', 'lastName', 'defaultQueryString'], props.user),
        },
        prevUser: props.user,
      };
    }

    return null;
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      form: { ...this.state.form, [e.target.name as any]: e.target.value },
    });
  };

  handleEditProfile = (editProfile: EditProfileMutationFn) => () => {
    editProfile({ variables: { input: this.state.form } });
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
      <Row>
        <Col md={12}>
          <StyledContainer>
            <StyledFormControl
              name="firstName"
              placeholder="First name"
              value={this.state.form.firstName}
              onChange={this.handleInputChange}
            />
            <StyledFormControl
              name="lastName"
              placeholder="Last name"
              value={this.state.form.lastName}
              onChange={this.handleInputChange}
            />
            <StyledFormControl
              name="defaultQueryString"
              placeholder="Default query string"
              value={this.state.form.defaultQueryString}
              onChange={this.handleInputChange}
            />

            <EditProfileMutationComponent
              mutation={EDIT_PROFILE_MUTATION}
              update={(cache, { data }) => {
                const user =
                  data && data.updateProfile && data.updateProfile.user;
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
                  errors:
                    (data && data.updateProfile && data.updateProfile.errors) ||
                    [],
                });
              }}
            >
              {editProfile => (
                <StyledButton onClick={this.handleEditProfile(editProfile)}>
                  Save
                </StyledButton>
              )}
            </EditProfileMutationComponent>
            {this.renderErrors()}
          </StyledContainer>
        </Col>
      </Row>
    );
  }
}

const CurrentUserWrapper = props => (
  <CurrentUser>
    {user => <EditProfilePage {...props} user={user} />}
  </CurrentUser>
);

export default CurrentUserWrapper;
