import { PersonIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "urql";

import UserLink from "../user/UserLink.js";
import SimpleEvent from "./SimpleEvent.js";

function AssignedEvent({ item }) {
  return html`
    <${SimpleEvent} Badge=${PersonIcon} item=${item}>
      assigned${" "}
      <${UserLink}
        login=${item.assignee.login}
        className="text-bold link-gray-dark"
      />
    <//>
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
