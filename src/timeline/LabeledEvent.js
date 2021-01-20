import { TagIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "urql";

import SimpleEvent from "./SimpleEvent.js";
import IssueLabel from "../primitives/IssueLabel.js";

function LabeledEvent({ repository, item }) {
  return html`
    <${SimpleEvent} Badge=${TagIcon} item=${item}>
      added the${" "}
      <${IssueLabel}
        nameWithOwner=${repository.nameWithOwner}
        label=${item.label}
      />
      ${" "}label
    <//>
  `;
}

LabeledEvent.fragments = {
  item: gql`
    fragment LabeledEvent_item on LabeledEvent {
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

export default LabeledEvent;
