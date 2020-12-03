import * as React from 'react';
import { Query, QueryComponentOptions } from 'react-apollo';
import { gql } from 'apollo-boost';
import { CurrentUserQuery } from 'types/CurrentUserQuery';
import { UserFragment } from 'types/UserFragment';

interface ReactionsByIdProps {
    children: (user: UserFragment | null, refetch?: any) => React.ReactNode;
    reactionKindId: any;
}



export const REACTIONS_QUERY = gql`
  query ReactionsById($reactionKindId: String!) {
    me {
        id
        email
        firstName
        lastName
        reactions(reactionKindId: $reactionKindId){
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
    }
  }

`;

const QueryComponent = (props: QueryComponentOptions<CurrentUserQuery>) =>
    Query(props);

class ReactionsById extends React.PureComponent<ReactionsByIdProps> {
    //   static fragment = FRAGMENT;
    static query = REACTIONS_QUERY;

    render() {
        return (
            <QueryComponent query={REACTIONS_QUERY} variables={{ reactionKindId: this.props.reactionKindId }}>
                {({ data, loading, error, refetch }) => {
                    if (loading || error || !data) {
                        return this.props.children(null) as JSX.Element | null;
                    }
                    return this.props.children(data.me, refetch) as JSX.Element | null;
                }}
            </QueryComponent>
        );
    }
}

export default ReactionsById;
