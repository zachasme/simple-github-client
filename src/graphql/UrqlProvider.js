import { html } from "htm/preact";
import { useMemo } from "preact/hooks";
import { Provider } from "@urql/preact";

import createClient from "./createClient.js";
import { useToast } from "../toast/ToastContext.js";
import { useToken } from "../user/TokenContext.js";

function UrqlProvider({ schema, children }) {
  const { addToast } = useToast();
  const { token, logout } = useToken();

  const client = useMemo(() => {
    console.debug("[URQL] create new client");
    return createClient({ schema, token, logout, addToast });
  }, [token]);

  return html`<${Provider} value=${client}>${children}<//>`;
}

export default UrqlProvider;
