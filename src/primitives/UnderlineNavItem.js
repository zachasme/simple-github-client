import { html } from "htm/preact";
import Octicon from "./Octicon.js";

import Link from "../primitives/Link.js";

export default function UnderlineNavItem({
  icon,
  label,
  count,
  href,
  ...props
}) {
  return html`
    <${Link} class="UnderlineNav-item" href=${href} ...${props}>
      <${Octicon}
        name=${icon}
        class="UnderlineNav-octicon d-none d-sm-inline"
      />
      <span>${label}</span>
      <span class="Counter">${count}</span>
    <//>
  `;
}
