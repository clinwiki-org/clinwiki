import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { Mutation, MutationFn } from 'react-apollo';
import { gql } from 'apollo-boost';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from 'types/EditProfileMutation';
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import StyledError from './StyledError';
import CurrentUser from 'containers/CurrentUser';
import { UserFragment } from 'types/UserFragment';
import { equals, pick } from 'ramda';
import {
  ThemedMainContainer,
  SearchContainer,
  StyledProfileLabel,
  StyledProfileValue,
  StyledProfileForm,
} from 'components/StyledComponents';
import { ThemedButton } from './StyledButton';

interface EditProfilePageProps {
  user: UserFragment | null;
  history: History;
  location: Location;
  match: match;
}
interface EditProfilePageState {
  form: {
    firstName: string | null;
    lastName: string | null;
    defaultQueryString: string | null;
  };
  prevUser: UserFragment | null;
  errors: string[];
  isEditing: boolean;
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
    isEditing: false,
  };

  static getDerivedStateFromProps = (
    props: EditProfilePageProps,
    state: EditProfilePageState
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
  toggleEditProfile = () => {
    this.setState({ isEditing: !this.state.isEditing });
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
  renderEditForm = () => {
    return (
      <div>
        <span onClick={() => this.toggleEditProfile()}>X</span>

        <SearchContainer>
          <StyledProfileLabel>First Name:</StyledProfileLabel>
          <StyledProfileForm
            name="firstName"
            placeholder="First name"
            value={this.state.form.firstName}
            onChange={this.handleInputChange}
          />
          <StyledProfileLabel>Last Name:</StyledProfileLabel>

          <StyledProfileForm
            name="lastName"
            placeholder="Last name"
            value={this.state.form.lastName}
            onChange={this.handleInputChange}
          />
          <StyledProfileLabel>Default Query String:</StyledProfileLabel>

          <StyledProfileForm
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
            }}>
            {editProfile => (
              <ThemedButton onClick={this.handleEditProfile(editProfile)}>
                Save
              </ThemedButton>
            )}
          </EditProfileMutationComponent>
          {this.renderErrors()}
        </SearchContainer>
      </div>
    );
  };
  renderProfileInfo = () => {
    if (this.props.user) {
      return (
        <div>
          <span onClick={() => this.toggleEditProfile()}> Edit Profile</span>

          <SearchContainer>
            <StyledProfileLabel>First Name:</StyledProfileLabel>
            <StyledProfileValue>
              {' '}
              {this.props.user.firstName}
            </StyledProfileValue>
            <StyledProfileLabel>Last Name: </StyledProfileLabel>
            <StyledProfileValue>{this.props.user.lastName}</StyledProfileValue>
            <StyledProfileLabel>E-mail: </StyledProfileLabel>
            <StyledProfileValue>{this.props.user.email}</StyledProfileValue>
            <StyledProfileLabel>Default Query String: </StyledProfileLabel>
            <StyledProfileValue>
              {this.props.user.defaultQueryString || 'N/A'}
            </StyledProfileValue>
          </SearchContainer>
        </div>
      );
    }
  };
  render() {
    console.log('LOGGED IN USER', this.props.user);
    return (
      <ThemedMainContainer>
        {/* <Col md={12}> */}
        <h2>My profile</h2>
        {this.state.isEditing == true
          ? this.renderEditForm()
          : this.renderProfileInfo()}
        {/* </Col> */}
        <h2>My Contributions</h2>
        {this.props.user ? (
          <SearchPage
            history={this.props.history}
            location={this.props.location}
            match={this.props.match}
            email={this.props.user.email}
            //userId={this.props.match.params.id}
            //profileParams={this.getUserParams(this.props.match.params.id)}
          />
        ) : (
          <div>No User</div>
        )}
      </ThemedMainContainer>
    );
  }
}

const CurrentUserWrapper = props => (
  <CurrentUser>
    {user => <EditProfilePage {...props} user={user} />}
  </CurrentUser>
);

export default CurrentUserWrapper;
