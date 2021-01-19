import { PersonIcon } from "@primer/octicons-react";
import { Fragment } from "react";
import { html } from "htm/react";
import { gql } from "urql";

import Link from "../primitives/Link.js";
import TimelineItem from "./TimelineItem.js";

function AssignedEvent({ item }) {
  return html`
    <${TimelineItem}
      item=${item}
      Badge=${PersonIcon}
      text=${html`
        <${Fragment}>
          ${"assigned "}
          <${Link}
            href="/${item.assignee.login}"
            className="text-bold link-gray-dark"
          >
            ${item.assignee.login}
          <//>
        </${Fragment}>
      `}
    >
    </${TimelineItem}>
  `;
}

AssignedEvent.fragments = {
  item: gql`
    fragment AssignedEvent_item on AssignedEvent {
      id
      createdAt
      actor {
        login
        avatarUrl
      }
      assignee {
        ... on User {
          id
          login
        }
      }
    }
  `,
};

export default AssignedEvent;
