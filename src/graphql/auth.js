import { makeOperation } from "@urql/core";
import { authExchange as exchange } from "@urql/exchange-auth";

import { logout, getToken } from "../authentication";

/**
 * The purpose of the authExchange is to provide a flexible API that
 * facilitates the typical authentication flow.
 */
export const authExchange = exchange({
  /**
   * This provided method receives the `authState` (`null | T`). It should
   * then refresh the authentication state using either a `fetch` call or
   * the `mutate` method, which is similar to `client.mutation` and return
   * a new `authState` object. In case it receives `null` it should return
   * a stored authentication state, e.g. from local storage. It's allowed
   * to throw an error, which will interrupt the auth flow and let the
   * authentication error fallthrough.
   */
  getAuth: async ({ authState, mutate }) => {
    if (!authState) {
      const token = getToken();
      if (token) {
        return { token };
      }
      return null;
    }

    logout();

    return null;
  },
  /**
   * The purpose of `addAuthToOperation` is to take apply your auth state
   * to each request. Note that the format of the `authState` will be
   * whatever you've returned from `getAuth` and not at all constrained
   * by the exchange.
   */
  addAuthToOperation: ({ authState, operation }) => {
    if (!authState || !authState.token) {
      return operation;
    }
    const fetchOptions =
      typeof operation.context.fetchOptions === "function"
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};
    return makeOperation(operation.kind, operation, {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${authState.token}`,
        },
      },
    });
  },
  /**
   * This function lets the exchange know what is defined to be an API
   * error for your API. `didAuthError` receives an error which is of type
   * CombinedError and we can use the graphQLErrors array in CombinedError
   * to determine if an auth error has occurred.
   */
  didAuthError: ({ error }) => {
    return error?.response?.status === 401;
    /*return error.graphQLErrors.some(
            (e) => e.extensions?.code === "FORBIDDEN"
          );*/
  },
});
