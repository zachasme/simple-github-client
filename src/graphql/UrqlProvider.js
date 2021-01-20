import { html } from "htm/react";
import { useMemo } from "react";
import { Provider } from "urql";

import { useAuthentication } from "../user/AuthenticationContext.js";
import { useToast } from "../common/ToastContext.js";
import createClient from "./createClient.js";

/**
 * URQL context
 *
 * provides the urql client
 *
 * Requires:
 *  - Authentication context for token and logout method
 *  - Toast context for showing errors
 */
function UrqlProvider({ schema, children }) {
  const { addToast } = useToast();
  const { token, logout } = useAuthentication();

  const client = useMemo(() => {
    console.debug("[URQL] Creating new client...");
    return createClient({ schema, token, logout, addToast });
  }, [token]);

  return html`<${Provider} value=${client}>${children}<//>`;
}

export default UrqlProvider;
