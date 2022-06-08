import { CircleSlashIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import RelativeTime from "../common/RelativeTime.js";
import UserLink from "../user/UserLink.js";
import {
  TimelineItem,
  TimelineItemBadge,
  TimelineItemBody,
} from "../primitives/TimelineItem.js";

function ClosedEvent({ item }) {
  return html`
    <${TimelineItem}>
      <${TimelineItemBadge} color="red">
        <${CircleSlashIcon} />
      <//>
      <${TimelineItemBody}>
        <${UserLink}
          login=${item.actor.login}
          avatar=${item.actor?.avatarUrl}
          href="/${item.actor.login}"
          className="text-bold link-gray-dark mr-1"
        />
        closed this
        <a href="#" className="link-gray ml-1">
          <${RelativeTime} date=${item.createdAt} />
        <//>
      <//>
    <//>
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
