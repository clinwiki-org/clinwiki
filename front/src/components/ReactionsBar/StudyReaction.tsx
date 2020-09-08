import * as React from 'react';
import { Query, QueryComponentOptions } from 'react-apollo';
import { gql } from 'apollo-boost';
import { CurrentUserQuery } from 'types/CurrentUserQuery';
import { UserFragment } from 'types/UserFragment';

interface StudyReactionsProps {
  children: (user: UserFragment | null, refetch?: any) => React.ReactNode;
  nctId: any;
}

export const REACTIONS_QUERY = gql`
  query StudyReactions($nctId: String!) {
    me {
      id
      email
      firstName
      lastName
      reactions(nctId: $nctId) {
        id
        reactionKindId
        reactionKind {
          id
          name
          unicode
        }
        study {
          briefTitle
        }
        nctId
      }
    }
  }
`;

const QueryComponent = (props: QueryComponentOptions<CurrentUserQuery>) =>
  Query(props);

class StudyReactions extends React.PureComponent<StudyReactionsProps> {
  //   static fragment = FRAGMENT;
  static query = REACTIONS_QUERY;

  render() {
    return (
      <QueryComponent
        query={REACTIONS_QUERY}
        variables={{ nctId: this.props.nctId }}>
        {({ data, loading, error, refetch }) => {
          // console.log(data)
          if (loading || error || !data) {
            return this.props.children(null) as JSX.Element | null;
          }
          return this.props.children(data.me, refetch) as JSX.Element | null;
        }}
      </QueryComponent>
    );
  }
}

export default StudyReactions;
