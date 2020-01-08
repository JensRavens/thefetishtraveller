import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: '/graphql',
  }),
  connectToDevTools: true,
});
