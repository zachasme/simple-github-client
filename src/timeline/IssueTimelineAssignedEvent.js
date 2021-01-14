import { html } from "htm/preact";
import { gql } from "@urql/preact";

import Link from "../primitives/Link.js";
import Octicon from "../primitives/Octicon.js";

function IssueTimelineAssignedEvent({ issueTimelineItems: item }) {
  return html`
    <div class="TimelineItem">
      <div class="TimelineItem-badge">
        <${Octicon} name="person" />
      </div>

      <div class="TimelineItem-body">
        <${Link} href="/${item.actor.login}" class="text-bold link-gray-dark">
          ${item.actor.login}
        <//>
        ${" assigned "}
        <${Link}
          href="/${item.assignee.login}"
          class="text-bold link-gray-dark"
        >
          ${item.assignee.login}
        <//>
        ${" "}
        <${Link} href="#" class="link-gray">
          <relative-time datetime="${item.createdAt}">
            on ${item.createdAt}
          </relative-time>
        <//>
      </div>
    </div>
  `;
}

IssueTimelineAssignedEvent.fragments = {
  issueTimelineItems: gql`
    fragment IssueTimelineAssignedEvent_issueTimelineItems on IssueTimelineItems {
      ... on AssignedEvent {
        id
        createdAt
        actor {
          ... on User {
            id
          }
          login
        }
        assignee {
          ... on User {
            id
            login
          }
        }
      }
    }
  `,
};

export default IssueTimelineAssignedEvent;
