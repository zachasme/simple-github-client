import { CircleSlashIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "urql";

import TimelineItem from "./TimelineItem.js";

function ClosedEvent({ item }) {
  return html`
    <${TimelineItem}
      style="red"
      Badge=${CircleSlashIcon}
      item=${item}
      text="closed this"
    />
  `;
}

ClosedEvent.fragments = {
  item: gql`
    fragment ClosedEvent_item on ClosedEvent {
      id
      createdAt
      actor {
        avatarUrl
        login
      }
    }
  `,
};

export default ClosedEvent;
