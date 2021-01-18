import { html } from "htm/react";
import Link from "../primitives/Link.js";

function UserLink({ login }) {
  return html`<${Link} href=${`/${login}`}>${login}<//>`;
}

export default UserLink;
