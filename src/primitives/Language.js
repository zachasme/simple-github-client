import { html } from "htm/preact";
import gql from "graphql-tag";

import Dot from "./Dot.js";

function Language({ language }) {
  return html`
    <span class="ml-0 mr-3">
      <${Dot} color=${language.color} />
      <span>${language.name}</span>
    </span>
  `;
}

Language.fragments = {
  language: gql`
    fragment Language_language on Language {
      color
      name
    }
  `,
};

export default Language;
