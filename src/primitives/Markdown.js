import { html } from "htm/react";
import marked from "marked";

function Markdown({ markdown }) {
  return html`<div
    className="markdown-body"
    dangerouslySetInnerHTML=${{ __html: marked(markdown) }}
  />`;
}

export default Markdown;
