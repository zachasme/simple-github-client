import { html } from "htm/react";
import { IssueOpenedIcon, IssueClosedIcon } from "@primer/octicons-react";

function IssueState({ state, className = "" }) {
  const isOpen = state === "OPEN";
  const title = isOpen ? "Open" : "Closed";

  return html`
    <span
      className=${`State State--${isOpen ? "green" : "red"} ${className}`}
      title=${`Status: ${title}`}
    >
      <${isOpen ? IssueOpenedIcon : IssueClosedIcon} className="mr-2" />
      ${title}
    </span>
  `;
}

export default IssueState;
