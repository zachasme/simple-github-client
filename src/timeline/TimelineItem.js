import { html } from "htm/react";

import RelativeTime from "../utilities/RelativeTime.js";

function TimelineItem({ item, Badge, style, children, text }) {
  let badgeClassNames = "TimelineItem-badge";
  if (style === "red") badgeClassNames += " text-white bg-red";

  return html`
    <div className="TimelineItem">
      <div className=${badgeClassNames}>
        <${Badge} />
      </div>

      <div className="TimelineItem-body">
        <div>
          <a
            href="/${item.actor.login}"
            className="text-bold link-gray-dark mr-1"
          >
            <img
              className="avatar avatar-1 mr-1"
              alt="jonrohan"
              src=${item.actor?.avatarUrl}
            />
            ${item.actor.login}
          <//>
          ${text}
          <a href="#" className="link-gray ml-1">
            <${RelativeTime} date=${item.createdAt} />
          <//>
        </div>
        ${children}
      </div>
    </div>
  `;
}

export default TimelineItem;
