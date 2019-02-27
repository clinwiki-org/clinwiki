import * as React from 'react';
import { gql } from 'apollo-boost';
import { Table, Row, Col } from 'react-bootstrap';
import { Query, Mutation } from 'react-apollo';
import { pathOr, path, lensPath, over, filter } from 'ramda';
import { FeedsPageQuery } from 'types/FeedsPageQuery';
import styled from 'styled-components';

import FeedItem from './FeedItem';
import { FeedItemFragment } from 'types/FeedItemFragment';
import {
  FeedsPageDeleteFeedMutation,
  FeedsPageDeleteFeedMutationVariables,
} from 'types/FeedsPageDeleteFeedMutation';
import { DataProxy } from 'apollo-cache';

const GET_FEEDS_QUERY = gql`
  query FeedsPageQuery {
    me {
      feeds {
        ...FeedItemFragment
      }
    }
  }

  ${FeedItem.fragment}
`;

const DELETE_FEED_MUTATION = gql`
  mutation FeedsPageDeleteFeedMutation($id: Int!) {
    deleteFeed(input: {id: $id}) {
      feed {
        ...FeedItemFragment
      }
    }
  }

  ${FeedItem.fragment}
`;

interface FeedsPageProps {
  history: any;
}

class QueryComponent extends Query<FeedsPageQuery> {}
class DeleteFeedMutationComponent extends
  Mutation<FeedsPageDeleteFeedMutation, FeedsPageDeleteFeedMutationVariables> {}

class FeedsPage extends React.PureComponent<FeedsPageProps> {
  handleFeedClick = (id: number) => {
    this.props.history.push(`/feeds/${id}`);
  }

  handleDeleteMutationUpdate = (
    cache: DataProxy,
    { data } : { data: FeedsPageDeleteFeedMutation },
  ) => {
    const deletedFeed = path(['deleteFeed', 'feed'], data) as FeedItemFragment;
    const storeData = cache.readQuery({ query: GET_FEEDS_QUERY });
    const feedsLens = lensPath(['me', 'feeds']);
    const newFeeds = over(
      feedsLens,
      filter((feed: FeedItemFragment) => feed.id !== deletedFeed.id),
    )(storeData);
    cache.writeQuery({
      query: GET_FEEDS_QUERY,
      data: newFeeds,
    });
  }

  render() {
    return (
      <QueryComponent query={GET_FEEDS_QUERY}>
        {({ data, loading, error }) => {
          if (loading || error) return null;
          const feeds = pathOr([], ['me', 'feeds'], data) as FeedItemFragment[];
          return (
            <div>
              <h1>My feeds</h1>
              <Row>
                <Col md={6}>
                  <Table>
                    <thead>
                      <tr>
                        <th style={{ width: '50%' }}>Name</th>
                        <th style={{ width: '25%' }}>Kind</th>
                        <th style={{ width: '25%' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeds.map(feed => (
                        <DeleteFeedMutationComponent
                          mutation={DELETE_FEED_MUTATION}
                          update={this.handleDeleteMutationUpdate}
                        >
                          {deleteFeed => (
                            <FeedItem
                              key={feed.id}
                              feedItem={feed}
                              onClick={this.handleFeedClick}
                              onDelete={id => deleteFeed({ variables: { id } })}
                            />
                          )}
                        </DeleteFeedMutationComponent>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          );
        }}
      </QueryComponent>
    );
  }
}

export default FeedsPage;
