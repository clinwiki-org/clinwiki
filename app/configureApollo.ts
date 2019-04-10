import ApolloClient, { gql } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const dataIdFromObject = object => {
  const id = object['id'] || object['_id'] || object['nctId'] || null;
  if (!id) return null;
  if (!object.__typename) return id;
  return `${object.__typename}:${id}`;
};

const cache = new InMemoryCache({
  dataIdFromObject,
});

function get_gql_url() {
  if (
    typeof window === 'undefined' ||
    window.location.hostname === 'localhost'
  ) {
    return 'http://localhost:3000/graphql';
  }
  return '/graphql';
}

const typeDefs = gql`
  extend type Query {
    searchQuery: [String!]!
  }
`;

const client = new ApolloClient({
  cache,
  typeDefs,
  uri: get_gql_url(),
  credentials: 'include',
  resolvers: {},
});

const data = {
  searchParams: null,
  searchQuery: [],
};

cache.writeData({ data });

client.onResetStore(() => Promise.resolve(cache.writeData({ data })));

export default client;
