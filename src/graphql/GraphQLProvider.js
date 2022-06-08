import { html } from "htm/react";
import { useMemo } from "react";
import { ApolloProvider } from "@apollo/client";

import { useAuthentication } from "../user/AuthenticationContext.js";
import { useToast } from "../common/ToastContext.js";
import createClient from "./createClient.js";

/**
 * GraphQL context
 *
 * provides the GraphQL client
 *
 * Requires:
 *  - Authentication context for token and logout method
 *  - Toast context for showing errors
 */
function GraphQLProvider({ schema, children }) {
  const { addToast } = useToast();
  const { token, logout } = useAuthentication();

  const client = useMemo(() => {
    console.debug("[GraphQL] Creating new client...");
    return createClient({ schema, token, logout, addToast });
  }, [token]);

  return html`<${ApolloProvider} client=${client}>${children}<//>`;
}

export default GraphQLProvider;
