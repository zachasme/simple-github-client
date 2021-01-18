import { html } from "htm/react";
import { useLocation } from "react-router-dom";

function NotImplementedRoute() {
  const location = useLocation();
  return html`<p>Not implemented: ${location.pathname}</p>`;
}

export default NotImplementedRoute;
