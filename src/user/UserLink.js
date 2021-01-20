import { html } from "htm/react";
import Link from "../primitives/Link.js";

function UserLink({ login, avatar, ...props }) {
  return html`<${Link} href=${`/${login}`} ...${props}>
    ${avatar && html`<img className="avatar avatar-1 mr-1" src=${avatar} />`}
    ${login}
  <//>`;
}

export default UserLink;
