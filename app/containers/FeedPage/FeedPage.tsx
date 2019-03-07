import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Redirect } from 'react-router-dom';
import StudyPage from 'containers/StudyPage';
import styled from 'styled-components';
import { FeedPageQuery, FeedPageQueryVariables } from 'types/FeedPageQuery';
import { pathOr, path } from 'ramda';

const QUERY = gql`
  query FeedPageQuery($feedId: Int!, $studyId: String) {
    feed(id: $feedId) {
      id
      kind
      name
      studyEdge(id: $studyId) {
        prevId
        nextId
        study {
          nctId
        }
      }
    }
  }
`;

interface FeedPageProps {
  history: any;
  match: {
    params: {
      feedId: string;
      studyId?: string | null | undefined;
    };
  };
}

class QueryComponent extends Query<FeedPageQuery, FeedPageQueryVariables> {}

class FeedPage extends React.PureComponent<FeedPageProps> {
  render() {
    const { feedId, studyId } = this.props.match.params;
    const feedIdInt = parseInt(feedId, 10);
    return (
      <QueryComponent query={QUERY} variables={{ studyId, feedId: feedIdInt }}>
        {({ data, loading, error }) => {
          if (loading || error || !data) return null;
          const id = path(['feed', 'studyEdge', 'study', 'nctId'], data);
          if (!studyId) {
            return <Redirect to={`/feeds/${feedId}/study/${id}/reviews/new`} />;
          }
          const prevId = path(['feed', 'studyEdge', 'prevId'], data);
          const nextId = path(['feed', 'studyEdge', 'nextId'], data);

          const prevLink = prevId && `/feeds/${feedId}/study/${prevId}/reviews/new`;
          const nextLink = nextId && `/feeds/${feedId}/study/${nextId}/reviews/new`;
          const match = {
            ...this.props.match,
            params: { ...this.props.match.params, nctId: studyId || id },
          };

          return (
            <StudyPage
              history={this.props.history}
              match={match}
              prevLink={prevLink}
              nextLink={nextLink}
              isFeed
            />
          );

        }}
      </QueryComponent>
    );
  }
}

export default FeedPage;
