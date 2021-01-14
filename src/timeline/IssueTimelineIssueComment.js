import { html } from "htm/preact";
import { gql } from "@urql/preact";

import Link from "../primitives/Link.js";

function IssueTimelineIssueComment({ comment }) {
  return html`
    <div class="TimelineItem">
      <div class="TimelineItem-avatar">
        <img
          class="avatar"
          height="40"
          width="40"
          alt="@octocat"
          src=${comment.author?.avatarUrl}
        />
      </div>
      <div
        class="TimelineItem-body Box Box--condensed ${comment.viewerDidAuthor
          ? "Box--blue"
          : ""}
          position-relative ml-n2"
      >
        <div class="Box-header f5 text-normal">
          <strong>
            <a
              href="/${comment.author?.login || "ghost"}"
              class="link-gray-dark"
              >${comment.author?.login || "ghost"}</a
            >
          </strong>
          ${" commented "}
          <${Link} href="#" class="link-gray">
            <relative-time datetime="${comment.createdAt}">
              on ${comment.createdAt}
            </relative-time>
          <//>
        </div>
        <div
          class="Box-body markdown-body f5"
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
