import { html } from "htm/react";
import { Link as UpstreamLink } from "../common/routing.js";

// todo: preloading
function Link({ href, ...props }) {
  return html`<${UpstreamLink} to=${href} ...${props} />`;
}

export default Link;
