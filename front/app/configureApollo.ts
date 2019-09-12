import { gql } from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { getLocalJwt } from 'utils/localStorage';
import { createHttpLink } from 'apollo-link-http';

export const dataIdFromObject = object => {
  const id = object['id'] || object['_id'] || object['nctId'] || null;
  if (!id) return null;
  if (!object.__typename) return id;
  return `${object.__typename}:${id}`;
};

const cache = new InMemoryCache({
  dataIdFromObject,
});

console.log('Apollo cache', cache);

function get_gql_url() {
  if (
    typeof window === 'undefined' ||
    window.location.hostname.includes('localhost')
  ) {
    return `http://${window.location.hostname}:3000/graphql`;
  }
  return '/graphql';
}

const typeDefs = gql`
  extend type Query {
    searchQuery: [String!]!
  }
`;

const httpLink = createHttpLink({ uri: get_gql_url(), credentials: 'include' });
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getLocalJwt();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  typeDefs,
  cache,
  link: authLink.concat(httpLink),
  resolvers: {},
});

const data = {
  searchParams: null,
  searchQuery: [],
};

cache.writeData({ data });

client.onResetStore(() => Promise.resolve(cache.writeData({ data })));

export default client;
