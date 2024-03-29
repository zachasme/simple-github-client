import { PencilIcon } from "@primer/octicons-react";
import { html } from "htm/react";
import { gql } from "@apollo/client";

import SimpleEvent from "./SimpleEvent.js";

function RenamedTitleEvent({ item }) {
  return html`
    <${SimpleEvent} Badge=${PencilIcon} item=${item}>
      ${"changed the title to "}
      <del className="text-bold">${item.previousTitle}</del>
      <ins className="text-bold">${item.currentTitle}</ins>
    <//>
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
