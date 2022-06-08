import { html } from "htm/react";

import RelativeTime from "../common/RelativeTime.js";
import UserLink from "../user/UserLink.js";
import Link from "../primitives/Link.js";
import {
  TimelineItem,
  TimelineItemBody,
  TimelineItemBadge,
} from "../primitives/TimelineItem.js";

function SimpleEvent({ item, Badge, style, children }) {
  let badgeClassNames = "TimelineItem-badge";
  if (style === "red") badgeClassNames += " text-white bg-red";

  return html`
    <${TimelineItem}>
      <${TimelineItemBadge}>
        <${Badge} />
      <//>
      <${TimelineItemBody}>
        <div>
          <${UserLink}
            login=${item.actor.login}
            avatar=${item.actor?.avatarUrl}
            className="text-bold link-gray-dark mr-1"
          />
          ${children}
          <${Link} href="#" className="link-gray ml-1">
            <${RelativeTime} date=${item.createdAt} />
          <//>
        </div>
      <//>
    <//>
  `;
}

export default SimpleEvent;
