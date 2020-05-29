import * as React from 'react';
import { Query, QueryComponentOptions } from 'react-apollo';
import { gql } from 'apollo-boost';
import { CurrentUserQuery } from 'types/CurrentUserQuery';
import { UserFragment } from 'types/UserFragment';

interface CurrentUserProps {
  children: (user: UserFragment | null) => React.ReactNode;
}

const FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    firstName
    lastName
    defaultQueryString
    roles
    reviewCount
    reviews {
      content
      briefTitle
      nctId
    }
    contributions
    pictureUrl
    rank
  }
`;

const QUERY = gql`
  query CurrentUserQuery {
    me {
      ...UserFragment
    }
  }

  ${FRAGMENT}
`;

const QueryComponent = (props: QueryComponentOptions<CurrentUserQuery>) =>
  Query(props);

class CurrentUser extends React.PureComponent<CurrentUserProps> {
  static fragment = FRAGMENT;
  static query = QUERY;

  render() {
    return (
      <QueryComponent query={QUERY}>
        {({ data, loading, error }) => {
          if (loading || error || !data) {
            return this.props.children(null) as JSX.Element | null;
          }
          return this.props.children(data.me) as JSX.Element | null;
        }}
      </QueryComponent>
    );
  }
}

export default CurrentUser;
