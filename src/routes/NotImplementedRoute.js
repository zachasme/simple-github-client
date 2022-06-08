import { html } from "htm/react";
import { useLocation } from "../common/routing.js";

function NotImplementedRoute() {
  const location = useLocation();
  return html`<p>Not implemented: ${location.pathname}</p>`;
}

export default NotImplementedRoute;
