import { html } from "htm/react";
import { gql, useMutation } from "@apollo/client";

import RelativeTime from "../common/RelativeTime.js";
import Link from "../primitives/Link.js";
import UserLink from "../user/UserLink.js";
import Box from "../primitives/Box.js";
import {
  TimelineItem,
  TimelineItemAvatar,
} from "../primitives/TimelineItem.js";
import { reaction } from "../common/emojis.js";
import {
  ADD_REACTION_MUTATION,
  REMOVE_REACTION_MUTATION,
} from "./reactionMutations.js";

function IssueComment({ item }) {
  const [addReactionResult, addReaction] = useMutation(ADD_REACTION_MUTATION);
  const [removeReactionResult, removeReaction] = useMutation(
    REMOVE_REACTION_MUTATION
  );
  const reactionGroups = item.reactionGroups; /*.filter(
    (group) => group.users.totalCount
  );*/

  const isReacting =
    addReactionResult.fetching || removeReactionResult.fetching;

  function toggleReaction(group) {
    const input = {
      subjectId: item.id,
      content: group.content,
    };
    if (group.viewerHasReacted) {
      removeReaction({ input });
    } else {
      addReaction({ input });
    }
  }

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
        ${reactionGroups.length > 0 &&
        html`
          <div className="Box-footer d-flex">
            ${reactionGroups.map(
              (group) => html`
                <button
                  disabled=${isReacting}
                  key=${group.content}
                  onClick=${() => toggleReaction(group)}
                  className="btn-link px-2 py-1 border-right"
                  type="button"
                >
                  ${reaction(group.content)} ${group.users.totalCount}
                </button>
              `
            )}
          </div>
        `}
      <//>
    <//>
  `;
}

IssueComment.fragments = {
  comment: gql`
    fragment IssueComment_comment on Comment {
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
  reactable: gql`
    fragment IssueComment_reactable on Reactable {
      id
      reactionGroups {
        viewerHasReacted
        content
        users {
          totalCount
        }
      }
    }
  `,
};

export default IssueComment;
