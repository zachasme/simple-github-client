import { PencilIcon } from "@primer/octicons-react";
import { Fragment } from "react";
import { html } from "htm/react";
import { gql } from "urql";

import TimelineItem from "./TimelineItem.js";

function RenamedTitleEvent({ item }) {
  console.log("###", item);

  return html`
    <${TimelineItem}
      Badge=${PencilIcon}
      item=${item}
      text=${html`
        <${Fragment}
          ${"changed the title to "}
          <del className="text-bold">${item.previousTitle}</del>
          <ins className="text-bold">${item.currentTitle}</ins>
        <//>
    `}
    />
  `;
}

RenamedTitleEvent.fragments = {
  item: gql`
    fragment RenamedTitleEvent_item on RenamedTitleEvent {
      id
      createdAt
      currentTitle
      previousTitle
      actor {
        avatarUrl
        login
      }
    }
  `,
};

export default RenamedTitleEvent;
