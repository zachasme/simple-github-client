import { html } from "htm/react";
import { parse } from "marked";

function Markdown({ markdown }) {
  return html`<div
    className="markdown-body"
    dangerouslySetInnerHTML=${{ __html: parse(markdown) }}
  />`;
}

export default Markdown;
