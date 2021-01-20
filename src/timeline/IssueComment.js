import { html } from "htm/react";
import { gql } from "urql";

import RelativeTime from "../common/RelativeTime.js";
import Link from "../primitives/Link.js";
import UserLink from "../user/UserLink.js";
import Box from "../primitives/Box.js";
import {
  TimelineItem,
  TimelineItemAvatar,
  TimelineItemBody,
} from "../primitives/TimelineItem.js";

function IssueComment({ item }) {
  return html`
    <${TimelineItem}>
      <${TimelineItemAvatar} src=${item.author?.avatarUrl} alt="@octocat" />
      <${Box}
        condensed
        blue=${item.viewerDidAuthor}
        className="position-relative ml-n2 width-full"
      >
        <div className="Box-header f5 text-normal">
          <${UserLink}
            login=${item.author.login || "ghost"}
            className="link-gray-dark text-bold"
          />
          ${" commented "}
          <${Link} href="#" className="link-gray">
            <${RelativeTime} date=${item.createdAt} />
          <//>
        </div>
        <div
          className="Box-body markdown-body f5 py-3"
          dangerouslySetInnerHTML=${{ __html: item.bodyHTML }}
        />
      <//>
    <//>
  `;
}

IssueComment.fragments = {
  item: gql`
    fragment IssueComment_item on Comment {
      id
      bodyHTML
      viewerDidAuthor
      author {
        ... on User {
          id
        }
        login
        avatarUrl
      }
      createdAt
    }
  `,
};

export default IssueComment;
