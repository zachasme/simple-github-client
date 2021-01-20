import { CrossReferenceIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "urql";

import RelativeTime from "../common/RelativeTime.js";
import UserLink from "../user/UserLink.js";
import Link from "../primitives/Link.js";
import {
  TimelineItem,
  TimelineItemBody,
  TimelineItemBadge,
} from "../primitives/TimelineItem.js";

function ReferencedEvent({ item }) {
  return html`
    <${TimelineItem}>
      <${TimelineItemBadge}>
        <${CrossReferenceIcon} />
      <//>
      <${TimelineItemBody}>
        <div>
          <${UserLink}
            login=${item.actor.login}
            avatar=${item.actor.avatarUrl}
            className="text-bold link-gray-dark mr-1"
          />
          added a commit to ${item.commitRepository.nameWithOwner} that
          referenced this issue
          <${Link} to="#" className="link-gray ml-1">
            <${RelativeTime} date=${item.createdAt} />
          <//>
        </div>

        <div className="mt-3">
          <div className="d-flex flex-auto">
            <code className="pr-1 flex-auto min-width-0">
              <${Link}
                className="link-gray"
                to=${`/${item.commitRepository.nameWithOwner}/commit/${item.commit.oid}`}
              >
                ${item.commit.message}
              <//>
            </code>
            <code className="text-right ml-1">
              <${Link}
                className="link-gray"
                to=${`/${item.commitRepository.nameWithOwner}/commit/${item.commit.oid}`}
              >
                ${item.commit.abbreviatedOid}
              <//>
            </code>
          </div>
        </div>
      <//>
    </${TimelineItem}>
  `;
}

ReferencedEvent.fragments = {
  item: gql`
    fragment ReferencedEvent_item on ReferencedEvent {
      id
      createdAt
      actor {
        avatarUrl
        login
      }
      commitRepository {
        id
        nameWithOwner
      }
      commit {
        id
        oid
        commitUrl
        abbreviatedOid
        message
      }
    }
  `,
};

export default ReferencedEvent;
