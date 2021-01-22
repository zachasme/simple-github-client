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

function IssueTimeline({ issueTimelineItems, repository }) {
  return html`
    <${Fragment}>
      ${issueTimelineItems.map((node) => {
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
  issueTimelineItems: gql`
    fragment IssueTimeline_issueTimelineItems on IssueTimelineItems {
      ... on Node {
        id
      }
      ... on IssueComment {
        ...IssueComment_comment
        ...IssueComment_reactable
      }
      __typename
      ...AssignedEvent_item
      ...ClosedEvent_item
      ...CrossReferencedEvent_item
      ...LabeledEvent_item
      ...RenamedTitleEvent_item
      ...ReferencedEvent_item
      ...UnlabeledEvent_item
    }
    ${AssignedEvent.fragments.item}
    ${ClosedEvent.fragments.item}
    ${CrossReferencedEvent.fragments.item}
    ${IssueComment.fragments.comment}
    ${IssueComment.fragments.reactable}
    ${LabeledEvent.fragments.item}
    ${UnlabeledEvent.fragments.item}
    ${RenamedTitleEvent.fragments.item}
    ${ReferencedEvent.fragments.item}
  `,
  repository: gql`
    fragment IssueTimeline_repository on Repository {
      id
      nameWithOwner
    }
  `,
};

export default IssueTimeline;
