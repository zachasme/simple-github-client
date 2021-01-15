import { errorExchange as exchange } from "@urql/core";

export const errorExchange = (addToast) =>
  exchange({
    onError(error) {
      for (const graphQLError of error.graphQLErrors) {
        addToast({
          type: "error",
          message: graphQLError.message,
        });
      }
    },
  });
