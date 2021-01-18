import { html } from "htm/react";
import { gql } from "urql";

import RelativeTime from "../utilities/RelativeTime.js";
import Link from "../primitives/Link.js";
import { PersonIcon } from "@primer/octicons-react";

function IssueTimelineRenamedTitleEvent({ renamedTitleEvent: item }) {
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
        ${" change the title to "} ${item.currentTitle} ${" "}
        <${Link} href="#" className="link-gray">
          <${RelativeTime} date=${item.createdAt}>on ${item.createdAt}<//>
        <//>
      </div>
    </div>
  `;
}

IssueTimelineRenamedTitleEvent.fragments = {
  renamedTitleEvent: gql`
    fragment IssueTimelineRenamedTitleEvent_renamedTitleEvent on RenamedTitleEvent {
      id
      createdAt
      currentTitle
      previousTitle
      actor {
        ... on User {
          id
        }
        login
      }
    }
  `,
};

export default IssueTimelineRenamedTitleEvent;
