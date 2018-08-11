import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache()

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache,
  clientState: {
    defaults: {
    }
  },
  resolvers: {}
});

export default client;
