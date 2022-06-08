import { CrossReferenceIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import IssueState from "../primitives/IssueState.js";
import RelativeTime from "../common/RelativeTime.js";
import UserLink from "../user/UserLink.js";
import Link from "../primitives/Link.js";
import {
  TimelineItem,
  TimelineItemBody,
  TimelineItemBadge,
} from "../primitives/TimelineItem.js";

function description(typename) {
  switch (typename) {
    case "PullRequest":
      return "linked a pull request";
    default:
      return "mentioned this issue";
  }
}

function CrossReferencedEvent({ item }) {
  return html`
    <${TimelineItem}>
      <${TimelineItemBadge}>
        <${CrossReferenceIcon} />
      <//>
      <${TimelineItemBody}>
        <div>
          <${UserLink}
            login=${item.actor.login}
            avatar=${item.actor?.avatarUrl}
            className="text-bold link-gray-dark mr-1"
          />

          ${description(item.source.__typename)}
          ${item.willCloseTarget && " that will close this issue"}
          <${Link} to="#" className="link-gray ml-1">
            <${RelativeTime} date=${item.createdAt} />
          <//>
        </div>

        <div className="mt-2 d-flex flex-items-start flex-column flex-md-row">
          <div className="flex-auto break-word">
            <${Link}
              to=${`/${item.source.repository?.nameWithOwner}/pulls/${item.source.number}`}
              className="link-gray-dark f4 text-bold"
            >
              ${item.source?.title}${" "}
              <span className="text-normal text-gray">
                #${item.source?.number}
              </span>
            <//>
          </div>
          <div className="flex-shrink-0 my-1 my-md-0 ml-md-3">
            <${IssueState}
              state=${item.source.issueState || item.source.pullRequestState}
            />
          </div>
        </div>
      <//>
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
        ... on Issue {
          number
          title
          issueState: state
          repository {
            id
            nameWithOwner
          }
        }
        ... on PullRequest {
          number
          title
          pullRequestState: state
          repository {
            id
            nameWithOwner
          }
        }
      }
    }
  `,
};

export default CrossReferencedEvent;
