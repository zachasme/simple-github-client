import { html } from "htm/react";

import Link from "../primitives/Link.js";

export default function UnderlineNavItem({
  Icon,
  label,
  count,
  href,
  ...props
}) {
  return html`
    <${Link} className="UnderlineNav-item" href=${href} ...${props}>
      <${Icon} className="UnderlineNav-octicon d-none d-sm-inline" />
      <span>${label}</span>
      <span className="Counter">${count}</span>
    <//>
  `;
}
