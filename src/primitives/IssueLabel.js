import { html } from "htm/react";
import { gql } from "@apollo/client";

import Link from "./Link.js";
import { emojify } from "../common/emojis.js";

function textColor(backgroundColor) {
  const r = parseInt(backgroundColor.substring(0, 2), 16);
  const g = parseInt(backgroundColor.substring(2, 4), 16);
  const b = parseInt(backgroundColor.substring(4, 6), 16);

  if (r * 0.299 + g * 0.587 + b * 0.114 > 186) {
    return "000000";
  } else {
    return "FFFFFF";
  }
}

function IssueLabel({ nameWithOwner, label, className = "" }) {
  return html`
    <${Link}
      className="d-inline-block IssueLabel ${className}"
      title="Something isn't working"
      href="/${nameWithOwner}/issues?q=is%3Aissue+is%3Aopen+label%3A${label.name}"
      style=${{
        color: `#${textColor(label.color)}`,
        backgroundColor: `#${label.color}`,
      }}
    >
      ${emojify(label.name)}
    <//>
  `;
}

IssueLabel.fragments = {
  label: gql`
    fragment Label_label on Label {
      color
      name
    }
  `,
};

export default IssueLabel;
