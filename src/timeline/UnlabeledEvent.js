import { TagIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "urql";

import TimelineItem from "./TimelineItem.js";
import IssueLabel from "../primitives/IssueLabel.js";

function UnlabeledEvent({ repository, item }) {
  return html`
    <${TimelineItem}
      Badge=${TagIcon}
      item=${item}
      text=${html`
        <${Fragment}>
          ${"removed the "}
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
