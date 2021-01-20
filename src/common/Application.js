import { html } from "htm/react";

import { useAuthentication } from "../user/AuthenticationContext.js";
import ErrorBoundary from "../common/ErrorBoundary.js";
import LogInRoute from "../user/LogInRoute.js";

import ApplicationShell from "./ApplicationShell.js";
import Router from "./Router.js";

function Application() {
  const { token } = useAuthentication();

  if (!token) {
    return html`<${LogInRoute} />`;
  } else {
    console.log(`Using token: ${token}`);
  }

  return html`
    <${ApplicationShell}>
      <${ErrorBoundary}>
        <${Router} />
      <//>
    <//>
  `;
}

export default Application;
