import { html } from "htm/react";
import { gql } from "urql";

import RelativeTime from "../utilities/RelativeTime.js";
import Link from "../primitives/Link.js";

function IssueComment({ item }) {
  return html`
    <div className="TimelineItem">
      <div className="TimelineItem-avatar">
        <img
          className="avatar"
          height="40"
          width="40"
          alt="@octocat"
          src=${item.author?.avatarUrl}
        />
      </div>
      <div
        className="TimelineItem-body Box Box--condensed ${item.viewerDidAuthor
          ? "Box--blue"
          : ""}
          position-relative ml-n2"
      >
        <div className="Box-header f5 text-normal">
          <strong>
            <a
              href="/${item.author?.login || "ghost"}"
              className="link-gray-dark"
              >${item.author?.login || "ghost"}</a
            >
          </strong>
          ${" commented "}
          <${Link} href="#" className="link-gray">
            <${RelativeTime} date=${item.createdAt} />
          <//>
        </div>
        <div
          className="Box-body markdown-body f5 py-3"
          dangerouslySetInnerHTML=${{ __html: item.bodyHTML }}
        />
      </div>
    </div>
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
