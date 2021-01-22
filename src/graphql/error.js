import { errorExchange } from "@urql/core";

export default ({ addToast }) =>
  errorExchange({
    onError(error) {
      for (const graphQLError of error.graphQLErrors) {
        addToast({
          type: "error",
          message: graphQLError.message,
        });
      }
    },
  });
