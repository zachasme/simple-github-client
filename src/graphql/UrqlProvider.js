import { html } from "htm/preact";
import { useMemo, useState, useEffect } from "preact/hooks";
import { Provider } from "@urql/preact";

import createClient from "./createClient.js";
import { listen, getToken } from "../authentication.js";
import { useToast } from "../toast/ToastContext.js";

function UrqlProvider({ schema, children }) {
  const [authenticated, setAuthenticated] = useState(getToken());

  const { addToast } = useToast();

  useEffect(() => {
    return listen((x) => {
      console.log("HIY", x);
      setAuthenticated(x);
    });
  }, []);

  const client = useMemo(() => {
    console.debug("[URQL] create new client");
    return createClient({ schema, addToast });
  }, [authenticated]);

  return html`<${Provider} value=${client}>${children}<//>`;
}

export default UrqlProvider;
