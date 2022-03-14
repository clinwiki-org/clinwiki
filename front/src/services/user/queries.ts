export const FETCH_USER_QUERY = '';

const CURRENT_USER_FRAGMENT = `fragment UserFragment on User { 
    id
    email
    first_name
    last_name
    default_query_string
    roles {
      id
      name
      resource_type
      resource_id
      created_at
      updated_at
    }
    reviewCount
    reviews {
      content
      briefTitle
      nctId
    }
    reactionsCount{
      name
      count
    }
    contributions
    picture_url
    rank
    reactions{
      id
      reactionKindId
      reactionKind{
        id
        name
      }
      study{
        briefTitle
      }
      nctId
    }    
} `;

export const FETCH_CURRENT_USER_QUERY = ` query CurrentUserQuery {
    me { ...UserFragment  }
  }

  ${CURRENT_USER_FRAGMENT}`;

  export const SIGN_IN_MUTATION = `mutation SignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      jwt
      user {
        ...UserFragment
      }
    }
  }
  ${CURRENT_USER_FRAGMENT}`;

  export const SIGN_UP_MUTATION = `
  mutation SignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      jwt
      errors
      user {
        ...UserFragment
      }
    }
  }
  ${CURRENT_USER_FRAGMENT}`;

  export const UPDATE_PASSWORD_MUTATION = `
  mutation UpdatePasswordMutation($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {

      user {
        id
        email
      }
      message
      success
    }
  }
`;
  export const RESET_PASSWORD_MUTATION = `
  mutation ResetPasswordMutation($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
  `;

  export const EDIT_PROFILE_MUTATION = `
  mutation EditProfileMutation($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      errors
      user {
        ...UserFragment
      }
    }
  }
  ${CURRENT_USER_FRAGMENT}`;

  export const USER_QUERY = `
  query User($userId: Int!) {
    user(userId: $userId) {
      firstName
      lastName
      reviewCount
      rank
      reviews {
        nctId
        briefTitle
        content
      }
      contributions
      pictureUrl
    }
  }
`;
