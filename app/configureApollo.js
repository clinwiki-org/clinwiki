import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache()

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache,
  clientState: {
    defaults: {
      q: "",
      page: 0,
      pageSize: 25,
      sorts: [],
      aggFilter: [],
    }
  }
});

export default client;
