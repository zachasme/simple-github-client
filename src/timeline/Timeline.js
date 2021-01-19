import { FlameIcon } from "@primer/octicons-react";
import { Fragment } from "react";
import { html } from "htm/react";
import { gql } from "urql";

import AssignedEvent from "./AssignedEvent.js";
import ClosedEvent from "./ClosedEvent.js";
import CrossReferencedEvent from "./CrossReferencedEvent.js";
import IssueComment from "./IssueComment.js";
import LabeledEvent from "./LabeledEvent.js";
import UnlabeledEvent from "./UnlabeledEvent.js";
import RenamedTitleEvent from "./RenamedTitleEvent.js";

const COMPONENTS = {
  AssignedEvent,
  ClosedEvent,
  CrossReferencedEvent,
  IssueComment,
  LabeledEvent,
  UnlabeledEvent,
  RenamedTitleEvent,
};

function GenericEvent({ item }) {
  return html`
    <div className="TimelineItem">
      <div className="TimelineItem-badge">
        <${FlameIcon} />
      </div>

      <div className="TimelineItem-body">
        not implemented: ${item.__typename}, ... ${JSON.stringify(item)}
      </div>
    </div>
  `;
}

function Timeline({ issue, repository }) {
  return html`
    <${Fragment}>
      ${issue.timelineItems.edges.map(
        ({ node }) => html`
          <${COMPONENTS[node.__typename] || GenericEvent}
            key=${node.id}
            item=${node}
            repository=${repository}
          />
        `
      )}
    <//>
  `;
}

Timeline.fragments = {
  repository: gql`
    fragment Timeline_repository on Repository {
      id
      nameWithOwner
    }
  `,
  issue: gql`
    fragment Timeline_issue on Issue {
      timelineItems(first: 50) {
        edges {
          node {
            ... on Node {
              id
            }
            __typename
            ...AssignedEvent_item
            ...ClosedEvent_item
            ...CrossReferencedEvent_item
            ...IssueComment_item
            ...LabeledEvent_item
            ...RenamedTitleEvent_item
            ...UnlabeledEvent_item
          }
        }
      }
    }
    ${AssignedEvent.fragments.item}
    ${ClosedEvent.fragments.item}
    ${CrossReferencedEvent.fragments.item}
    ${IssueComment.fragments.item}
    ${LabeledEvent.fragments.item}
    ${UnlabeledEvent.fragments.item}
    ${RenamedTitleEvent.fragments.item}
  `,
};

export default Timeline;
