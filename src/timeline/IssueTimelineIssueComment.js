import { html } from "htm/react";
import { gql } from "urql";

import RelativeTime from "../utilities/RelativeTime.js";
import Link from "../primitives/Link.js";

function IssueTimelineIssueComment({ comment }) {
  return html`
    <div className="TimelineItem">
      <div className="TimelineItem-avatar">
        <img
          className="avatar"
          height="40"
          width="40"
          alt="@octocat"
          src=${comment.author?.avatarUrl}
        />
      </div>
      <div
        className="TimelineItem-body Box Box--condensed ${comment.viewerDidAuthor
          ? "Box--blue"
          : ""}
          position-relative ml-n2"
      >
        <div className="Box-header f5 text-normal">
          <strong>
            <a
              href="/${comment.author?.login || "ghost"}"
              className="link-gray-dark"
              >${comment.author?.login || "ghost"}</a
            >
          </strong>
          ${" commented "}
          <${Link} href="#" className="link-gray">
            <${RelativeTime} date=${comment.createdAt}>
              on ${comment.createdAt}
            <//>
          <//>
        </div>
        <div
          className="Box-body markdown-body f5 py-3"
          dangerouslySetInnerHTML=${{ __html: comment.bodyHTML }}
        />
      </div>
    </div>
  `;
}

IssueTimelineIssueComment.fragments = {
  comment: gql`
    fragment IssueTimelineIssueComment_comment on Comment {
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

export default IssueTimelineIssueComment;
