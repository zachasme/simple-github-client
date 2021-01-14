import { html } from "htm/preact";
import marked from "marked";

function Markdown({ markdown }) {
  return html`<div class="markdown-body">${html([marked(markdown)])}</div>`;
}

export default Markdown;
