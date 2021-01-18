import { html } from "htm/react";
import { gql } from "urql";

import RelativeTime from "../utilities/RelativeTime.js";
import IssueLabel from "../primitives/IssueLabel.js";
import { FlameIcon, TagIcon } from "@primer/octicons-react";
import IssueTimelineAssignedEvent from "./IssueTimelineAssignedEvent.js";
import IssueTimelineIssueComment from "./IssueTimelineIssueComment.js";
import IssueTimelineRenamedTitleEvent from "./IssueTimelineRenamedTitleEvent.js";

function TimelineItem({ repository, timelineItem }) {
  switch (timelineItem.__typename) {
    case "RenamedTitleEvent":
      return html`<${IssueTimelineRenamedTitleEvent}
        renamedTitleEvent=${timelineItem}
      />`;
    case "IssueComment":
      return html`<${IssueTimelineIssueComment} comment=${timelineItem} />`;
    case "AssignedEvent":
      return html`<${IssueTimelineAssignedEvent}
        issueTimelineItems=${timelineItem}
      />`;
    case "LabeledEvent":
      return html`
        <div className="TimelineItem">
          <div className="TimelineItem-badge">
            <${TagIcon} />
          </div>

          <div className="TimelineItem-body">
            <a
              href="/${timelineItem.actor.login}"
              className="text-bold link-gray-dark"
            >
              ${timelineItem?.actor.login}
            <//>
            ${" added the "}
            <${IssueLabel}
              nameWithOwner=${repository.nameWithOwner}
              label=${timelineItem.label}
            />
            ${" label "}
            <a href="#" className="link-gray">
              <${RelativeTime} date=${timelineItem.createdAt}>
                on ${timelineItem.createdAt}
              <//>
            <//>
          </div>
        </div>
      `;
    default:
      return html`
        <div className="TimelineItem">
          <div className="TimelineItem-badge">
            <${FlameIcon} />
          </div>

          <div className="TimelineItem-body">
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
      ... on RenamedTitleEvent {
        ...IssueTimelineRenamedTitleEvent_renamedTitleEvent
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
    ${IssueTimelineRenamedTitleEvent.fragments.renamedTitleEvent}
    ${IssueTimelineIssueComment.fragments.comment}
  `,
};

export default TimelineItem;
