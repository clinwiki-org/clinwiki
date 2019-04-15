import * as React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { path, concat, lensPath, over } from 'ramda';
import {
  AggItem,
  AggFilterMap,
  AggCallback,
  SearchParams,
  SortItem,
  AggKind,
} from '../Types';
import { CreateFeedGetFeedsQuery_me_feeds } from 'types/CreateFeedGetFeedsQuery';

const Wrapper = styled.div`
  margin-top: 30px;
`;

const CREATE_FEED = gql`
  mutation CreateFeedMutation(
    $q: SearchQueryInput!
    $sorts: [SortInput!]
    $aggFilters: [AggFilterInput!]
    $crowdAggFilters: [AggFilterInput!]
    $name: String!
    $kind: FeedKind!
  ) {
    createFeed(
      input: {
        searchParams: {
          q: $q
          sorts: $sorts
          aggFilters: $aggFilters
          crowdAggFilters: $crowdAggFilters
        }
        name: $name
        kind: $kind
      }
    ) {
      feed {
        id
        name
        kind
      }
    }
  }
`;

const GET_FEEDS = gql`
  query CreateFeedGetFeedsQuery {
    me {
      feeds {
        id
        name
        kind
      }
    }
  }
`;

interface SaveFeedProps {
  searchParams: SearchParams;
  history: any;
}

interface SaveFeedState {
  name: string;
}

class SaveFeed extends React.PureComponent<SaveFeedProps, SaveFeedState> {
  handleCreateFeed = (createFeed: (x: { variables: any }) => void) => {
    createFeed({
      variables: {
        ...this.props.searchParams,
        // TODO: fix this
        q: this.props.searchParams.q.join(' '),
        name: this.state.name,
        kind: 'REVIEW_WORKFLOW',
      },
    });
    this.props.history.push('/feeds');
  };

  handleChange = e => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_FEED}
        update={(cache, { data }) => {
          const feed = path(['createFeed', 'feed'], data);
          const storeData = cache.readQuery({ query: GET_FEEDS });
          const feedsLens = lensPath(['me', 'feeds']);
          const newFeeds = over(
            feedsLens,
            (feeds: any[]) => [...feeds, feed],
            storeData,
          );
          cache.writeQuery({
            query: GET_FEEDS,
            data: newFeeds,
          });
        }}
      >
        {createFeed => (
          <Wrapper>
            <FormGroup>
              <FormControl
                onChange={this.handleChange}
                placeholder="Feed name"
              />
            </FormGroup>
            <Button
              bsStyle="primary"
              onClick={() => this.handleCreateFeed(createFeed)}
            >
              Save Feed
            </Button>
          </Wrapper>
        )}
      </Mutation>
    );
  }
}

export default SaveFeed;
