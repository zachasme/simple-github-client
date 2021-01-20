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
import ReferencedEvent from "./ReferencedEvent.js";
import RenamedTitleEvent from "./RenamedTitleEvent.js";

const COMPONENTS = {
  AssignedEvent,
  ClosedEvent,
  CrossReferencedEvent,
  IssueComment,
  LabeledEvent,
  UnlabeledEvent,
  ReferencedEvent,
  RenamedTitleEvent,
};

function IssueTimeline({ issue, repository }) {
  return html`
    <${Fragment}>
      ${issue.timelineItems.edges.map(({ node }) => {
        const EventComponent = COMPONENTS[node.__typename];
        if (!EventComponent) {
          console.warn(`Unimplemented event component for ${node.__typename}`);
          console.debug(node);
          return null;
        }
        return html`
          <${EventComponent}
            key=${node.id}
            item=${node}
            repository=${repository}
          />
        `;
      })}
    <//>
  `;
}

IssueTimeline.fragments = {
  repository: gql`
    fragment IssueTimeline_repository on Repository {
      id
      nameWithOwner
    }
  `,
  issue: gql`
    fragment IssueTimeline_issue on Issue {
      timelineItems(
        first: 50
        itemTypes: [
          ASSIGNED_EVENT
          CLOSED_EVENT
          CROSS_REFERENCED_EVENT
          ISSUE_COMMENT
          LABELED_EVENT
          RENAMED_TITLE_EVENT
          REFERENCED_EVENT
          UNLABELED_EVENT
        ]
      ) {
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
            ...ReferencedEvent_item
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
    ${ReferencedEvent.fragments.item}
  `,
};

export default IssueTimeline;
