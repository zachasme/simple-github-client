import { html } from "htm/preact";
import Octicon from "../primitives/Octicon.js";

function IssueState({ state, class: className = "" }) {
  const isOpen = state === "OPEN";
  const title = isOpen ? "Open" : "Closed";

  return html`
    <span
      class=${`State State--${isOpen ? "green" : "red"} ${className}`}
      title=${`Status: ${title}`}
    >
      <${Octicon}
        class="mr-2"
        name=${isOpen ? "issue-opened" : "issue-closed"}
      />
      ${title}
    </span>
  `;
}

export default IssueState;
