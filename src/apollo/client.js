import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const mainEndpoint = new HttpLink({
  uri: process.env.REACT_APP_QUERY_API_URL,
});

// "https://test.api.upm.udevs.io/query"

const authEndpoint = new HttpLink({
  uri: process.env.REACT_APP_QUERY_API_AUTH_URL,
});

// "https://test.api.auth.upm.udevs.io/query"

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.split(
    (operation) => operation.getContext().endpoint === "auth",
    authEndpoint,
    mainEndpoint // default endpoint
  ),
});

export default apolloClient;
