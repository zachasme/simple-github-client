import { html } from "htm/react";
import { Link as UpstreamLink } from "../common/routing.js";

// todo: preloading
function Link({ children, href, ...props }) {
  return html`
    <${UpstreamLink} href=${href}>
      <a ...${props}>${children}</a>
    <//>
  `;
}

export default Link;
