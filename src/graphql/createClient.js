import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

export default ({ schema, token, logout, addToast }) => {
  const httpLink = new HttpLink({ uri: "https://api.github.com/graphql" });

  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }));

    return forward(operation);
  });

  const possibleTypes = {};
  schema.__schema.types.forEach((supertype) => {
    if (supertype.possibleTypes) {
      possibleTypes[supertype.name] = supertype.possibleTypes.map(
        (subtype) => subtype.name
      );
    }
  });

  return new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache({
      possibleTypes,
      typePolicies: {
        Issue: {
          fields: {
            timelineItems: relayStylePagination(),
          },
        },
      },
    }),
  });
};
