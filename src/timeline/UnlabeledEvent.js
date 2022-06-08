import { TagIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import SimpleEvent from "./SimpleEvent.js";
import IssueLabel from "../primitives/IssueLabel.js";
function UnlabeledEvent({ repository, item }) {
  return html`
    <${SimpleEvent} Badge=${TagIcon} item=${item}>
      removed the${" "}
      <${IssueLabel}
        nameWithOwner=${repository.nameWithOwner}
        label=${item.label}
      />
      ${" "}label
    <//>
  `;
}

UnlabeledEvent.fragments = {
  item: gql`
    fragment UnlabeledEvent_item on UnlabeledEvent {
      id
      createdAt
      actor {
        avatarUrl
        login
      }
      label {
        id
        ...Label_label
      }
    }
  `,
};

export default UnlabeledEvent;
