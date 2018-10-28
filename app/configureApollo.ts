import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache()

function get_gql_url() {
    if (typeof window == 'undefined' || window.location.hostname == 'localhost') return 'http://localhost:3000/graphql'
    return "/graphql";
}

// interface ClientState => defined in LocalStateDecorator.tsx

const client = new ApolloClient({
  uri: get_gql_url(),
  cache,
  clientState: {
    defaults: {
      searchQuery: ""
    },
    resolvers: {}
  },
});

export default client;
