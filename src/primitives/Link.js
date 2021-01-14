import { html } from "htm/preact";

// todo: preloading
function Link(props) {
  return html`<a ...${props} />`;
}

export default Link;
