import { html } from "htm/react";
import { gql } from "urql";

import RelativeTime from "../utilities/RelativeTime.js";
import Link from "../primitives/Link.js";
import { PersonIcon } from "@primer/octicons-react";

function IssueTimelineAssignedEvent({ issueTimelineItems: item }) {
  return html`
    <div className="TimelineItem">
      <div className="TimelineItem-badge">
        <${PersonIcon} />
      </div>

      <div className="TimelineItem-body">
        <${Link}
          href="/${item.actor.login}"
          className="text-bold link-gray-dark"
        >
          ${item.actor.login}
        <//>
        ${" assigned "}
        <${Link}
          href="/${item.assignee.login}"
          className="text-bold link-gray-dark"
        >
          ${item.assignee.login}
        <//>
        ${" "}
        <${Link} href="#" className="link-gray">
          <${RelativeTime} date=${item.createdAt}>on ${item.createdAt}<//>
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
