import { TagIcon } from "@primer/octicons-react";
import { Fragment } from "react";
import { html } from "htm/react";
import { gql } from "urql";

import TimelineItem from "./TimelineItem.js";
import IssueLabel from "../primitives/IssueLabel.js";

function LabeledEvent({ repository, item }) {
  return html`
    <${TimelineItem}
      Badge=${TagIcon}
      item=${item}
      text=${html`
        <${Fragment}>
          ${"added the "}
          <${IssueLabel}
            nameWithOwner=${repository.nameWithOwner}
            label=${item.label}
          />
          ${" label"}
        <//>
      `}
    />
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
