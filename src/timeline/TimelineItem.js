import { html } from "htm/preact";
import { gql } from "@urql/preact";

import IssueLabel from "../primitives/IssueLabel.js";
import Octicon from "../primitives/Octicon.js";
import IssueTimelineAssignedEvent from "./IssueTimelineAssignedEvent.js";
import IssueTimelineIssueComment from "./IssueTimelineIssueComment.js";

function TimelineItem({ repository, timelineItem }) {
  switch (timelineItem.__typename) {
    case "IssueComment":
      return html`<${IssueTimelineIssueComment} comment=${timelineItem} />`;
    case "AssignedEvent":
      return html`<${IssueTimelineAssignedEvent}
        issueTimelineItems=${timelineItem}
      />`;
    case "LabeledEvent":
      return html`
        <div class="TimelineItem">
          <div class="TimelineItem-badge">
            <${Octicon} name="tag" />
          </div>

          <div class="TimelineItem-body">
            <a
              href="/${timelineItem.actor.login}"
              class="text-bold link-gray-dark"
            >
              ${timelineItem?.actor.login}
            <//>
            ${" added the "}
            <${IssueLabel}
              nameWithOwner=${repository.nameWithOwner}
              label=${timelineItem.label}
            />
            ${" label "}
            <a href="#" class="link-gray">
              <relative-time datetime="${timelineItem.createdAt}">
                on ${timelineItem.createdAt}
              </relative-time>
            <//>
          </div>
        </div>
      `;
    default:
      return html`
        <div class="TimelineItem">
          <div class="TimelineItem-badge">
            <${Octicon} name="flame" />
          </div>

          <div class="TimelineItem-body">
            type: ${timelineItem.__typename}, ...
            ${JSON.stringify(timelineItem)}
          </div>
        </div>
      `;
  }
}

TimelineItem.fragments = {
  repository: gql`
    fragment TimelineItem_repository on Repository {
      id
      nameWithOwner
    }
  `,
  issueTimelineItems: gql`
    fragment TimelineItem_issueTimelineItems on IssueTimelineItems {
      __typename
      ... on IssueComment {
        ...IssueTimelineIssueComment_comment
      }
      ... on MentionedEvent {
        id
        createdAt
        actor {
          ... on User {
            id
          }
          login
        }
      }
      ... on LabeledEvent {
        id
        createdAt
        actor {
          login
        }
        label {
          id
          ...Label_label
        }
      }
      ...IssueTimelineAssignedEvent_issueTimelineItems
    }
    ${IssueTimelineAssignedEvent.fragments.issueTimelineItems}
    ${IssueTimelineIssueComment.fragments.comment}
  `,
};

export default TimelineItem;
