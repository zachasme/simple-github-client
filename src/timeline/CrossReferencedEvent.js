import { CrossReferenceIcon } from "@primer/octicons-react";
import { Fragment } from "react";
import { html } from "htm/react";
import { gql } from "urql";

import Link from "../primitives/Link.js";
import IssueState from "../primitives/IssueState.js";
import TimelineItem from "./TimelineItem.js";

function CrossReferencedEvent({ item }) {
  return html`
    <${TimelineItem}
      Badge=${CrossReferenceIcon}
      item=${item}
      text=${html`
        <${Fragment}>
          ${"linked a "} ${item.source.__typename}
          ${item.willCloseTarget && " that will close this issue"}
        <//>
      `}
    >
      <div className="mt-2 d-flex flex-items-start flex-column flex-md-row">
        <div className="flex-auto break-word">
          <${Link}
            to=${`/${item.source.repository?.nameWithOwner}/pulls/${item.source.number}`}
            className="link-gray-dark f4 text-bold"
          >
            ${item.source?.title}
          <//>
        </div>
        <div className="flex-shrink-0 my-1 my-md-0 ml-md-3">
          <${IssueState} state=${item.source.state} />
        </div>
      </div>
    <//>
  `;
}

CrossReferencedEvent.fragments = {
  item: gql`
    fragment CrossReferencedEvent_item on CrossReferencedEvent {
      id
      createdAt
      actor {
        avatarUrl
        login
      }
      referencedAt
      willCloseTarget
      source {
        __typename
        ... on Node {
          id
        }
        ... on PullRequest {
          number
          title
          state
          repository {
            nameWithOwner
          }
        }
      }
    }
  `,
};

export default CrossReferencedEvent;
